import { Settings as Core } from 'gridiron-core'
import classNames from 'classnames'
import reactStamp from 'react-stamp'
const should = require('chai').should()

export default ({ React }) => {
  const { compose } = reactStamp(React)

  return compose(
    { displayName: 'settings'
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
