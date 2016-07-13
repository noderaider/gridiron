import { browserDefer } from 'try-defer'
import { createDOMContext } from './utils/dom'
import util from 'util'
import Router from 'router'

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
  console.warn('reactStyles')
  return function universalMiddleware(context) {
    let router = new Router()
    router.use(function (req, res, next) {
      let routing = context(req, res)
      if(routing === false) {
        console.warn('CONTEXT RETURNED FALSE, NEXT')
        return next()
      }
      const { renderBody, renderHead, renderPage } = routing
      let body = renderBody()
      if(body === false) {
        console.warn('NO BODY RENDERED, NEXT')
        return next()
      }

      let renderStyles = () => {
        if(!global.__universal__)
          throw new Error('global.__universal__ DNE. You must use the webpack universal-style-loader to serialize styles.')
        if(typeof window === 'object') {
          console.warn('reactStyles, window is an object, replaying direct', util.inspect(global.__universal__))
          global.__universal__.replay(true)
        } else {
          return extractElements(req, res).map(({ tagName
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
          })
        }
      }

      let styles = renderStyles()
      let head = renderHead(styles)
      if(head === false) {
        console.warn('NO HEAD RENDERED, NEXT')
        return next()
      }
      let page = renderPage({ body, head })
      if(page === false) {
        console.warn('NO PAGE RENDERED, NEXT')
        return next()
      }
      return res.send(page)
    })
    return router
  }
}

export function serializeStyles (req, res) {
  console.warn('serializeStyles')
  if(!global.__universal__)
    throw new Error('global.__universal__ DNE. You must use the webpack universal-style-loader to serialize styles.')

  if(typeof window === 'object') {
    global.__universal__.replay(true)
  } else {
    return extractElements(req, res).map(({ tagName
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
  }
}

function extractElements (req, res) {
  const { result, dom } = createDOMContext(function replayInDOM() {
      return global.__universal__.replay(true)
  })(req, res)
  const { head, body } = dom.document
  return head.childNodes.map(({ tagName, type, media, styleSheet, href, childNodes }) => {
    switch(tagName) {
      case 'style':
        return  { tagName
                , attributes: { type
                              , media
                              }
                , children: styleSheet ? styleSheet.cssText : childNodes[0].data
                }
      case 'link':
        return  { tagName
                , attributes: { type: type
                              , href: href
                              }
                }
      default:
        throw new Error(`Unsupported element tagName => ${tagName}, type => ${type}`)
    }
  })
}
