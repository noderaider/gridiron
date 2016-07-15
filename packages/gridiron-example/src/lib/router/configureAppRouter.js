import Promise from 'promise'
import Immutable from 'immutable'
import Router from 'router'
import serveFile from 'serve-file'
import serveStatic from 'serve-static'
import path from 'path'
import React from 'react'
import reactStamp from 'react-stamp'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import cookieParser from 'cookie-parser'
import cookie from 'react-cookie'

import { serialize, createInitialState } from 'fire-hydrant'

import { getThemeForUrl } from '../context/theme'
import { defaultTheme, getTheme } from '../context'
import { server, packageName, packageKey, faviconUrl, log, IS_HOT, IS_DEV, noop, resolveRoot, initialState } from '../../config'
import { deauthorized, hydrateIdentity } from '../redux/actions/identity'
import minify from '../services/minify'
import logging from '../services/logging'
import { removeLegacyCookies } from '../services/persistence'
import configureStore from '../redux/store/configureStore'
import routes from '../app/routes'
import util from 'util'
import { reactStyles, serializeStyles, RoutingError } from 'universal-styles'

import ErrorPage from '../components/ErrorPage'

import postcss from 'postcss'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import postcssCssnext from 'postcss-cssnext'
import cssnano from 'cssnano'

const cssProcessor = postcss( [ postcssImport({ path: [ resolveRoot('../packages/gridiron-themes/lib') ] })
                              , postcssUrl( { url: 'inline'
                                            , assetsPath: '../images'
                                            } )
                              , postcssCssnext()
                              , cssnano()
                              ])

function processCSS(css) {
  return cssProcessor.process(css, {}).then(x => x.css)
}

const BodyInit = ({ theme }) => {
  const { style } = theme
  const { backgroundColor, margin, padding } = style.body
  const __html = minify(`
  /*
  document.body.style.backgroundColor = '${backgroundColor}'
  document.body.style.margin = '${margin}'
  document.body.style.padding = '${padding}'
  console.groupCollapsed('${packageName} => init')
  if(!window.google_tag_manager) console.info("GTM BLOCKED => consider disabling ad block so we can see how much usage we're getting")
  console.groupEnd()
  */
`)
  return <script dangerouslySetInnerHTML={{ __html }}/>
}

const InitialState = createInitialState({ React, Immutable })

const renderMarkup = html => `<!doctype html>\n${renderToStaticMarkup(html)}`


export default function configureAppRouter({ cors, paths }) {
  const { SRC_ROOT, APP_ROOT, LIB_ROOT, STATIC_ROOT, ASSETS_ROOT } = paths
  const universalMiddleware = reactStyles(React, { processCSS })

  return universalMiddleware(req => new Promise((resolve, reject) => {
    const memoryHistory = createMemoryHistory(req.path)
    let store = configureStore(memoryHistory)
    const history = syncHistoryWithStore(memoryHistory, store)
    match({ history
          , routes
          , location: req.url
          }, (error, redirectLocation, renderProps) => {
      const renderBody = () => {
        if (error) {
          return reject(new RoutingError( { status: 500
                                          , statusMessage: 'Body rendering error occurred.'
                                          , error
                                          } ))
        } else if (redirectLocation) {
          return reject(new RoutingError( { status: 302
                                          , redirect: redirectLocation.pathname + redirectLocation.search
                                          } ))
        } else if (renderProps) {
          const state = store.getState()
          const theme = getThemeForUrl(state.visual.theme, req.url)
          const appMarkup = server.flags.render ? renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
                                                : null
          return (
            <body>
              {server.flags.render ? <InitialState globalKey={packageKey} state={state} serialize={serialize} /> : null}
              {server.flags.render ? <div id="root" dangerouslySetInnerHTML={{ __html: appMarkup }}/> : <div id="root" />}
              <script src="/assets/app.js" />
            </body>
          )
        } else {
          reject(false)
        }
      }

      const renderHead = styles => {
        const title = `gridiron-example${IS_HOT ? ' is so hot right now...' : (IS_DEV ? ' is so dev right now...' : '')}`
        const items = [ <meta charSet="utf-8" />
                      , <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      , <title>{title}</title>
                      , <link rel="icon" href={faviconUrl} type="image/x-icon" />
                      , ...styles
                      , <link rel="stylesheet" href="/assets/app.css" type="text/css" />
                      , <script dangerouslySetInnerHTML={{ __html: `(function(d) {
                          var config = { kitId: 'xsj1dhs', scriptTimeout: 3000, async: true },
                          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
                          })(document)
                          ` }} />
                      , <script src="/assets/polyfill.js" />
                      , <script src="/assets/vendor.js" />
                      , <script src="/assets/commons.js" />
                      ]
        return <head>{items.map((x, key) => React.cloneElement(x, { key }))}</head>
      }

      const renderPage = ({ head, body }) => renderMarkup(<html>{head}{body}</html>)
      return resolve({ renderBody, renderHead, renderPage })
    })
  }), (promise, res, next) => {
        return promise
          .then(page => res.send(page))
          .catch(err => {
            if(err === false) {
              return next()
            }
            console.error(err, 'AN ERROR OCCURRED')
            try {
              if(err instanceof RoutingError) {
                const { status, statusMessage, redirect, innerError } = err
                if(status === 302)
                  return res.redirect(302, redirect)
                return res.status(status).send(renderMarkup(<ErrorPage status={status} statusMessage={statusMessage}>{innerError}</ErrorPage>))
              } else {
                return res.status(500).send(renderMarkup(<ErrorPage statusMessage={err.message || error}>{err}</ErrorPage>))
              }
            } catch(internalError) {
              console.error(internalError, 'REALLY BAD ERROR OCCURRED')
            }
          })

  })
}
