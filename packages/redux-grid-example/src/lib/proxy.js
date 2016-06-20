/***
 * Proxy Module
 * Responsible for reading proxy config and setting up proxies.
 * @module server/proxy
 */
import httpProxy from 'http-proxy'
import http from 'http'
import https from 'https'
import { server as serverConfig, log } from '../config'

const proxyListen = ({ name, fromPort, toHost, toPort }) => `proxy ${name} directing from :${fromPort} to ${toHost}:${toPort}`

export default function proxy() {
  const cdnBindings = new Map(serverConfig.bindings.cdn)
  const hasHttp = cdnBindings.has('http')
  const hasHttps = cdnBindings.has('https')
  //const cors = getCors()
  const proxyConfigs = Array.isArray(serverConfig.proxies) ? serverConfig.proxies : [ serverConfig.proxies ]
  if(proxyConfigs.length === 0)
    return

  /*** Iterate proxy configs and start routing */
  proxyConfigs.forEach(config => {
    const options = getProxyOptions(config)
    const proxyServer = httpProxy.createProxyServer(options)
    const listenMessage = proxyListen(config)

    proxyServer.on('error', (err, req, res) => {
      log.error(err, 'error proxying request')
      res.end()
    })

    proxyServer.on('proxyReq', (proxyReq, req, res, options) => { /* This event fires on proxy requests */ })


    createProxyServer(http.createServer(onProxy))

    const createProxyServer = server => {
      if (config.allowWebSockets)
        server.on('upgrade', (req, socket, head) => server.ws(req, socket, head))
      server.listen(config.fromPort, () => log.info(listenMessage))
    }

    const onProxy = (req, res) => {
      //if(!cors.isOk(req))
        //return cors.handleFailure(req, res)

      if(config.stub && config.stub[req.method])
        return proxyStub(req, res)

      if(req.method === 'OPTIONS')
        //return cors.handlePreflight(req, res)

      if (config.latency)
        setTimeout(() => proxyServer.web(req, res), config.latency)
      else
        proxyServer.web(req, res)
    }

    const proxyStub = (req, res) => {
      var stub = config.stub[req.method]
      res.writeHead(200, stub.headers)
      if (stub.headers['content-length'] === 0) res.end()
      else res.end(JSON.stringify(stub.body))
    }
  })
}

const getProxyOptions = config => {
  var opts =  { target: config.target || `${config.toScheme}://${config.toHost}:config.toPort`
              , xfwd: true
              }
  opts.secure = config.secure
  return opts
}
