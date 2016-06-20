import ExtendableError from './ExtendableError'

export default class DOMError extends ExtendableError {
  constructor(message, innerError) {
    super(message, innerError)
    this.name = 'DOMError'
  }
}
