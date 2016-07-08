import { Settings as Core } from 'gridiron-core'
import classNames from 'classnames'
const should = require('chai').should()


export default ({ React, Select }) => {
  const { Component } = React

  return class Settings extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);
    render() {
      return (
        <div>
        </div>
      )
    }
  }
}
