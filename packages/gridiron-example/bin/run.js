#! /usr/bin/env node
'use strict';

require('babel-polyfill');

var _config = require('../config');

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _lib.definePaths)().then(function (paths) {
  _config.log.info({ paths: paths });
  return (0, _lib2.default)(paths).get('http').start();
}).catch(function (err) {
  return _config.log.fatal(err, 'A fatal error occurred.');
});