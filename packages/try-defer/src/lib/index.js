/**
 * Creates a global object that allows replaying of failed logic at a deferred time.
 * @param  {Function} fn     The function that may fail
 * @return {Function}        A replica of the function that will internally catch errors and allow them to be executed sequentially at a deferred time.
 */
export default function tryDefer (condition) {
  let _queue: []
  let enqueue = (fn, args, errors) => _queue.push({ fn, args, errors })

  function _flush () {
    const queue = _queue
    _queue = []
    return queue
  }

  function replay (queue = _flush()) {
    while(queue.length > 0) {
      attempt(queue.shift())
    }
  }

  function attempt ({ fn, args, errors = [], attempt = 0 }) {
    try {
      if(condition && condition())
        fn(...args)
      else
        enqueue(fn, args, errors, attempt + 1)
    } catch(err) {
      enqueue(fn, args, [ ...errors, err ], attempt + 1)
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

  /** Returns a 2 item array of thunk that wraps a function and functions for replaying in various scenarios. */
  return ([ fn => (...args) => attempt({ fn, args })
          , { replay, serialize, reactReplay }
          ])
}
