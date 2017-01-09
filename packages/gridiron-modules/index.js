function gridironModules () {
  const React = require('react')
  //const Pre = props => <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(props, null, 2) }} />
  return (
    { React
    , ReactDOM: require('react-dom')
    , shallowCompare: require('react-addons-shallow-compare')
    , createFragment: require('react-addons-create-fragment')
    , connect: require('react-redux').connect
    , push: require('react-router-redux').push
    , Immutable: require('immutable')
    }
  )
}

module.exports = gridironModules
