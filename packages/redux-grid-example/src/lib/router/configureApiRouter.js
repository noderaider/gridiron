import Promise from 'bluebird'
import express from 'express'
import fs from 'fs'
import { client as staticConfig, log } from '../../config'
import { getCors } from '../cors'

const requireQ = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err)
        return reject(err)
      resolve(JSON.parse(data))
    })
  })
}

/**
 * API Router
 * Exposes apis for the application.
 */
export default function configureApiRouter() {
  let router = express.Router()
  const cors = getCors()
  staticConfig.STATIC = true

  //CORS middleware
  const allowCrossDomain = (req, res, next) => {
    if(req.method === 'OPTIONS') {
      cors.handlePreflight(req, res)
    } else {
      cors.handle(req, res)
      next()
    }
  }

  router.use(allowCrossDomain)
  router.get('/env', (req, res) => res.json({ NODE_ENV: process.env.NODE_ENV }))
  router.get('/client-config', (req, res) => {
    requireQ(router.locals.CLIENT_CONFIG_PATH)
      .then(clientConfig => {
        if (req.query.pretty === '' || req.query.pretty)
          return res.send(`<html><head><title>tix client config</title></head><body><pre>${JSON.stringify(clientConfig, null, 4)}</pre></body></html>`)
        res.json(clientConfig)
      }, err => {
        log.error(err, 'error occurred during client-config')
        res.json(staticConfig)
      })
  })
  return router
}
