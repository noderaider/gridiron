'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reactMinimize;

var _components = require('./components');

var components = _interopRequireWildcard(_components);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var applyCapitalization = function applyCapitalization(str) {
  return str.length <= 2 ? str.toUpperCase() : '' + str[0].toUpperCase() + str.slice(1);
};

/**
 * reactMinimize
 * Requires dependencies { React } and returns a component with intelligence.
 */
function reactMinimize(deps, defaults) {
  return Object.keys(components).reduce(function (libs, x) {
    return _extends({}, libs, _defineProperty({}, applyCapitalization(x), components[x](deps, defaults)));
  }, {});
}