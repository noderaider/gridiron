export default class ExtendableError extends Error {
  constructor(message, innerError) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.innerError = innerError
    if(Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor.name)
    else
      this.stack = (new Error()).stack
  }
}
