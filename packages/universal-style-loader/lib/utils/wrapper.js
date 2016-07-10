'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapper;
/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

/** Creates a function to wrap string code blocks for better debugging. */
function wrapper(fileName) {
  return function wrap(code, fnName) {
    var location = '' + fileName + (fnName ? ' => ' + fnName : '');
    return '/** ' + location + ': start */\n' + code + '\n/** ' + location + ': end */';
  };
}