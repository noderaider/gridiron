import ExtendableError from './ExtendableError'

export default class APIError extends ExtendableError {
  constructor(message, innerError, props = {}) {
    super(message, innerError)
    this.name = 'APIError'
    const { code, input, init, apiName, actionName, inputData, response } = props
    this.code = code
    this.input = input
    this.init = init
    this.apiName = apiName
    this.actionName = actionName
    this.inputData = inputData
    this.response = response
  }
}
