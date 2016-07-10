"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = memoize;
/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

/** Caches output of expensive function calls and skips execution if they exist. */
function memoize(fn) {
  var cache = {};
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var stringifiedArgs = JSON.stringify(args);
    var result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn.apply(undefined, args);
    return result;
  };
}