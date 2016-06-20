import React, { Component, PropTypes } from 'react'

import DevMicro from 'app/elements/micro/DevMicro'
import HotMicro from 'app/elements/micro/HotMicro'
import { contextTypes } from 'lib/context'

import { IS_DEV, IS_HOT } from 'config'

const inlineStyle = { display: 'inline-block' }

const AttributesBar = props => (
  <div style={inlineStyle}>
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
    const { footer } = style

    return (
      <div style={footer.wrapper}>
        <div style={footer.left}>
          <div style={footer.row}>
            <a href="https://js.org" target="_blank" title="JS.ORG | JavaScript Community">
              <img src="https://logo.js.org/dark_horz.png" width="102" alt="JS.ORG Logo"/>
            </a>
            {/* alternatives [bright|dark]_[horz|vert|tiny].png (width[horz:102,vert:50,tiny:77]) */}
          </div>
          <div style={footer.row}>
          </div>
        </div>
        <div style={footer.right}>
          <div style={footer.row}>
          </div>
          <div style={footer.row}>
            <AttributesBar />
          </div>
        </div>
      </div>
    )
  }
}
