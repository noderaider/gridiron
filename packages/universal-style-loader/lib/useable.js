'use strict';

var _loaderUtils = require('loader-utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wrapper = require('./utils/wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrap = (0, _wrapper2.default)('universal-style-loader/lib/useable.js'); /**
                                                                             * MIT License http://www.opensource.org/licenses/mit-license.php
                                                                             * Author Tobias Koppers @sokra (style-loader)
                                                                             * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
                                                                             */

module.exports = function () {};
module.exports.pitch = function pitchUseable(remainingRequest) {
  if (this.cacheable) this.cacheable();
  var query = (0, _loaderUtils.parseQuery)(this.query);

  var addStylesPath = _path2.default.join(__dirname, 'compile', 'addStyles.js');
  var addStyles = 'require(' + (0, _loaderUtils.stringifyRequest)(this, '!' + addStylesPath) + ').default';

  return wrap('\nvar refs = 0;\nvar dispose;\nvar content = require(' + (0, _loaderUtils.stringifyRequest)(this, '!!' + remainingRequest) + ');\nif(typeof content === \'string\') content = [[module.id, content, \'\']];\nexports.use = exports.ref = function() {\n if(!(refs++)) {\n   exports.locals = content.locals;\n   dispose = ' + addStyles + '(content, ' + JSON.stringify(query) + ');\n }\n return exports;\n};\nexports.unuse = exports.unref = function() {\n if(!(--refs)) {\n   dispose();\n   dispose = null;\n }\n};\nif(module.hot) {\n var lastRefs = module.hot.data && module.hot.data.refs || 0;\n if(lastRefs) {\n   exports.ref();\n   if(!content.locals) {\n     refs = lastRefs;\n   }\n }\n if(!content.locals) {\n   module.hot.accept();\n }\n module.hot.dispose(function(data) {\n   data.refs = content.locals ? 0 : refs;\n   if(dispose) {\n     dispose();\n   }\n });\n}', 'pitchUseable');
};