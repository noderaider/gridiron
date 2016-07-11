'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = createFireHydrant;

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NO_RECURSE = ['undefined', 'boolean', 'number', 'string', 'symbol', 'function'];
var shouldRecurse = function shouldRecurse(obj) {
  return obj !== null && NO_RECURSE.indexOf(typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === -1 && !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
};

function createFireHydrant(_ref) {
  var _ref$serializers = _ref.serializers;
  var serializers = _ref$serializers === undefined ? [] : _ref$serializers;

  var toHydrant = function toHydrant(obj, deps) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = serializers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _step.value;
        var test = _step$value.test;
        var fire = _step$value.fire;
        var hydrant = _step$value.hydrant;
        var validate = _step$value.validate;

        validate(deps);
        if (test(obj, deps)) {
          var node = fire(obj, deps);
          var __fh = [node, hydrant];
          return { __fh: __fh };
        }
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

    if (Array.isArray(obj)) return obj.map(function (x) {
      return shouldRecurse(x) ? toHydrant(x, deps) : x;
    });
    var objKeys = Object.keys(obj);
    if (objKeys.length > 0) {
      return objKeys.reduce(function (newObj, key) {
        var node = shouldRecurse(obj[key]) ? toHydrant(obj[key], deps) : obj[key];
        return _extends({}, newObj, _defineProperty({}, key, node));
      }, {});
    }
    return obj;
  };

  var fromHydrant = function fromHydrant(obj, deps) {
    if (obj.__fh) {
      var _obj$__fh = _slicedToArray(obj.__fh, 2);

      var node = _obj$__fh[0];
      var hydrant = _obj$__fh[1];

      var fn = eval(hydrant);
      return fn(node, deps);
    }
    if (Array.isArray(obj)) return obj.map(function (x) {
      return shouldRecurse(x) ? fromHydrant(x, deps) : x;
    });
    var objKeys = Object.keys(obj);
    if (objKeys.length > 0) {
      return objKeys.reduce(function (newObj, key) {
        var node = shouldRecurse(obj[key]) ? fromHydrant(obj[key], deps) : obj[key];
        return _extends({}, newObj, _defineProperty({}, key, node));
      }, {});
    }
    return obj;
  };

  var serialize = function serialize(obj, deps) {
    return (0, _serializeJavascript2.default)(toHydrant(obj, deps));
  };
  var deserialize = function deserialize(str, deps) {
    var obj = JSON.parse(str);
    return fromHydrant(obj, deps);
  };

  return { toHydrant: toHydrant, fromHydrant: fromHydrant, serialize: serialize, deserialize: deserialize };
}