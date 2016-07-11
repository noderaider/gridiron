import { assert } from 'chai'
import { IS_DEV } from '../constants'

import createSerializer from './createSerializer'

export default function createImmutableSerializer() {
  const test = (x, { Immutable }) => Immutable.Iterable.isIterable(x)
  const fire = (x, { Immutable }) => x.toJS()
  const hydrant = '(function (x, d) { return d.Immutable.fromJS(x) })'
  const validate = d => {
    if(IS_DEV) {
      assert.ok(d.Immutable)
      assert.typeOf(d.Immutable, 'object')
    }
  }
  return createSerializer(test, fire, hydrant, validate)
}
