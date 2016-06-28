'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ai = require('./ai');

Object.defineProperty(exports, 'ai', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ai).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }