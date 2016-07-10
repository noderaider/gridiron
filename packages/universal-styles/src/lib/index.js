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

  function replay () {
    const queue = window.__universal__._queue
    window.__universal__._queue = []
    while(queue.length > 0) {
      const { fn, args } = queue.shift()
      fn(...args)
    }
  }

  function serialize() {
    const serialized = require('serialize-javascript')(window.__universal__)
    return `
if(typeof window === 'object') {
  window.__universal__ = JSON.parse(${serialized});
  window.__universal__.replay()
}`
  }

  const reactStyles = React => props => <script dangerouslySetInnerHTML={{ __html: serialize() }} />

  return function enqueue (...args) {
    window.__universal__._queue.push({ fn, args })
  }
}
