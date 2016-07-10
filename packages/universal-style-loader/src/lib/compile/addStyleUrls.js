/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

 import universalStyles from 'universal-styles'

export default function addStyleUrls(cssUrl) {
  if(typeof window === 'object') {
    var styleElement = document.createElement('link')
    styleElement.rel = 'stylesheet'
    styleElement.type = 'text/css'
    styleElement.href = cssUrl
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(styleElement)
    if(module.hot) {
      return function update (cssUrl) {
        if(typeof cssUrl === 'string') {
          styleElement.href = cssUrl
        } else {
          head.removeChild(styleElement)
        }
      }
    }
  } else {
    const enqueue = universalStyles(addStyleUrls)
    enqueue(cssURL)
  }
}
