'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.libFolder = exports.configPath = undefined;

var _config = require('../../config.js');

var _path = require('path');

var configPath = exports.configPath = (0, _config.resolveRoot)('./config.js');
var libFolder = exports.libFolder = (0, _config.resolveRoot)('./src/lib');

exports.default = function (name) {
  return { 'config': configPath
  };
};