import solvent from 'solvent'

export default function pager (deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  return class Pager extends Component {
  }
}
