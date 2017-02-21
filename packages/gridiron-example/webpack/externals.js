'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('../config');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (name) {
  switch (name) {
    case 'server':
      return _config.dependencyNames.reduce(function (externals, name) {
        return _extends({}, externals, _defineProperty({}, name, true));
      }, {});
    case 'vendor':
      return { 'react-addons-css-transition-group': 'ReactCSSTransitionGroup',
        'react-addons-shallow-compare': 'shallowCompare',
        'react': 'React',
        'react-dom': 'ReactDOM'
      };
  }
};