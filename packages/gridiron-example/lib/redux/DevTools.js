'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxDevtools = require('redux-devtools');

var _reduxDevtoolsGridMonitor = require('redux-devtools-grid-monitor');

var _reduxDevtoolsDockMonitor = require('redux-devtools-dock-monitor');

var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

var _reduxDevtoolsMultipleMonitors = require('redux-devtools-multiple-monitors');

var _reduxDevtoolsMultipleMonitors2 = _interopRequireDefault(_reduxDevtoolsMultipleMonitors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridMonitor = (0, _reduxDevtoolsGridMonitor.createGridMonitor)({ React: _react2.default, ActionCreators: _reduxDevtools.ActionCreators });
//import LogMonitor from 'redux-devtools-log-monitor'
exports.default = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
  _reduxDevtoolsDockMonitor2.default,
  { toggleVisibilityKey: 'ctrl-h', changePositionKey: 'ctrl-q', defaultIsVisible: false },
  _react2.default.createElement(GridMonitor, null)
));