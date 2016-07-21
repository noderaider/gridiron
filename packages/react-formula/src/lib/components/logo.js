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
                , propTypes: { styles: PropTypes.shape({ logo: PropTypes.string.isRequired }).isRequired }
                , defaultProps: defaults
                , render() {
                    const { styles, theme } = this.props
                    return (
                      <span className={cn(styles.logo, theme.logo)}>
                        react-formula
                      </span>
                    )
                  }
                }
  return compose(desc)
}
