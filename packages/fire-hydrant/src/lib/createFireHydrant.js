import serializeJS from 'serialize-javascript'

const NO_RECURSE = [ 'undefined', 'boolean', 'number', 'string', 'symbol', 'function' ]
const shouldRecurse = obj => obj !== null && NO_RECURSE.indexOf(typeof obj) === -1 && !Array.isArray(obj) && typeof obj === 'object'

export default function createFireHydrant({ serializers = [] }) {
  const toHydrant = (obj, deps) => {
    for(let { test, fire, hydrant, validate } of serializers) {
      validate(deps)
      if(test(obj, deps)) {
        const node = fire(obj, deps)
        const __fh = [ node, hydrant ]
        return { __fh }
      }
    }
    if(Array.isArray(obj)) return obj.map(x => shouldRecurse(x) ? toHydrant(x, deps) : x)
    const objKeys = Object.keys(obj)
    if(objKeys.length > 0) {
      return objKeys.reduce((newObj, key) => {
        const node = shouldRecurse(obj[key]) ? toHydrant(obj[key], deps) : obj[key]
        return { ...newObj, [key]: node }
      }, {})
    }
    return obj
  }

  const fromHydrant = (obj, deps) => {
    if(obj.__fh) {
      const [ node, hydrant ] = obj.__fh
      let fn = eval(hydrant)
      return fn(node, deps)
    }
    if(Array.isArray(obj)) return obj.map(x => shouldRecurse(x) ? fromHydrant(x, deps) : x)
    const objKeys = Object.keys(obj)
    if(objKeys.length > 0) {
      return objKeys.reduce((newObj, key) => {
        const node = shouldRecurse(obj[key]) ? fromHydrant(obj[key], deps) : obj[key]
        return { ...newObj, ...{ [key]: node } }
      }, {})
    }
    return obj
  }

  const serialize = (obj, deps) => serializeJS(toHydrant(obj, deps))
  const deserialize = (str, deps) => {
    let obj = JSON.parse(str)
    return fromHydrant(obj, deps)
  }

  return { toHydrant, fromHydrant, serialize, deserialize }
}
