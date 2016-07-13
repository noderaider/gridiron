import serializeJS from 'serialize-javascript'

export default function tryDefer (condition, { tracing = false } = {}) {
  let _queue = []
  let _errors = []
  let _attempts = 0

  function _execute ({ fn, args }, hard = false) {
    _attempts += 1
    try {
      if(hard || !condition || condition())
        return fn(...args)
      return _enqueue(fn, args)
    } catch(err) {
      if(hard)
        throw err
      return _enqueue(fn, args, err)
    }
  }

  function _enqueue (fn, args, err) {
    let attempt = _attempts
    _queue.push({ fn, args, attempt, err })
    if(err)
      _errors.push(err)
    return ({ deferred: typeof err === 'undefined'
            , attempt
            , err
            })
  }

  function status() {
    const _status = { queue: _queue, errors: _errors, attempts: _attempts }
    return _status
  }

  function replay (hard = false, drain = true) {
    let queue = _queue
    if(drain)
      _queue = []
    let output = []
    for(let queued of queue) {
      output.push(_execute(queued, hard))
    }
    return output
  }


  function serialize() {
    const serialized = `(function (undefined) {
      var queue = ${serializeJS(_queue)};
      var results = [];
      while(queue.length > 0) {
        var item = queue.shift();
        var fn = item.fn;
        var args = item.args;
        results.push(fn.apply(undefined, args));
      }
      return results;
    })();`
    return serialized
  }


  function reactReplay(React) {
    const serialized = serialize()
    return props => <script dangerouslySetInnerHTML={{ __html: serialized }} />
  }


  /** Returns a 2 item array of [ thunk, defer ] that wraps a function and functions for replaying in various scenarios. */
  return ([ fn => (...args) => _execute({ fn, args })
          , { status, replay, serialize, reactReplay }
          ])
}

/** Only execute on browser. */
export function browserDefer({ tracing } = {}) {
  return tryDefer(function condition () {
    if(typeof window === 'undefined')
      return false
    if(typeof document === 'undefined')
      return false
    return true
  }, { tracing })
}


/** Only execute between certain times. */
export function dateDefer({ after, before }, { tracing } = {}) {
  return tryDefer(function dateCondition () {
    const now = Date.now()
    if(after) {
      if(now <= (typeof after === 'function' ? after() : after))
        return false
    }
    if(before) {
      if(now >= (typeof before === 'function' ? before() : before))
        return false
    }
    return true
  }, { tracing })
}

