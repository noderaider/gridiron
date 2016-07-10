/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

import { parseQuery, stringifyRequest } from 'loader-utils'
import path from 'path'
import wrapper from './utils/wrapper'
const wrap = wrapper('universal-style-loader/lib/useable.js')

module.exports = function() {}
module.exports.pitch = function pitchUseable (remainingRequest) {
  if(this.cacheable) this.cacheable()
  var query = parseQuery(this.query)

  const addStylesPath = path.join(__dirname, 'compile', 'addStyles.js')
  const addStyles = `require(${stringifyRequest(this, `!${addStylesPath}`)}).default`

  return wrap(`
var refs = 0;
var dispose;
var content = require(${stringifyRequest(this, `!!${remainingRequest}`)});
if(typeof content === 'string') content = [[module.id, content, '']];
exports.use = exports.ref = function() {
 if(!(refs++)) {
   exports.locals = content.locals;
   dispose = ${addStyles}(content, ${JSON.stringify(query)});
 }
 return exports;
};
exports.unuse = exports.unref = function() {
 if(!(--refs)) {
   dispose();
   dispose = null;
 }
};
if(module.hot) {
 var lastRefs = module.hot.data && module.hot.data.refs || 0;
 if(lastRefs) {
   exports.ref();
   if(!content.locals) {
     refs = lastRefs;
   }
 }
 if(!content.locals) {
   module.hot.accept();
 }
 module.hot.dispose(function(data) {
   data.refs = content.locals ? 0 : refs;
   if(dispose) {
     dispose();
   }
 });
}`, 'pitchUseable')
}
