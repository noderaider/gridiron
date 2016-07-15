'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config.js');

exports.default = function (name) {
  //return 'cheap-module-source-map'
  return 'inline-source-map';
  switch (name) {
    case 'lib':
      return '#eval';
    case 'server':
      return 'source-map';
  }
  if (process.env.NODE_ENV === 'hot') return '#eval';
};