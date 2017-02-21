'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uglifyJs = require('uglify-js');

exports.default = function (content) {
  return (0, _uglifyJs.minify)(content, { fromString: true }).code;
};