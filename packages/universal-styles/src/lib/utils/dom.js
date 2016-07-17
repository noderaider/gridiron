import applyCapitalization from './applyCapitalization'

export function createDOM(req) {
  const userAgent = req.headers['user-agent']
  const navigator = { userAgent }

  const elements = []
  function createElement(tagName) {
    let attributes = new Map()
    let nodes = { parent: null, children: [] }
    let meta = {}
    function setAttribute (name, value) {
      if(name.startsWith('data-')) {
        let attrName = name.split('-').slice(1).map((x, i) => i > 0 ? applyCapitalization(x) : x).join('')
        meta[attrName] = value
      }
      attributes.set(name, value)
    }
    function getAttribute (name) {
      return attributes.get(name)
    }
    function hasAttribute (name) {
      return attributes.has(name)
    }
    function removeAttribute (name) {
      return attributes.remove(name)
    }

    let element = { tagName
                  , setAttribute
                  , getAttribute
                  , hasAttribute
                  , removeAttribute
                  , get meta() {
                      return meta
                    }
                  , get childNodes() {
                      return nodes.children
                    }
                  }

    function insertBefore(beforeNode, node) {
      let insertAt = nodes.children.map(x => x._id).indexOf(beforeNode._id)
      node.parentNode = element
      nodes.children = nodes.children.splice(insertAt, 0, node)
    }
    function appendChild (node) {
      node.parentNode = element
      nodes.children.push(node)
    }
    function removeChild(node) {
      node.parentNode = null
      nodes.children = nodes.children.filter(x => x._id !== node._id)
    }

    element.insertBefore = insertBefore
    element.appendChild = appendChild
    element.removeChild = removeChild

    switch(tagName) {
      case 'style':
        element.styleSheet = {}
      case 'link':
    }
    elements.push(element)
    return element
  }
  function createTextNode(data) {
    return { data }
  }
  function getElementsByTagName(tagName) {
    return elements.filter(x => x.tagName === tagName)
  }
  function getElementById(id) {
    for(let element of elements) {
      if(element.id === id)
        return element
    }
  }
  const head = createElement('head')
  const body = createElement('body')
  const document =  { head
                    , body
                    , createElement
                    , createTextNode
                    , getElementsByTagName
                    , getElementById
                    }
  global.window = { document, navigator }
  global.document = document
}

export function removeDOM () {
  const dom = { window: global.window
              , document: global.document
              }
  delete global.document
  delete global.window
  return dom
}

export function createDOMContext (fn) {
  return function execute (req) {
    createDOM(req)
    let result = fn()
    const dom = removeDOM()
    return { result, dom }
  }
}
