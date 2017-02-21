'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactReduxIdleMonitor = require('react-redux-idle-monitor');

var _reactReduxIdleMonitor2 = _interopRequireDefault(_reactReduxIdleMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactReduxIdleMonitor2.default)({ React: _react2.default, connect: _reactRedux.connect });