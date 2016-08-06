import React, { Component, PropTypes } from 'react'
import FA from 'app/elements/visual/FA'
import { appName } from 'config'

import styles from './TopBar.css'


export default class TopBar extends Component {
  static propTypes =  { logo: PropTypes.element
                      , title: PropTypes.string
                      , subtitle: PropTypes.string
                      , packageName: PropTypes.string
                      }
  render() {
    const { logo, title, subtitle, packageName } = this.props

    return (
      <header className={styles.topBar}>
      {/*
        <button style={header.hamburger} className="hamburger">
          <FA name="bars" size="lg" style={{ color: 'rgb(50, 100, 150)' }} />
        </button>
      */}
        <span className={styles.title}>
          <a href="/" className={styles.anchor} className={styles.anchor}>{logo ? logo : null}{title}{subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}</a>
        </span>
        {/*
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
      */}
      </header>
    )
  }
}
