/**
 * Creates a global object that allows replaying of failed logic at a deferred time.
 * @param  {Function} fn     The function that may fail
 * @return {Function}        A replica of the function that will internally catch errors and allow them to be executed sequentially at a deferred time.
 */
export default function tryDefer (fn) {
  let _queue: []

  function _flush () {
    const q = _queue
    _queue = []
    return q
  }

  function replay (q = _flush()) {
    while(q.length > 0) {
      const { fn, args, errors } = q.shift()
      try {
        fn(...args)
      } catch(err) {
        _queue.push({ fn, args, errors: errors.concat(err) })
      }
    }
  }

  function serialize() {
    const serialized = require('serialize-javascript')({ execute: () => replay(_queue) })
    return `
if(typeof window === 'object') {
  window.__replay__ = ${serialized};
  window.__replay__.execute();
}`
  }

  function reactReplay(React) {
    return props => <script dangerouslySetInnerHTML={{ __html: serialize() }} />
  }

  function execute(...args) {
    try {
      fn(...args)
    } catch(err) {
      _queue.push({ fn, args, errors: [ err ] })
    }
  }

  return [ execute, { replay, serialize, reactReplay } ]
}
