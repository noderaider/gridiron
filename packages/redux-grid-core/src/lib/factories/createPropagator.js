import EventEmitter from 'eventemitter3'
import solvent from 'solvent'
const should = require('chai').should()

export default function createPropagator(deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, cloneElement } = React



  return function propagator (component, { propNames = [], stateNames = [] } = {}) {
    should.exist(component, 'should provide a component to subscribe to as first argument')
    let EE = new EventEmitter()

    const handleUpdate = ({ props = {}, state = {} }, nextProps = {}, nextState = {}) => {
      const updated = { propNames: propNames.filter(x => nextProps[x] !== props[x])
                      , stateNames: stateNames.filter(x => nextState[x] !== state[x])
                      }
      if(updated.propNames.length > 0 || updated.stateNames.length > 0) {
        const propagate = { props: updated.propNames.reduce((updatedProps, x) => ({ ...updatedProps, [x]: nextProps[x] }), {})
                          , state: updated.stateNames.reduce((updatedState, x) => ({ ...updatedState, [x]: nextState[x] }), {})
                          }
        EE.emit('propagate', propagate)
      }
    }

    class Propagatee extends Component {
      constructor(props) {
        super(props)
        this.state = {}
      }
      handlePropagate = propagated => {
        this.setState({ propagated })
      }
      componentWillMount() {
        EE.on('propagate', this.handlePropagate)
      }
      componentWillUnmount() {
        EE.removeListener('propagate', this.handlePropagate)
      }
      render() {
        const { children } = this.props
        const { propagated } = this.state
        return cloneElement(children, { propagated })
      }
    }

    return  { Component: props => cloneElement(component, { ...props, handleUpdate })
            , subscribe: listener => EE.on('propagate', listener)
            , apply: x => <Propagatee>{x}</Propagatee>
            }
  }
}
