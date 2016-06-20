import React from 'react'
import { renderToString } from 'react-dom/server'
import Router from 'router'
import { log } from '../../config'
import { detectBrowser } from 'browser-detective'

const HTML = ({ name, title, version, emulatedVersion, platform, platformVersion }) => (
  <html lang="en">
  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title>Unsupported</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <h1>Unsupported Browser Detected</h1>
    <div>Use a modern browser instead.</div>
  </body>
  </html>
)

const getHTML = props => {
  return `<!doctype html>
${renderToString(<HTML {...props} />)}`
}



export default function configureUnsupportedRouter() {
  let router = Router()
  router.use((req, res, next) => {
    const userAgent = req.headers['user-agent']
    if(!userAgent)
      next()
    const browser = detectBrowser(userAgent)
    const { name, title, version, emulatedVersion, platform, platformVersion } = browser

    if(name !== 'ie')
      return next()

    if(version >= 10) {
      log.debug(`supported IE version => Actual[${version}] Emulated[${emulatedVersion}]`)
      return next()
    }
    log.debug(`unsupported IE version => Actual[${version}] Emulated[${emulatedVersion}]`)
    res.send(getHTML(browser))
  })
  return router
}
