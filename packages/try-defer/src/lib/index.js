import serializeJS from 'serialize-javascript'

export function deserialize() {
  if(!window)
    throw new Error('DESERIALIZE MUST BE RUN ON CLIENT')
  if(window.__defer) {
    return window.__defer.map(x => x(tryDefer))
  }
}


export default function tryDefer (condition, { tracing = false } = {}, hydrate) {
  let _queue = hydrate ? hydrate._queue : []
  let _errors = hydrate ? hydrate._errors : []
  let _attempts = hydrate ? hydrate._attempts : 0

/*
  let _tracer = { trace: function trace (...args) {
                  console.trace('try-defer', ...args)
                }
                , error: function error (...args) {
                    console.error('try-defer', ...args)
                  }
                }
                */

  function _execute ({ fn, args }) {
    //if(tracing) _tracer.trace('_execute({ fn, args })', fn, args)
    _attempts += 1
    try {
      if(!condition || condition())
        return fn(...args)
      return _enqueue(fn, args)
    } catch(err) {
      return _enqueue(fn, args, err)
    }
  }

  function _enqueue (fn, args, err) {
    //if(tracing) _tracer.trace('_enqueue(fn, args, err)', fn, args, err)
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
    //if(tracing) _tracer.trace('status()', _status)
    return _status
  }

  function replay () {
    //if(tracing) _tracer.trace('replay()', _queue)
    let queue = _queue
    _queue = []
    let output = []
    while(queue.length > 0) {
      output.push(_execute(queue.shift()))
    }
    return output
  }


  function serialize() {
    const unwind = `(function (tryDefer) {
      var deferArgs = ${serializeJS([ condition, { tracing }, { _queue, _errors, _attempts } ])};
      debugger;
      return tryDefer(deferArgs[0], deferArgs[1], deferArgs[2])[1].replay();
    })`
    const serialized = `window.__defer = window.__defer ? window.__defer.push(${unwind}) : [ ${unwind} ];`
    //if(tracing) _tracer.trace('serialize()', serialized)
    return serialized
  }


  function reactReplay(React) {
    //if(tracing) _tracer.trace('reactReplay(React)', `React? ${typeof React}`)
    const serialized = serialize()
    return props => <script dangerouslySetInnerHTML={{ __html: serialized }} />
  }


  /** Returns a 2 item array of [ thunk, defer ] that wraps a function and functions for replaying in various scenarios. */
  return ([ fn => (...args) => _execute({ fn, args })
          , { status, replay, serialize, deserialize, reactReplay }
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
      if(now <= (typeof after === 'function' ? after() : after)) {
        return false
      }
    }
    if(before) {
      if(now >= (typeof before === 'function' ? before() : before)) {
        return false
      }
    }
    return true
  }, { tracing })
}

