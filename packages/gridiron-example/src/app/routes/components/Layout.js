import pure from 'lib/modules/pure'
import styles from './styles/Layout.css'
import './styles/vendor/react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
const ReactGridLayout = WidthProvider(Responsive)

const { React, PropTypes } = pure

export default pure (
  { displayName: 'Layout'
  , propTypes:  { children: PropTypes.array.isRequired
                }
  , defaultProps: { className: 'layout'
                  , rowHeight: 30
                  , breakpoints: { xl: 1100, lg: 768, md: 600 }
                  , cols: { xl: 3, lg: 2, md: 1 }

                  , onLayoutChange: layout => console.warn('LAYOUT CHANGED', layout)
                  }
  , init() {
      this.generateLayouts = () => {
        const { children, cols } = this.props
        let spanned = 0
        return Object.entries(cols).reduce((reduced, [ size, col ]) => {
          return ({ ...reduced
                  , [size]: children.map(({ component, ...meta }, i) => {
                      const w = meta.w ? (typeof meta.w === 'number' ? meta.w : meta.w[size]) : 1
                      const h = meta.h ? (typeof meta.h === 'number' ? meta.h : meta.h[size]) : 10
                      const x = spanned % col
                      const y = Math.floor(spanned / col)
                      spanned += w
                      return { x, y, w, h, i: i.toString() }
                    })
                  })
        }, {})
      }
      this.generateDOM = () => {
        const { children } = this.props
        return children.map(({ component }, i) => (
          <div key={i} className={styles.item}>{component}</div>
        ))
      }
    }
  , render() {
      const { children, ...layoutProps } = this.props
      return (
        <ReactGridLayout
          layouts={this.generateLayouts()}
          {...layoutProps}
        >
          {this.generateDOM()}
        </ReactGridLayout>
      )
    }
  }
)
