module.exports = function gridironModules () {
  const React = require('react')
  return (
    { React
    , ReactDOM: require('react-dom')
    , shallowCompare: require('react-addons-shallow-compare')
    , createFragment: require('react-addons-create-fragment')
    , connect: require('react-redux').connect
    , push: require('react-router-redux').push
    , Immutable: require('immutable')
    , Pre: props => <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(props, null, 2) }} />
    }
  )
}
