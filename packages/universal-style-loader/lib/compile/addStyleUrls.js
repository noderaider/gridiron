'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addStyleUrls;

var _universalStyles = require('universal-styles');

var _universalStyles2 = _interopRequireDefault(_universalStyles);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

var universalContext = (0, _universalStyles2.default)();
exports.default = universalContext(addStyleUrls);
function addStyleUrls(cssUrl) {
  //console.trace('addStyleUrls => ', util.inspect(cssUrl))
  var styleElement = document.createElement('link');
  styleElement.rel = 'stylesheet';
  styleElement.type = 'text/css';
  styleElement.href = cssUrl;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(styleElement);
  if (module.hot) {
    return function update(cssUrl) {
      if (typeof cssUrl === 'string') {
        styleElement.href = cssUrl;
      } else {
        head.removeChild(styleElement);
      }
    };
  }
}