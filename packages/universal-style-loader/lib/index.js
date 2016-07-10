'use strict';

var _loaderUtils = require('loader-utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wrapper = require('./utils/wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrap = (0, _wrapper2.default)('universal-style-loader/lib/index.js'); /**
                                                                           * MIT License http://www.opensource.org/licenses/mit-license.php
                                                                           * Author Tobias Koppers @sokra (style-loader)
                                                                           * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
                                                                           */

module.exports = function () {};
module.exports.pitch = function pitch(remainingRequest) {
  if (this.cacheable) this.cacheable();
  var query = (0, _loaderUtils.parseQuery)(this.query);

  var addStylesPath = _path2.default.join(__dirname, 'compile', 'addStyles.js');
  var addStyles = 'require(' + (0, _loaderUtils.stringifyRequest)(this, '!' + addStylesPath) + ').default';

  return wrap('\n/** Adds some css to the DOM by adding a <style> tag */\n\n/** load the styles */\nvar content = require(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ');\nif(typeof content === \'string\')\n  content = [[module.id, content, \'\']];\n\n/** add the styles to the DOM */\nvar update = ' + addStyles + '(content, ' + JSON.stringify(query) + ');\nif(content.locals) module.exports = content.locals;\n\n/** Hot Module Replacement */\nif(module.hot) {\n  // When the styles change, update the <style> tags\n  if(!content.locals) {\n    module.hot.accept(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ', function() {\n      var newContent = require(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ');\n      if(typeof newContent === \'string\')\n        newContent = [[module.id, newContent, \'\']];\n      update(newContent);\n    });\n  }\n  /** When the module is disposed, remove the <style> tags */\n  module.hot.dispose(function() { update(); });\n}', 'pitch');
};