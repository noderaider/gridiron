'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  switch (name) {
    case 'server':
      return 'node';
    default:
      return 'web';
  }
};