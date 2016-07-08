import ExtendableError from './ExtendableError'

export const zeroElementsStateError = (prop, ...args) => new StateError(`Cannot remove from state property '${prop}' with zero elements.`, ...args)

export default class StateError extends ExtendableError {
  constructor(message, innerError) {
    super(message, innerError)
    this.name = 'StateError'
  }
}
