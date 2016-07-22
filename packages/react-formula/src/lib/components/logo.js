import solvent, { TYPES } from 'solvent'
import cn from 'classnames'
import reactStamp from 'react-stamp'

export default function logo (deps, defaults = { styles: { logo: 'logo' } }) {
  const { React
        } = solvent({ ...TYPES.React
                    })(deps)

  const { PropTypes } = React
  const { compose } = reactStamp(React)

  const desc =  { displayName: 'logo'
                , propTypes:  { styles: PropTypes.object.isRequired
                              , theme: PropTypes.object.isRequired
                              }
                , defaultProps: defaults
                , render() {
                    const { styles, theme } = this.props
                    const logoClass = cn( styles.logo
                                        , theme.logo
                                        )
                    const iconClass = cn( styles.logoIcon
                                        , theme.logoIcon
                                        , 'fa'
                                        , 'fa-circle-o-notch'
                                        )
                    const textClass = cn( styles.logoText
                                        , theme.logoText
                                        )
                    return (
                      <span className={logoClass}>
                        <i className={iconClass} />
                        <span className={textClass}>∳</span>
                      </span>
                    )
                  }
                }
  return compose(desc)
}
