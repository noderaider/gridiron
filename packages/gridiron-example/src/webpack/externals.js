import { dependencyNames } from '../config'

export default name => {
  switch(name) {
    case 'server':
      return dependencyNames.reduce((externals, name) => ({ ...externals, [name]: true }), {})
    case 'vendor':
      return  { 'react-addons-css-transition-group': 'ReactCSSTransitionGroup'
              , 'react-addons-shallow-compare': 'shallowCompare'
              , 'react': 'React'
              , 'react-dom': 'ReactDOM'
              }
  }
}
