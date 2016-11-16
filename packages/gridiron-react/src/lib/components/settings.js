import { Settings as Core } from 'gridiron-core'

export default function settings (pure) {
  const { React, defaults } = pure

  return pure (
    { displayName: 'Settings'
    , propTypes: Core.PropTypes(React)
    , defaultProps: Core.DefaultProps(React)
    , render() {
        return (
          <div>
          </div>
        )
      }
    }
  )
}
