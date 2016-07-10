/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

/** Caches output of expensive function calls and skips execution if they exist. */
export default function memoize (fn) {
  let cache = {}
  return (...args) => {
    let stringifiedArgs = JSON.stringify(args)
    let result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args)
    return result
  }
}
