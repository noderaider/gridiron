import { assert } from 'chai'
import Immutable from 'immutable'
import Router from 'router'
import serveFile from 'serve-file'
import serveStatic from 'serve-static'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import cookieParser from 'cookie-parser'
import cookie from 'react-cookie'

import { serialize } from 'fire-hydrant'
import createInitialState from 'fire-hydrant/lib/react/createInitialState'

import { getThemeForUrl } from '../context/theme'
import { defaultTheme, getTheme } from '../context'
import { server, packageName, packageKey, faviconUrl, log, IS_HOT, IS_DEV, noop, resolveRoot, initialState } from '../../config'
import { deauthorized, hydrateIdentity } from '../redux/actions/identity'
import minify from '../services/minify'
import logging from '../services/logging'
import { removeLegacyCookies } from '../services/persistence'
import configureStore from '../redux/store/configureStore.js'
import routes from '../app/routes'


const BodyInit = ({ theme }) => {
  const { style } = theme
  const { backgroundColor, margin, padding } = style.body
  const __html = minify(`
  document.body.style.backgroundColor = '${backgroundColor}'
  document.body.style.margin = '${margin}'
  document.body.style.padding = '${padding}'
  console.groupCollapsed('${packageName} => init')
  if(!window.google_tag_manager) console.info("GTM BLOCKED => consider disabling ad block so we can see how much usage we're getting")
  console.groupEnd()
`)
  return <script dangerouslySetInnerHTML={{ __html }}/>
}

const InitialState = createInitialState({ React, Immutable })


const HTML = ({ content, state, theme }) => {
  const title = `gridiron-example${IS_HOT ? ' is so hot right now...' : (IS_DEV ? ' is so dev right now...' : '')}`
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="icon" href={faviconUrl} type="image/x-icon" />
      <link rel="stylesheet" href="/assets/app.css" type="text/css" />
      <script dangerouslySetInnerHTML={{ __html: `(function(d) {
        var config = { kitId: 'xsj1dhs', scriptTimeout: 3000, async: true },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document)
        ` }} />
      <script src="/assets/polyfill.js" />
      <script src="/assets/vendor.js" />
      <script src="/assets/commons.js" />
    </head>
    <body>
      <BodyInit theme={theme} />
      {server.flags.render ? <InitialState globalKey={packageKey} state={state} serialize={serialize} /> : null}
      {server.flags.render ? <div id="root" dangerouslySetInnerHTML={{ __html: content }}/> : <div id="root" />}
      <script src="/assets/app.js" />
    </body>
    </html>
  )
}

const MiddlewareError = ({ error }) => {
  return (
    <div>
      <h2>An Error Occurred Rendering the Application</h2>
      {IS_DEV ? <pre><code>{error.message || error}{error.stack ? `\n${error.stack}` : null}</code></pre> : null}
    </div>
  )
}

const renderHTML = props => `<!doctype html>
${renderToString(<HTML {...props} />)}`

export default function configureAppRouter({ cors, paths }) {
  const { SRC_ROOT, APP_ROOT, LIB_ROOT, STATIC_ROOT, ASSETS_ROOT } = paths
  let router = Router()
  router.use((req, res, next) => {
    try {
      const memoryHistory = createMemoryHistory(req.path)
      let store = configureStore(memoryHistory)
      const history = syncHistoryWithStore(memoryHistory, store)
      console.info('MADE IT HERE')

      /* react router match history */
      match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error)
          return res.status(500).send(error.message)
        else if (redirectLocation)
          return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        else if (renderProps) {
          const state = store.getState()
          const theme = getThemeForUrl(state.visual.theme, req.url)
          if(server.flags.render) {
            const content = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
            const html = renderHTML({ content, state, theme })
            return res.send(html)
          } else {
            const html = renderHTML({ theme })
            return res.send(html)
          }
        } else {
          next()
        }
      })
    } catch(middlewareError) {
      log.error(middlewareError, 'error occurred in App middleware, continuing...')
      return res.status(500).send(middlewareError.message || middlewareError)
    }
  })
  return router
}
