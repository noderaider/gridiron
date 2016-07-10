/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

/** Creates a function to wrap string code blocks for better debugging. */
export default function wrapper (fileName) {
  return function wrap (code, fnName) {
    const location = `${fileName}${fnName ? ` => ${fnName}` : ''}`
    return `/** ${location}: start */
${code}
/** ${location}: end */`
  }
}
