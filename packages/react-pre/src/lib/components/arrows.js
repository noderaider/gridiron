import solvent from 'solvent'

export default function arrows (deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  return class Arrows extends Component {
    shouldComponentUpdate() {
      return true
    }
    render() {
      const { children } = this.props
      return (
        <span>
          {Array.isArray(children) ? children.map((x, i) => {
            return (
              <span key={i}>
                {x} {i < children.length - 1 ? <i style={{ fontSize: '0.7em', color: 'rgba(50, 50, 50, 1)' }} className="fa fa-caret-right fa-xs" /> : null}{' '}
              </span>
            )
          }) : <span>Not an array => {children}</span>}
        </span>
      )
    }
  }
}
