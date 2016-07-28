import cn from 'classnames'
const should = require('chai').should()

export default function pane (pure) {
  const { React, PropTypes, defaults } = pure

  return pure (
    { displayName: 'Pane'
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
        const sample = Array.from(Array(20).fill(1))
        const { styles, theme, enabled, children } = this.props
        const { transition } = this.state
        const className = cn( styles.pane
                            , theme.pane
                            , enabled ? styles.paneEnabled : styles.paneDisabled
                            , enabled ? theme.paneEnabled : theme.paneDisabled
                            , transition ? styles.paneTransition : null
                            , transition ? theme.paneTransition : null
                            )

        const PaneColumn = ({ children }) => (
          <div className={cn(styles.paneColumn, theme.paneColumn)}>
            {children}
          </div>
        )

        return (
          <div className={className}>
            <div className={cn(styles.paneContent, theme.paneContent)}>
              <PaneColumn>{children}</PaneColumn>
            </div>
          </div>
        )
      }
    }
  )
}
