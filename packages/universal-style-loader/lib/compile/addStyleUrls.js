'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * MIT License http://www.opensource.org/licenses/mit-license.php
                                                                                                                                                                                                                                                   * Author Tobias Koppers @sokra (style-loader)
                                                                                                                                                                                                                                                   * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
                                                                                                                                                                                                                                                   */

exports.default = addStyleUrls;

var _universalStyles = require('universal-styles');

var _universalStyles2 = _interopRequireDefault(_universalStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addStyleUrls(cssUrl) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
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
  } else {
    var enqueue = (0, _universalStyles2.default)(addStyleUrls);
    enqueue(cssURL);
  }
}