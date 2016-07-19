'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveRoot = exports.__rootname = exports.log = exports.baseUrl = exports.IS_BROWSER = exports.IS_DEV = exports.IS_HOT = exports.noop = exports.libName = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var libName = exports.libName = 'react-formula-themes';
var noop = exports.noop = function noop() {};
var IS_HOT = exports.IS_HOT = process.env.NODE_ENV === 'hot';
var IS_DEV = exports.IS_DEV = process.env.NODE_ENV !== 'production';
var IS_BROWSER = exports.IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';

var baseUrl = exports.baseUrl = '/';

var log = /* !IS_DEV && IS_BROWSER ?*/exports.log = { name: libName, trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop }; /*: createLogger({ name, level: 'info' })*/

var __rootname = exports.__rootname = IS_BROWSER ? '/' : __dirname;
var resolveRoot = exports.resolveRoot = function resolveRoot() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return IS_BROWSER ? '' + __rootname + args.join('/') : _path2.default.resolve.apply(_path2.default, [__rootname].concat(args));
};
