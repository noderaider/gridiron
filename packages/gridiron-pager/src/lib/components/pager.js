import solvent from 'solvent'
import reactStamp from 'react-stamp'

export default function pager (deps, defaults) {
  const { React
        , shallowCompare
        } = solvent({ React: 'object'
                    , shallowCompare: 'function'
                    })(deps)
  const { Component, PropTypes } = React
  const { compose } = reactStamp(React)

  return class Pager extends Component {
    render() {
      return <div>reduxPager</div>
    }
  }

}
