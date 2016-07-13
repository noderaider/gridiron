
function resolveStatus(arg) {
  return typeof arg === 'string'  ? { status: 500, statusMessage: arg }
                                  : { status: 500
                                    , statusMessage: 'A routing error occurred.'
                                    , ...arg
                                    }
}

export default class RoutingError extends Error {
  constructor(arg, fileName, lineNumber) {
    const { status, statusMessage, redirectLocation, error } = resolveStatus(arg)
    super(statusMessage, fileName, lineNumber)
    this.name = 'RoutingError'
    this.status = status
    this.statusMessage = statusMessage
    this.redirect = redirect
    this.message = statusMessage
    this.innerError = error
    if(Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor.name)
    else
      this.stack = (new Error()).stack
  }
}
