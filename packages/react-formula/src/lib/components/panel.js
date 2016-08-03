import cn from 'classnames'
const should = require('chai').should()

export default function panel (pure) {
  const { React, PropTypes, defaults } = pure

  return pure (
    { displayName: 'Panel'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  }
    , defaultProps: { ...defaults
                    }
    , render() {
        const { styles, theme, children } = this.props

        return (
          <div style={{ width: '100%' }} className={styles.panel}>
            <div style={containerStyle}>
              <div style={headerStyle}>
                <h2 className="pull-left" style={titleStyle}>{title}</h2>
                <div className="pull-right" style={iconStyle}>
                  <FA name={iconName} loadingName={iconLoadingName} size={iconSize} color={accentColor} isLoading={isLoading} />
                </div>
              </div>
              {message ? <div style={{ clear: 'both', margin: 10, fontSize: '1.2em' }}>{message}</div> : null}
              <div style={contentStyle}>
                {children}
              </div>
             {errors && errors.size > 0 ? (
                <div style={errorContainerStyle}>
                  {errors.takeLast(maxErrors).map((error, i) => <div key={i} style={errorStyle}>{error.message}</div>)}
                </div>
              ) : null}
            </div>
          </div>
        )
      }
    }
  )
}
