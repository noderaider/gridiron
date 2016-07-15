import Promise from 'bluebird'
import { browserDefer } from 'try-defer'
import { createDOMContext } from './utils/dom'
import util from 'util'
import Router from 'router'
export { default as RoutingError } from './types/RoutingError'

export default function universalStyles () {
  /*
  console.warn('UNIVERSAL STYLES: EXECUTING')
  if(global.__universal__)
    return global.__universal__._context(fn)
  */

  let [ _context, { replay } ] = browserDefer({ tracing: true })
  /*
  global.__universal__ =  { _context
                          , ...defer
                          }
                          */
  global.__universal__ = global.__universal__ || []
  global.__universal__.push(replay)
  return _context
}

function replay() {
  if(!global.__universal__)
    throw new Error('global.__universal__ DNE. You must use the webpack universal-style-loader to serialize styles.')
  global.__universal__.forEach(x => x(true, false))
}

export function reactStyles(React, { processCSS } = {}) {
  function renderStyles (req) {
    return extractElements(req, processCSS)
      .then(elements => elements.map(({ tagName
                                      , attributes
                                      , children
                                      }, i) => {
      switch(tagName) {
        case 'style':
          return <style {...attributes} dangerouslySetInnerHTML={{ __html: children }} />
        case 'link':
          return <link {...attributes} />
        default:
          throw new Error(`Unsupported tagName => ${tagName}`)
      }
    }))
  }

  return function universalMiddleware(renderers, route) {
    let router = new Router()
    router.use(function (req, res, next) {
      route(renderers(req)
        .then(({ renderBody, renderHead, renderPage }) => {
          let body = renderBody()
          return renderStyles(req)
            .then(styles => {
              let head = renderHead(styles)
              let page = renderPage({ body, head })
              return page
            })
        }), res, next)
    })
    return router
  }
}

export function serializeStyles (req, { processCSS } = {}) {
  if(typeof window === 'object') {
    return Promise.resolve(replay())
  } else {
    return extractElements(req, processCSS)
      .then(elements => elements.map(({ tagName
                                      , attributes
                                      , children
                                      }) => {
        let serialized = `<${tagName} ${Object.keys(attributes).map(x => {
          return `${x}="${attributes[x]}"`
        }).join(' ')}${children ? '' : '/'}>`
        return children ? `${serialized}
    ${children}
  </${tagName}>` : serialized
      }).join('\n')
    )
  }
}

function extractElements (req, processCSS) {
  const { result, dom } = createDOMContext(replay)(req)
  console.trace(util.inspect(dom.document))
  const { head, body } = dom.document
  return Promise.all(head.childNodes.map(({ tagName, type, media, styleSheet, href, childNodes }) => {
    switch(tagName) {
      case 'style':
        const result = { tagName, attributes: { type, media } }
        const rawCSS = styleSheet ? styleSheet.cssText : childNodes[0].data
        return processCSS ? processCSS(rawCSS).then(children => ({ ...result, children }))
                          : Promise.resolve({ ...result, children: rawCSS })
      case 'link':
        const attributes = { type: type, href: href }
        return Promise.resolve({ tagName, attributes })
      default:
        throw new Error(`Unsupported element tagName => ${tagName}, type => ${type}`)
    }
  }))
}
