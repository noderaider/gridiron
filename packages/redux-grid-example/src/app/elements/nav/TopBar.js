import React, { Component, PropTypes } from 'react'
import FA from 'app/elements/visual/FA'
import { appName } from 'config'

import './TopBar.css'

import { contextTypes } from 'lib/context'

export default class TopBar extends Component {
  static propTypes =  { title: PropTypes.string.isRequired
                      , subtitle: PropTypes.string
                      , packageName: PropTypes.string
                      }
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, packageName } = this.props
    const { palette, color, brand, style } = this.context.theme
    const { header } = style

    return (
      <header style={header.wrapper} id="topbar">
        <button style={header.hamburger}>
          <FA name="bars" size="lg" />
        </button>
        <span style={header.title}>
          <a href="/" style={header.anchor}>{title}{subtitle ? <span style={header.subtitle}>{subtitle}</span> : null}</a>
        </span>
        {packageName ? <span style={header.banner}>
          <a href={`https://nodei.co/npm/${packageName}/`}>
            <img src={`https://nodei.co/npm/${packageName}.png?mini=true`} />
          </a>
        </span> : null}
        <span style={header.settings}>
          <a href="/settings" style={header.anchor}>
            <FA name="cog" size="2x"/>
          </a>
        </span>
      </header>
    )
  }
}
