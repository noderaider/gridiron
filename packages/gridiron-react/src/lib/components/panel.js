import cn from 'classnames'
import reactStamp from 'react-stamp'
const should = require('chai').should()

export default ({ React }, defaults = {}) => {
  const { PropTypes } = React
  const { compose } = reactStamp(React)

  return compose(
    { displayName: 'panel'
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
        const { styles, theme, enabled } = this.props
        const { transition } = this.state
        const className = cn( styles.panel
                            , theme.panel
                            , enabled ? styles.panelEnabled : styles.panelDisabled
                            , enabled ? theme.panelEnabled : theme.panelDisabled
                            , transition ? styles.panelTransition : null
                            , transition ? theme.panelTransition : null
                            )
        return (
          <div className={className}>
            THIS IS THE PANEL
          </div>
        )
      }
    }
  )
}
