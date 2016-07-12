import { browserDefer } from 'try-defer'
import { createDOMContext } from './utils/dom'
import util from 'util'

export default function universalStyles () {
  if(global.__universal__)
    return global.__universal__._context

  let [ _context, defer ] = browserDefer({ tracing: true })
  global.__universal__ =  { _context
                          , ...defer
                          }
  return _context
}

export function reactStyles(React) {
  if(!global.__universal__ || !global.__universal__.reactReplay)
    return null
  const { reactReplay } = global.__universal__
  if(typeof reactReplay !== 'function')
    throw new Error(`reactReplay was not a function => ${JSON.stringify({ reactReplay })}`)
  return reactReplay(React)
}


export function serializeStyles (req, res) {
  console.warn('serializeStyles')
  if(!global.__universal__)
    throw new Error('global.__universal__ DNE. You must use the webpack universal-style-loader to serialize styles.')

  if(typeof window === 'object') {
    global.__universal__.replay(true)
  } else {
    const elements = extractElements(req, res)
    const maybeAttr = (x, name) => x[name] ? ` ${name}="${x[name]}"` : ''
    const styles = elements.map(x => `
<${x.tagName}${maybeAttr(x, 'type')}${maybeAttr(x, 'href')}${maybeAttr(x, 'media')}${maybeAttr(x, 'rel')}>
${x.tagName !== 'style' ? (` ${x.styleSheet.cssText}
</${x.tagName}>`) : ''}`).join('\n')
    return styles
  }
  return null
}

function extractElements (req, res) {
  const { result, dom } = createDOMContext(function replayInDOM() {
      return global.__universal__.replay(true)
  })(req, res)
  const { head, body } = dom.document
  return head.childNodes
  /*
  const styles = head.childNodes.filter(x => x.tagName === 'style')
  const links = head.childNodes.filter(x => x.tagName === 'link')
  return { styles, links }
  */
}
