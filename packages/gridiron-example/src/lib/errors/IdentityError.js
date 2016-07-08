import ExtendableError from './ExtendableError'

export default class IdentityError extends ExtendableError {
  constructor(message, innerError, props = {}) {
    super(message, innerError)
    this.name = 'IdentityError'
    this.message = message
    this.innerError = innerError
    const { tokens, fingerprint } = props
    this.tokens = tokens
    this.fingerprint = fingerprint
  }
}

