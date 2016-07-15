/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

import { stringifyRequest } from 'loader-utils'
import path from 'path'
import wrapper from './utils/wrapper'
import util from 'util'
const wrap = wrapper('universal-style-loader/lib/url.js')

module.exports = function() {}
module.exports.pitch = function pitchUrl (remainingRequest) {
  this.cacheable && this.cacheable()
  console.trace('url =>', util.inspect({ remainingRequest, self: this }))

  const addStyleUrlsPath = path.join(__dirname, 'compile', 'addStyleUrls.js')
  const addStyleUrls = `require(${JSON.stringify(`!${addStyleUrlsPath}`)}).default`

  return wrap(`
/** Adds a <link> tag to the DOM with a reference to a css file. */
var update = ${addStyleUrls}( require(${stringifyRequest(this, `!!${remainingRequest}`)}) );

/** Hot Module Replacement */
if(module.hot) {
  module.hot.accept(${stringifyRequest(this, `!!${remainingRequest}`)}, function() {
    console.info('universal-style-loader: pitchUrl() (COMPILED) (HOT)')
    update(require(${stringifyRequest(this, `!!${remainingRequest}`)}));
  });
  module.hot.dispose(function() { update(); });
}`, 'pitchUrl')
}
