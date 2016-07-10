/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

import { parseQuery, stringifyRequest } from 'loader-utils'
import path from 'path'
import wrapper from './utils/wrapper'
const wrap = wrapper('universal-style-loader/lib/index.js')

module.exports = function() {}
module.exports.pitch = function pitch (remainingRequest) {
  if(this.cacheable) this.cacheable()
  var query = parseQuery(this.query)

  const addStylesPath = path.join(__dirname, 'compile', 'addStyles.js')
  const addStyles = `require(${stringifyRequest(this, `!${addStylesPath}`)}).default`

  return wrap(`
/** Adds some css to the DOM by adding a <style> tag */

/** load the styles */
var content = require(${stringifyRequest(this, `!!${remainingRequest}`)});
if(typeof content === 'string')
  content = [[module.id, content, '']];

/** add the styles to the DOM */
var update = ${addStyles}(content, ${JSON.stringify(query)});
if(content.locals) module.exports = content.locals;

/** Hot Module Replacement */
if(module.hot) {
  // When the styles change, update the <style> tags
  if(!content.locals) {
    module.hot.accept(${stringifyRequest(this, `!!${remainingRequest}`)}, function() {
      var newContent = require(${stringifyRequest(this, `!!${remainingRequest}`)});
      if(typeof newContent === 'string')
        newContent = [[module.id, newContent, '']];
      update(newContent);
    });
  }
  /** When the module is disposed, remove the <style> tags */
  module.hot.dispose(function() { update(); });
}`, 'pitch')
}
