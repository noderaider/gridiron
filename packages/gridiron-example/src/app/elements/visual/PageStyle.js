import React, { Component, PropTypes } from 'react'
import { contextTypes } from 'lib/context'

const htmlStyle = theme => ({ height: '100%'
                            , backgroundColor: theme.style.app.backgroundColor
                            })
const bodyStyle = theme => ({ minHeight: '100%'
                            })

const extractStyles = (element, styleKeys) => {
  let style = {}
  for(let styleKey of styleKeys) {
    style[styleKey] = element.style[styleKey]
  }
  return style
}

const setStyles = (element, style) => {
  for(let styleKey of Object.keys(style)) {
    element.style[styleKey] = style[styleKey]
  }
}

const setAllStyles = theme => {
  setStyles(document.documentElement, htmlStyle(theme))
  setStyles(document.body, bodyStyle(theme))
}

/** Global way to control the style of the page across all platforms. */
export default class PageStyle extends Component {
  static contextTypes = contextTypes;
  componentDidMount() {
    const { theme } = this.context
    this.originalStyles = { html: extractStyles(document.documentElement, Object.keys(htmlStyle(theme)))
                          , body: extractStyles(document.body, Object.keys(bodyStyle(theme)))
                          }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.context.theme.name !== nextContext.theme.name
  }
  componentWillUnmount() {
    setStyles(document.documentElement, this.originalStyles.html)
    setStyles(document.body, this.originalStyles.body)
  }
  render() {
    setAllStyles(this.context.theme)
    return <div id={`page-style-${this.context.theme.name}`} />
  }
}
