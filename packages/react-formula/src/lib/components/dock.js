import cn from 'classnames'
import reactStamp from 'react-stamp'
const should = require('chai').should()

export default function dock ({ React, shallowCompare }, defaults = {}) {
  const { PropTypes } = React
  const { compose } = reactStamp(React)

  return compose(
    { displayName: 'dock'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , transitionDelay: PropTypes.number.isRequired
                  }
    , defaultProps: { ...defaults
                    , transitionDelay: 200
                    }
    , init() {
        let timeoutID = null

        this.isActive = () => {
          const { styles, theme } = this.props
          return !(this.element && this.element.className && this.element.className.includes(styles.dockDisabled))
        }

        this._getStyles = ({ isActive = false, isBusy = false } = {}) => {
          const { styles, theme } = this.props

          const commonClasses = [ styles.dock, theme.dock ]
          const busyClasses = isBusy ? [ styles.busy, theme.busy ] : []
          const transitionClasses = [ styles.dockTransition, theme.dockTransition, ...busyClasses ]

          if(isActive) {
            const enabledClasses =  [ ...commonClasses
                                    , styles.dockEnabled
                                    , theme.dockEnabled
                                    ]
            return ([ cn(enabledClasses)
                    , cn(enabledClasses, transitionClasses)
                    ])
          } else {
            const disabledClasses = [ ...commonClasses
                                    , styles.dockDisabled
                                    , theme.dockDisabled
                                    ]
            return ([ cn(disabledClasses)
                    , cn(disabledClasses, transitionClasses)
                    ])
          }
        }

        this.transition = ([ primaryStyle, transitionStyle ], done) => {
          this.element.className = transitionStyle || primaryStyle
          if(transitionStyle) {
            const { transitionDelay } = this.props
            setTimeout(() => {
              this.element.className = primaryStyle
              if(done) done()
            }, transitionDelay)
          }
        }

        this.toggle = (done = () => {}) => {
          this.props.busy(notBusy => {
            if(this.element) {
              this.transition(this._getStyles({ isActive: !this.isActive(), isBusy: false }), () => {
                done()
                notBusy()
              })
            }
          })
        }

      }
    , shouldComponentUpdate (nextProps) {
        return shallowCompare(this, nextProps)
      }
    , render() {
        const { styles, theme, children, toggleContent } = this.props

        const [ primaryStyle ] = this._getStyles()

        return (
          <div ref={x => this.element = x} className={primaryStyle}>
            <div className={cn(styles.dockContent, theme.dockContent)}>
              <div className={cn(styles.dockColumn, theme.dockColumn)}>
                {children}
              </div>
            </div>

            <div className={cn(styles.buttonContainer, theme.buttonContainer)}>
              <span className={cn(styles.flexSpacer, theme.flexSpacer)} />
              <span className={cn(styles.flexItem, theme.flexItem)}>
                <button
                  className={cn(styles.dockButton, theme.dockButton)}
                  onClick={() => this.toggle()}
                >
                  {toggleContent}
                </button>
              </span>
            </div>
          </div>
        )
      }
    }
  )
}
