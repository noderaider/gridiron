'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tryDefer;
exports.browserDefer = browserDefer;
exports.dateDefer = dateDefer;

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function tryDefer(condition) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$tracing = _ref.tracing;
  var tracing = _ref$tracing === undefined ? false : _ref$tracing;

  var _queue = [];
  var _errors = [];
  var _attempts = 0;

  function _execute(_ref2) {
    var fn = _ref2.fn;
    var args = _ref2.args;
    var hard = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _attempts += 1;
    try {
      if (hard || !condition || condition()) return fn.apply(undefined, _toConsumableArray(args));
      return _enqueue(fn, args);
    } catch (err) {
      if (hard) throw err;
      return _enqueue(fn, args, err);
    }
  }

  function _enqueue(fn, args, err) {
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
    return _status;
  }

  function replay() {
    var hard = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var drain = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var queue = _queue;
    if (drain) _queue = [];
    var output = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var queued = _step.value;

        output.push(_execute(queued, hard));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return output;
  }

  function serialize() {
    var serialized = '(function (undefined) {\n      var queue = ' + (0, _serializeJavascript2.default)(_queue) + ';\n      var results = [];\n      while(queue.length > 0) {\n        var item = queue.shift();\n        var fn = item.fn;\n        var args = item.args;\n        results.push(fn.apply(undefined, args));\n      }\n      return results;\n    })();';
    return serialized;
  }

  function reactReplay(React) {
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
  }, { status: status, replay: replay, serialize: serialize, reactReplay: reactReplay }];
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
      if (now <= (typeof after === 'function' ? after() : after)) return false;
    }
    if (before) {
      if (now >= (typeof before === 'function' ? before() : before)) return false;
    }
    return true;
  }, { tracing: tracing });
}