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
        const sample = Array.from(Array(5).fill(1))
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
            <div className={cn(styles.panelContent, theme.panelContent)}>
              <div className={cn(styles.panelRow, theme.panelRow)}>
                {sample.map((x, i) => (
                    <div key={i} className={cn(styles.panelItem, theme.panelItem)}>
                      <input type="checkbox" /> Left Item {i}
                    </div>
                  )
                )}
              </div>
              <div className={cn(styles.panelRow, theme.panelRow)}>
                {sample.map((x, i) => (
                    <div key={i} className={cn(styles.panelItem, theme.panelItem)}>
                      <input type="checkbox" /> Right Item {i}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )
      }
    }
  )
}
