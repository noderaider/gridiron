/**
 * Creates a global object that allows replaying style events at a deferred time.
 * @param  {Function} fn     The function that will not work in a server environment.
 * @param  {[type]}   window [description]
 * @return {[type]}          [description]
 */
export default function universalStyles (fn, window = window || global) {
  if(!window.__universal__)
    window.__universal__ = _create()

  function _create () {
    return  { _queue: []
            , replay
            , serialize
            , reactStyles
            }
  }

  function _enqueueFN (fn) {
    return function enqueue (...args) {
      console.info('ENQUEUE CALLED', fn, args)
      window.__universal__._queue.push({ fn, args })
    }
  }

  function _flush () {
    const q = window.__universal__._queue
    window.__universal__._queue = []
    console.info('FLUSH CALLED', window.__universal__._queue, q)
    return q
  }

  function replay () {
    console.info('REPLAY CALLED')
    const q = _flush()
    while(q.length > 0) {
      const { fn, args } = q.shift()
      fn(...args)
    }
  }

  function serialize() {
    const serialized = require('serialize-javascript')(window.__universal__)
    console.info('SERIALIZE CALLED', serialized)
    return `
if(typeof window === 'object') {
  window.__universal__ = ${serialized};
  window.__universal__.replay();
}`
  }

  function reactStyles (React) {
    return props => <script dangerouslySetInnerHTML={{ __html: serialize() }} />
  }

  return _enqueueFN(fn)
}
