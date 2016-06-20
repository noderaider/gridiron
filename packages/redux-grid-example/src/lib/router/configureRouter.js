import express from 'express'
import { assert } from 'chai'
import { join } from 'path'
import favicon from 'serve-favicon'

import { server, log, faviconPath } from '../../config'
import { getCors } from '../cors'
import configureUnsupportedRouter from './configureUnsupportedRouter'
import configureSecureRouter from './configureSecureRouter'
import configureApiRouter from './configureApiRouter'
import configureAppRouter from './configureAppRouter'

const cors = getCors()

const gzipExtensionFilter = /^(js|css|html|json|ico|eot|otf|ttf)$/

const contentTypeMap =  { 'js': 'text/javascript'
                        , 'json': 'application/json'
                        , 'css': 'text/css'
                        , 'html': 'text/html'
                        , 'xml': 'text/xml'
                        , 'ico': 'image/x-icon'
                        , 'woff': 'application/x-font-woff'
                        , 'woff2': 'application/font-woff2'
                        , 'ttf': 'application/x-font-ttf'
                        , 'otf': 'application/x-font-otf'
                        , 'eot': 'application/vnd.ms-fontobject'
                        , 'svg': 'image/svg+xml'
                        , 'png': 'image/png'
                        , 'jpg': 'image/jpeg'
                        , 'jpeg': 'image/jpeg'
                        , 'gif': 'image/gif'
                        , 'tiff': 'image/tiff'
                        }


/**
 * configureRouter
 * Constructs a router for the application.
 * @module server/lib/routers/configureRouter
 */
export default function configureRouter({ isSecure, paths }) {
  const { PUBLIC_ROOT
        , STATIC_ROOT
        , ASSETS_ROOT
        , APP_ROOT
        , NODE_MODULES_ROOT
        , DOC_ROOT
        } = paths


  const router = express.Router()


  /** REDIRECT TO HTTPS ROUTE */
  const SECURE_REDIRECTS = []
  if(!isSecure)
    router.use(configureSecureRouter(SECURE_REDIRECTS))

  router.use(favicon(faviconPath))
  router.use('/img', express.static(join(PUBLIC_ROOT, 'img')))

  router.use(configureUnsupportedRouter())
  if(process.env.NODE_ENV !== 'production')
    router.use('/doc', express.static(DOC_ROOT))
  router.use('/assets', express.static(ASSETS_ROOT))
  router.use('/static', express.static(STATIC_ROOT))
  router.use(configureAppRouter({ paths, cors }))
  return router
}
