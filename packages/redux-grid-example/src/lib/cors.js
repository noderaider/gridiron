import { server as serverConfig, origins } from '../config'
import { devStream } from './stream'

const logOriginPass = (origin, pattern) => log.trace(`PASS: origin [${origin}] matches pattern [${pattern}].`)
const logOriginFail = (origin) => log.trace(`FAIL: origin [${origin}] does not match any patterns.`)
const logOriginDNE = () => log.trace('DNE: origin header does not exist.')

const corsValidator = patterns => {
  return req => (typeof req.headers.origin === 'string'
                ? patterns.filter(x => x.test(req.headers.origin))
                          .map(devStream(x => logOriginPass(req.headers.origin, x))).length > 0
                : true
                )
}

export function getCors() {
  const isOriginOk = origins ? corsValidator(origins.map(x => new RegExp(x))) : true

  const failureStatus = { code: 403
                        , message: '403 Forbidden'
                        }

  const getError = req => req.headers.origin  ? ({ message: logOriginFail(req.headers.origin), code: 10 })
                                              : ({ message: logOriginDNE(), code: 11 })

  const getOptionsHeaders = req => ({ 'Access-Control-Allow-Origin': req.headers.origin
                                    , 'Access-Control-Max-Age': 604800 // Specifies how long the preflight response can be cached in seconds
                                    , 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE'
                                    , 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                                    , 'Access-Control-Allow-Credentials': true
                                    })

  const handle = (req, res) => {
    const resolvedOrigin = req.headers.origin || req.headers.host
    if(!isOriginOk(req))
      return req.headers.origin ? log.error(`proxy -origin [${resolvedOrigin}], method [${req.method}]`) : log.warn('proxy -host [%s], method [%s]', req.headers.host, req.method)
    log.trace(`proxy +${req.headers.origin ? 'origin' : 'host'} [${resolvedOrigin}], method [${req.method}]`)
    res.setHeader('Access-Control-Allow-Origin', resolvedOrigin)
    res.setHeader('Access-Control-Allow-Credentials', true)
  }

  const handlePreflight = (req, res) => {
    res.writeHead(200, getOptionsHeaders(req))
    res.end()
  }

  const handleFailure = (req, res) => {
    res.writeHead(failureStatus.code)
    res.end (JSON.stringify({ message: failureStatus.message
                            , errors: [ getError(req) ]
                            }))
  }

  return  { isOriginOk : isOriginOk
          , failureStatus: failureStatus
          , getError: getError
          , getOptionsHeaders: getOptionsHeaders
          , handle: handle
          , handlePreflight: handlePreflight
          , handleFailure: handleFailure
          }
}
