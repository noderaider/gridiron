'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserialize = deserialize;
exports.default = tryDefer;
exports.browserDefer = browserDefer;
exports.dateDefer = dateDefer;

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function deserialize() {
  if (!window) throw new Error('DESERIALIZE MUST BE RUN ON CLIENT');
  if (window.__defer) {
    return window.__defer.map(function (x) {
      return x(tryDefer);
    });
  }
}

function tryDefer(condition) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$tracing = _ref.tracing;
  var tracing = _ref$tracing === undefined ? false : _ref$tracing;
  var hydrate = arguments[2];

  var _queue = hydrate ? hydrate._queue : [];
  var _errors = hydrate ? hydrate._errors : [];
  var _attempts = hydrate ? hydrate._attempts : 0;

  /*
    let _tracer = { trace: function trace (...args) {
                    console.trace('try-defer', ...args)
                  }
                  , error: function error (...args) {
                      console.error('try-defer', ...args)
                    }
                  }
                  */

  function _execute(_ref2) {
    var fn = _ref2.fn;
    var args = _ref2.args;

    //if(tracing) _tracer.trace('_execute({ fn, args })', fn, args)
    _attempts += 1;
    try {
      if (!condition || condition()) return fn.apply(undefined, _toConsumableArray(args));
      return _enqueue(fn, args);
    } catch (err) {
      return _enqueue(fn, args, err);
    }
  }

  function _enqueue(fn, args, err) {
    //if(tracing) _tracer.trace('_enqueue(fn, args, err)', fn, args, err)
    var attempt = _attempts;
    _queue.push({ fn: fn, args: args, attempt: attempt, err: err });
    if (err) _errors.push(err);
    return { deferred: typeof err === 'undefined',
      attempt: attempt,
      err: err
    };
  }

  function status() {
    var _status = { queue: _queue, errors: _errors, attempts: _attempts };
    //if(tracing) _tracer.trace('status()', _status)
    return _status;
  }

  function replay() {
    //if(tracing) _tracer.trace('replay()', _queue)
    var queue = _queue;
    _queue = [];
    var output = [];
    while (queue.length > 0) {
      output.push(_execute(queue.shift()));
    }
    return output;
  }

  function serialize() {
    var serialized = '(function (undefined) {\n      var queue = ' + (0, _serializeJavascript2.default)(_queue) + ';\n      var results = [];\n      while(queue.length > 0) {\n        var item = queue.shift();\n        var fn = item.fn;\n        var args = item.args;\n        results.push(fn.apply(undefined, args));\n      }\n      return results;\n    })();';
    /*
      var deferArgs = ${serializeJS([ condition, { tracing }, { _queue, _errors, _attempts } ])};
      return tryDefer(deferArgs[0], deferArgs[1], deferArgs[2])[1].replay();
      */
    //const serialized = `window.__defer = window.__defer ? window.__defer.push(${unwind}) : [ ${unwind} ];`
    //if(tracing) _tracer.trace('serialize()', serialized)
    return serialized;
  }

  function reactReplay(React) {
    //if(tracing) _tracer.trace('reactReplay(React)', `React? ${typeof React}`)
    var serialized = serialize();
    return function (props) {
      return React.createElement('script', { dangerouslySetInnerHTML: { __html: serialized } });
    };
  }

  /** Returns a 2 item array of [ thunk, defer ] that wraps a function and functions for replaying in various scenarios. */
  return [function (fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _execute({ fn: fn, args: args });
    };
  }, { status: status, replay: replay, serialize: serialize, deserialize: deserialize, reactReplay: reactReplay }];
}

/** Only execute on browser. */
function browserDefer() {
  var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var tracing = _ref3.tracing;

  return tryDefer(function condition() {
    if (typeof window === 'undefined') return false;
    if (typeof document === 'undefined') return false;
    return true;
  }, { tracing: tracing });
}

/** Only execute between certain times. */
function dateDefer(_ref4) {
  var after = _ref4.after;
  var before = _ref4.before;

  var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var tracing = _ref5.tracing;

  return tryDefer(function dateCondition() {
    var now = Date.now();
    if (after) {
      if (now <= (typeof after === 'function' ? after() : after)) {
        return false;
      }
    }
    if (before) {
      if (now >= (typeof before === 'function' ? before() : before)) {
        return false;
      }
    }
    return true;
  }, { tracing: tracing });
}