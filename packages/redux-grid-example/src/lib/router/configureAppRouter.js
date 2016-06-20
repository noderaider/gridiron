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
import cookie from 'react-cookie'

import { serialize } from 'fire-hydrant'
import createInitialState from 'fire-hydrant/lib/react/createInitialState'

import { defaultTheme, getTheme } from '../context'
import { packageName, packageKey, faviconUrl, log, IS_HOT, IS_DEV, noop, resolveRoot, initialState } from '../../config'
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
  const title = `redux-grid-example${IS_HOT ? ' is so hot right now...' : (IS_DEV ? ' is so dev right now...' : '')}`
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <link rel="icon" href={faviconUrl} type="image/x-icon" />
      <link rel="stylesheet" href="/assets/app.css" type="text/css" />
      <script src="/assets/polyfill.js" />
      <script src="/assets/vendor.js" />
      <script src="/assets/commons.js" />
    </head>
    <body>
      {theme ? <BodyInit theme={theme} /> : null}
      {state ? <InitialState globalKey={packageKey} state={state} serialize={serialize} /> : null}
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
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
      //cors.handle(req, res)
      cookie.plugToRequest(req, res)
      const memoryHistory = createMemoryHistory(req.path)
      let store = configureStore(memoryHistory)
      const history = syncHistoryWithStore(memoryHistory, store)
      console.warn('STORE =>', store)

/*
      log.info(req.cookies, 'cookies')
      try {
        if(!req.cookies.tixidentity)
          removeLegacyCookies()
      } catch(err) {
        log.error(err, 'An error occurred deleting legacy cookies')
      }
      */

      /* react router match history */
      match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error)
          res.status(500).send(error.message)
        else if (redirectLocation)
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        else if (renderProps) {
          const content = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
          const state = store.getState()
          const theme = getTheme(state.visual.theme, { url: req.url })
          res.send(renderHTML({ content, state, theme }))
        } else
          next()
      })
    } catch(middlewareError) {
      log.error(middlewareError, 'error occurred in App middleware')
      const content = renderToString(<MiddlewareError error={middlewareError} />)
      return res.status(500).send(renderHTML({ content, theme: defaultTheme }))
    }
  })
  return router
}
