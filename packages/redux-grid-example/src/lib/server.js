import Promise from 'bluebird'
import express from 'express'
import { server, log } from '../config'
import http from 'http'
import https from 'https'
import proxy from './proxy'
import configureRouter from './router/configureRouter'
//import { readPfx } from './tls'
import { assert } from 'chai'
import webpackConfig from '../webpack.config'

const start = ({ app, scheme, binding, opts }) => new Promise((resolve, reject) => {
  assert.ok(binding, 'bindings must be specified')
  assert.typeOf(binding.port, 'number', 'binding port must be a valid port number')
  assert.ok(scheme, 'must specify scheme')
  assert(scheme === 'http', 'only http scheme supported at this time')
  const { port } = binding
  const s = http.createServer(app)
  s.listen(binding.port, err => {
    if(err) return reject(err)
    log.info(`STARTED @ http://:::${port}`)
  })
  resolve(() => new Promise((resolve, reject) => s.close(err => {
    if(err)
      return reject(err)
    log.info(`STOPPED @ http://:::${port}`)
    resolve()
  })))
})

const getCdnBinding = () => new Map(server.bindings.cdn)

/** Which config name to use when hot reloading */
const hotConfigName = 'app'
const configureServer = ({ paths }) => {
  let serverMap = new Map()
  for(let [scheme, binding] of getCdnBinding().entries()) {
    let app = Object.assign(express(), { settings: server, locals: paths })

    /** Enable proxying */
    app.set('trust proxy', true)

    if (process.env.NODE_ENV === 'hot') {
      log.info('SERVER STARTING HOT')
      let hotConfig = Array.isArray(webpackConfig) ? webpackConfig.filter(x => x.name === hotConfigName)[0] : webpackConfig

      let compiler = require('webpack')(hotConfig)
      log.info(hotConfig, 'HOT CONFIG')
      const { output } = hotConfig
      app.use(require('webpack-dev-middleware')(compiler, { noInfo: true
                                                          , publicPath: output.publicPath
                                                          //, quiet: false
                                                          //, headers: { 'Access-Control-Allow-Origin': '*' }
                                                          //, stats: { colors: true }
                                                          }))
      app.use(require('webpack-hot-middleware')(compiler))
    } else {
      log.info('SERVER STARTING COLD')
    }

    const isSecure = scheme === 'https'
    app.use(configureRouter({ isSecure, paths }))

    let environment = { NODE_ENV: process.env.NODE_ENV }
    log.info({ environment }, 'ENVIRONMENT')

    serverMap.set(scheme, { app
                          , start: () => start({ app, scheme, binding })
                          })
  }
  //proxy()
  return serverMap
}

export default configureServer
