import { Propagate as Core } from 'redux-grid-core'
const should = require('chai').should()

export default ({ React }) => {
  const { Component, PropTypes, cloneElement } = React

  class Propagate extends Component {
    constructor(props) {
      super(props)
    }
    componentDidUpdate() {



    }
    render() {
      const { children, ...rest } = this.props
      return cloneElement(children, rest)
    }

  }
  Propagate.propTypes = Core.PropTypes(React)
  Propagate.defaultProps = Core.DefaultProps(React)

  const propagation = (children, props = []) => {
    return (
      <Propagate>
        {children}
      </Propagate>
    )
  }

  return Propagate
}
