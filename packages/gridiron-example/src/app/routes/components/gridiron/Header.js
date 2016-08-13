import pure from 'lib/modules/pure'
import styles from './styles.css'

const { React, PropTypes } = pure

export default pure (
  { displayName: 'Header'
  , propTypes:  { title: PropTypes.string.isRequired
                , subtitle: PropTypes.string
                , description: PropTypes.string
                }
  , render() {
      const { title, subtitle, description } = this.props
      return (
        <span className={styles.header}>
          <span className={styles.title}>{title}</span>
          {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      )
    }
  }
)
