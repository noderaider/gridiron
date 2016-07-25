import solvent, { TYPES } from 'solvent'
import cn from 'classnames'
import reactStamp from 'react-stamp'

export default function logo (deps, defaults) {
  const { React
        } = solvent({ ...TYPES.React
                    })(deps)

  const { PropTypes } = React
  const { compose } = reactStamp(React)

  return compose(
    { displayName: 'logo'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  }
    , defaultProps: defaults
    , init() {

        this._getIconStyle = (isBusy = false) => {
          const { styles, theme } = this.props
          return cn ( styles.logoIcon
                    , theme.logoIcon
                    , 'fa'
                    , 'fa-circle-o-notch'
                    , 'fa-spin'
                    )
        }

        this.notBusy = () => {
          this.icon.style.animationPlayState = 'paused'
        }

        this.busy = () => {
          this.icon.style.animationPlayState = 'running'
        }

      }
    , componentDidMount() {
        this.notBusy()
      }
    , shouldComponentUpdate(nextProps, nextState) {
        return false
      }
    , render() {
        const { styles, theme, busy } = this.props
        const dockLogoClass = cn( styles.dockLogo
                                , theme.dockLogo
                                )
        const overlayIconClass = cn( styles.overlay, theme.overlay, styles.iconWrap, theme.iconWrap)
        const overlayTextClass = cn( styles.overlay, theme.overlay, styles.textWrap, theme.textWrap)
        const textClass = cn( styles.logoText
                            , theme.logoText
                            )
        return (
          <span className={dockLogoClass}>
            <span className={overlayIconClass}>
              <i ref={x => this.icon = x} className={this._getIconStyle()} />
            </span>
            <span className={overlayTextClass}>
              <span className={textClass}>∳</span>
            </span>
          </span>
        )
      }
    }
  )
}
