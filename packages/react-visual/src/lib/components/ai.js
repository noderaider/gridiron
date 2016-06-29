import solvent from 'solvent'

export default function ai (deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  return class AI extends Component {
  }
}
