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
                  , breakpoints: { lg: 1200, md: 996 }
                  , cols: { lg: 3, md: 2 }
                  , onLayoutChange: layout => console.warn('LAYOUT CHANGED', layout)
                  }
  , init() {
      this.generateLayouts = () => {
        const { children, cols } = this.props
        const [ ...iterator ] = Array(children.length).keys()
        return Object.entries(cols).reduce((reduced, [ size, col ]) => {
          return ({ ...reduced
                  , [size]: iterator.map(i => {
                      const y = Math.floor(i / col)
                      return { x: i % col, y, w: 1, h: 8, i: i.toString() }
                    })
                  })
        }, {})
      }
      this.generateDOM = () => {
        const { children } = this.props
        return children.map((component, i) => (
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
