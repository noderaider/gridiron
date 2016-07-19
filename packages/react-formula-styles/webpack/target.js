'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  switch (name) {
    case 'lib':
    case 'server':
      return 'node';
    default:
      return 'web';
  }
};