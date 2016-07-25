import React, { Component, PropTypes } from 'react'

import DevMicro from 'app/elements/micro/DevMicro'
import HotMicro from 'app/elements/micro/HotMicro'
import contextTypes from 'lib/context'

import { IS_DEV, IS_HOT } from 'config'

import styles from './FooterBar.css'


const AttributesBar = props => (
  <div className={styles.attributesBar}>
    {IS_DEV ? <DevMicro /> : null}
    {IS_HOT ? <HotMicro /> : null}
  </div>
)


export default class FooterBar extends Component {
  static propTypes =  { showCopyright: PropTypes.bool.isRequired
                      , showLegal: PropTypes.bool.isRequired
                      , showAttributes: PropTypes.bool.isRequired
                      , errors: PropTypes.array
                      };
  static defaultProps = { showCopyright: true
                        , showLegal: true
                        , showAttributes: IS_DEV
                        };
  static contextTypes = contextTypes;
  render() {
    const { showAttributes, showLegal, showCopyright } = this.props
    const { palette, color, brand, style } = this.context.theme

    /** TODO: FIGURE OUT WHERE THE FUCK THIS CONTEXT STYLES COMING FROM */
    return (
      <div className={styles.footerBar}>
        <div className={styles.left}>
          <div className={styles.row}>
          </div>
          <div className={styles.row}>
            <a href="https://js.org" target="_blank" title="JS.ORG | JavaScript Community">
              <img src="https://logo.js.org/dark_horz.png" width="102" alt="JS.ORG Logo"/>
            </a>
            {/* alternatives [bright|dark]_[horz|vert|tiny].png (width[horz:102,vert:50,tiny:77]) */}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.row}>
          </div>
          <div className={styles.row}>
            <AttributesBar />
          </div>
        </div>
      </div>
    )
  }
}
