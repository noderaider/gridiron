import cn from 'classnames'
import reactStamp from 'react-stamp'
const should = require('chai').should()

export default function dock ({ React }, defaults = {}) {
  const { PropTypes } = React
  const { compose } = reactStamp(React)

  return compose(
    { displayName: 'dock'
    , state: { transition: false }
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , enabled: PropTypes.bool.isRequired
                  }
    , defaultProps: { ...defaults
                    , enabled: false
                    }
    , componentWillReceiveProps(nextProps) {
        if(nextProps.enabled !== this.props.enabled)
          this.setState({ transition: true })
        setTimeout(() => this.setState({ transition: false }), 500)
      }
    , render() {
        const { styles, theme, enabled, children } = this.props
        const { transition } = this.state
        const className = cn( styles.dock
                            , theme.dock
                            , enabled ? styles.dockEnabled : styles.dockDisabled
                            , enabled ? theme.dockEnabled : theme.dockDisabled
                            , transition ? styles.dockTransition : null
                            , transition ? theme.dockTransition : null
                            )

        const DockColumn = ({ children }) => (
          <div className={cn(styles.dockColumn, theme.dockColumn)}>
            {children}
          </div>
        )

        return (
          <div className={className}>
            <div className={cn(styles.dockContent, theme.dockContent)}>
              <DockColumn>{children}</DockColumn>
            </div>
          </div>
        )
      }
    }
  )
}
