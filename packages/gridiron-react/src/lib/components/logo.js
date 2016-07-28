export default function logo (pure) {
  const { React, PropTypes, defaults } = pure

  return pure (
    { displayName: 'Logo'
    , propTypes: { styles: PropTypes.shape({ logo: PropTypes.string.isRequired }).isRequired }
    , defaultProps: defaults
    , render() {
        const { styles } = this.props
        return (
          <span className={styles.logo}>
            <span className={styles.text}>gridiron</span>
          </span>
        )
      }
    }
  )
}
