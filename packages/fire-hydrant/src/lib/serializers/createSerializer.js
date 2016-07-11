import { assert } from 'chai'
import { IS_DEV } from '../constants'

/** fire function burns it down (serializes), hydrant string evaluates to a function that builds it back up (deserializes) */
export default function createSerializer (test, fire, hydrant, validate = () => {}) {
  if(IS_DEV) {
    assert.ok(test)
    assert.typeOf(test, 'function')
    assert.ok(fire)
    assert.typeOf(fire, 'function')
    assert.ok(hydrant)
    assert.typeOf(hydrant, 'string')
    assert.ok(validate)
    assert.typeOf(validate, 'function')
  }
  return { test, fire, hydrant, validate }
}
