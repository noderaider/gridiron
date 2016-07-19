import solvent, { TYPES } from 'solvent'
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
                    const { styles } = this.props
                    return (
                      <span className={styles.logo}>
                        <span className={styles.text}>react-formula</span>
                        <span className={styles.bar}></span>
                      </span>
                    )
                  }
                }
  return compose(desc)
}
