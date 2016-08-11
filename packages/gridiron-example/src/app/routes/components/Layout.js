import pure from 'lib/modules/pure'
import styles from './styles/Layout.css'
import './styles/vendor/react-grid-layout'
import { Responsive, WidthProvider } from 'react-grid-layout'
import EventEmitter from 'eventemitter3'

const ReactGridLayout = WidthProvider(Responsive)

const { React, PropTypes } = pure

export default pure (
  { displayName: 'Layout'
  , propTypes:  { children: PropTypes.array.isRequired
                }
  , state:  { metaOverrides: {}
            }
  , defaultProps: { className: 'layout'
                  , rowHeight: 30
                  , breakpoints: { xl: 1100, lg: 768, md: 600 }
                  , cols: { xl: 3, lg: 2, md: 1 }

                  , onLayoutChange: layout => {

                      //document.querySelector()
                      for(let metaOverride of document.querySelectorAll('[data-layout-meta]')) {
                        const index = metaOverride.getAttribute('data-layout-value')


                      }

                      console.warn('LAYOUT CHANGED', layout)
                    }
                  }
  , init() {
      this.generateLayouts = () => {
        const { children, cols } = this.props
        const { metaOverrides } = this.state
        let spanned = 0
        return Object.entries(cols).reduce((reduced, [ size, col ]) => {
          return ({ ...reduced
                  , [size]: children.map(({ component, ...metaProps }, i) => {
                      const meta = { ...metaProps, ...metaOverrides[i] }
                      const resolveMeta = (metaKey, defaultValue) => {
                        const metaValue = meta[metaKey]
                        switch(typeof metaValue) {
                          case 'number':
                            return metaValue
                          case 'object':
                            return metaValue[size]
                          default:
                            return defaultValue
                        }
                      }

                      const w = resolveMeta('w', 1)
                      const h = resolveMeta('h', 10)
                      const minH = resolveMeta('minH')
                      const maxH = resolveMeta('maxH')
                      const minW = resolveMeta('minW')
                      const maxW = resolveMeta('maxW')
                      const x = spanned % col
                      const y = Math.floor(spanned / col)
                      spanned += w
                      return { x, y, w, h, i: i.toString() }
                    })
                  })
        }, {})

        this.onMetaOverride = ({ i, metaOverride }) => {
          this.setState({ metaOverrides: { ...this.state.metaOverrides, [i]: metaOverride } })
        }
      }
      this.generateDOM = () => {
        const { children } = this.props
        return children.map(({ component }, i) => (
          <div key={i} data-layout-index={i} className={styles.item}>{component}</div>
        ))
      }
    }
  , componentWillMount() {
      this.EE = new EventEmitter()
      this.EE.on('metaOverride', this.onMetaOverride)
    }
  , componentWillUnmount() {
      this.EE.removeListener('metaOverride', this.onMetaOverride)
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
