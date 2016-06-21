'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = require('./components');

var components = _interopRequireWildcard(_components);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var capitalizeFirst = function capitalizeFirst(str) {
  return '' + str[0].toUpperCase() + str.slice(1);
};

/**
 * redux-grid
 * Requires dependencies { React, FixedDataTable, connect } and exports a higher order component and controls that can select from redux state.
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */

exports.default = function (dependencies) {
  return Object.keys(components).reduce(function (reduxGrid, x) {
    return _extends({}, reduxGrid, _defineProperty({}, capitalizeFirst(x), components[x](dependencies)));
  }, {});
};