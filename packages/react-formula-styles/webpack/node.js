'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  switch (name) {
    case 'lib':
    case 'server':
      return { __filename: true, __dirname: true, console: true, net: true };
    default:
      return { fs: 'empty', 'graceful-fs': 'empty' };
  }
};