import React from 'react'
import ReactDOM from 'react-dom'
import { appName, dom } from 'config-client'
import { addTiming } from '../global/performance'
import { createLogger } from 'bunyan'
import { assert } from 'chai'

const log = createLogger({ name: 'dom/elements', level: 'debug' })

const blockerRule = 'body { display: none; }'
const blockerStyle = document.createElement('style')
blockerStyle.type = 'text/css'
export const blockBody = () => {
  addTiming('blockBodyStart')
  document.head.appendChild(blockerStyle)
  blockerStyle.sheet.insertRule(blockerRule, 0)
  addTiming('blockBodyEnd')
}

export const unblockBody = () => {
  addTiming('unblockBodyStart')
  document.head.removeChild(blockerStyle)
  addTiming('unblockBodyEnd')
}

const appendDOM = (id, style, onDispose) => {
  /** If element already exist in DOM and global, append it. */
  assert.ok(document.body.appendChild, 'requires document.body.appendChild function')
  assert.ok(id, 'root element id is required')

  const element = document.createElement('div')
  element.dispose = overrideName => {
    onDispose()
    document.body.removeChild(element)
    element.isDisposed = true
    log.debug({ overrideName }, `Element '${name}' was disposed`)
  }

  if(style) {
    for(let propName of Object.keys(style))
      element.style[propName] = style[propName]
  }
  document.body.appendChild(element)
  return element
}

const pollingFrequency = 30
const appendDOMWhenReady = (id, style, onDispose) => {
  if(document.body)
    return Promise.resolve(appendDOM(id, style, onDispose))
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if(!document.body)
        return
      clearInterval(interval)
      resolve(appendDOM(id, style, onDispose))
    }, pollingFrequency)
  })
}

export default class RootElement {
  constructor(elementName, containerStyle, props) {
    this._name = elementName
    this._containerStyle = containerStyle
    this._props = props
    this._triggerEvent = event => addTiming(`${appName}${event}`)
    this._triggerEvent('Ctor')
  }
  render = props => {
    this._triggerEvent('RenderStart')
    return appendDOMWhenReady(this.id, this._containerStyle, this.dispose)
      .then(element => {
        this.reference = element
        ReactDOM.render(<div id={this.id} ref={x => this.innerReference=x} {...this._props} />, element)
        this._triggerEvent('RenderEnd')
      })
  };
  get reference() {
    window[appName] = window[appName] || {}
    return window[appName][this._name]
  }
  set reference(element) {
    window[appName] = window[appName] || {}
    window[appName][this._name] = element
  }
  get id() {
    return `${appName}-${this._name}`
  }
  dispose = () => {
    this._triggerEvent('Dispose')
    ReactDOM.unmountComponentAtNode(this.reference)
  };
}

const getOverridingElementSet = name => {
  let overridingSet = new Set()
  for(let [overrideName, overridesNames] of disposalMap) {
    if(overridesNames.includes(name))
      overridingSet.add(overrideName)
  }
  return overridingSet
}

/** Disposes earlier loaded elements that should no coexist with current loading element. */
const disposeOverriddenDOMElements = name => {
  let disposals = disposalMap.get(name)
  if(!Array.isArray(disposals)) /** Element has no disposals. */
    return
  disposals.forEach(disposeName => {
    let disposeElement = getElementFromGlobal(disposeName)
    if(!disposeElement || disposeElement.isDisposed) /** Element not in DOM, move on. */
      return
    if(typeof disposeElement.dispose !== 'function')
      throw new Error(`Disposable elements must implement a dispose function => disposeName === '${disposeName}'`)
    disposeElement.dispose(name)
  })
}


export const getElementFromGlobal = elementName => {
  if(!window[name])
    throw new Error(`window.${name} is not defined.`)
  return window[name][elementName]
}
