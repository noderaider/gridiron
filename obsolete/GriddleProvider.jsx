import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Griddle, DefaultModules } from 'griddle-overhaul-react'
import configureGriddleComponent from './configureGriddleComponent'

const GriddleProvider = props => {
  const { store, components, plugins } = props
  const configured = processPlugins(plugins, Object.assign({}, DefaultModules, components))
  const GriddleComponent = configureGriddleComponent(configured.actions)(Griddle)

  return (
      <Provider store={store}>
        <GriddleComponent {...props} components={configured.components} />
      </Provider>
  )
}
GriddleRedux.propTypes =  { store: PropTypes.object.isRequired
                          , data: PropTypes.array.isRequired
                          , components: PropTypes.array.isRequired
                          , plugins: PropTypes.array.isRequired
                          }

export default GriddleProvider
