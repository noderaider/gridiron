'use strict';

var _loaderUtils = require('loader-utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wrapper = require('./utils/wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

var wrap = (0, _wrapper2.default)('universal-style-loader/lib/url.js');

module.exports = function () {};
module.exports.pitch = function pitchUrl(remainingRequest) {
  this.cacheable && this.cacheable();
  //console.trace('url =>', util.inspect({ remainingRequest, self: this }))

  var addStyleUrlsPath = _path2.default.join(__dirname, 'compile', 'addStyleUrls.js');
  var addStyleUrls = 'require(' + JSON.stringify('!' + addStyleUrlsPath) + ').default';

  return wrap('\n/** Adds a <link> tag to the DOM with a reference to a css file. */\nvar update = ' + addStyleUrls + '( require(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ') );\n\n/** Hot Module Replacement */\nif(module.hot) {\n  module.hot.accept(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ', function() {\n    /* console.info(\'universal-style-loader: pitchUrl() (COMPILED) (HOT)\') */\n    update(require(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + '));\n  });\n  module.hot.dispose(function() { update(); });\n}', 'pitchUrl');
};