'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pureStamp = require('pure-stamp');

var _pureStamp2 = _interopRequireDefault(_pureStamp);

var _gridiron = require('./gridiron');

var _gridiron2 = _interopRequireDefault(_gridiron);

var _IdleMonitor = require('./components/IdleMonitor');

var _IdleMonitor2 = _interopRequireDefault(_IdleMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _pureStamp2.default)(_extends({}, _gridiron.deps, { gridiron: _gridiron2.default, IdleMonitor: _IdleMonitor2.default }), {});