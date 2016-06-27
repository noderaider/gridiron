import solvent from 'solvent'

export default function samp (deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  return class Samp extends Component {
    shouldComponentUpdate() {
      return true
    }
    render() {
      let parsed = this.parseJSON() || this.parseJS()
      return (
        <samp>
          {parsed}
        </samp>
      )
    }
    parseJSON = () => {
      const { children } = this.props
      try {
        let json = JSON.stringify(children, null, 2)
      } catch(err) {
      }
    };
    parseJS = () => {
      const { children } = this.props
      let js = () => eval(children)
      return js.toString()
    };
  }
}
