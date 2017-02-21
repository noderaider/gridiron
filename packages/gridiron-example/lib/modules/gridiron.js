'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deps = undefined;

var _gridiron = require('gridiron');

var _gridiron2 = _interopRequireDefault(_gridiron);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _reactRouterRedux = require('react-router-redux');

var _reactRedux = require('react-redux');

var _pre = require('./pre');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deps = exports.deps = { React: _react2.default, ReactDOM: _reactDom2.default, shallowCompare: _reactAddonsShallowCompare2.default, createFragment: _reactAddonsCreateFragment2.default, connect: _reactRedux.connect, push: _reactRouterRedux.push, Immutable: _immutable2.default, Pre: _pre.Pre };

var themeName = 'mellow';

exports.default = (0, _gridiron2.default)(deps, { themeName: themeName });