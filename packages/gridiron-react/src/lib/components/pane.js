import cn from 'classnames'
import reactStamp from 'react-stamp'
const should = require('chai').should()


export default function pane ({ React }, defaults = {}) {
  const { PropTypes } = React
  const { compose } = reactStamp(React)


  return compose(
    { displayName: 'pane'
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
            {/*sample.map((x, i) => (
                <div key={i} className={cn(styles.paneItem, theme.paneItem)}>
                  <input type="checkbox" className={cn(styles.checkbox, theme.checkbox)} /> Left Item {i}
                </div>
              )
            )*/}
          </div>
        )

        return (
          <div className={className}>
            <div className={cn(styles.paneContent, theme.paneContent)}>
              <PaneColumn>{children}</PaneColumn>
              {/*Array.isArray(children)
                ? children.map((x, key) => <PaneColumn>{cloneElement(x, { key })}</PaneColumn>)
                : <PaneColumn>{children}</PaneColumn>*/}
              {/*
              <div className={cn(styles.paneColumn, theme.paneColumn)}>
                {sample.map((x, i) => (
                    <div key={i} className={cn(styles.paneItem, theme.paneItem)}>
                      <input type="checkbox" className={cn(styles.checkbox, theme.checkbox)} /> Left Item {i}
                    </div>
                  )
                )}
              </div>
              <div className={cn(styles.paneColumn, theme.paneColumn)}>
                {sample.map((x, i) => (
                    <div key={i} className={cn(styles.paneItem, theme.paneItem)}>
                      <input type="checkbox" className={cn(styles.checkbox, theme.checkbox)} /> Right Item {i}
                    </div>
                  )
                )}
              </div>
            */}
            </div>
          </div>
        )
      }
    }
  )
}
