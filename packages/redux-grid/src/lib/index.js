import * as components from './components'

const capitalizeFirst = str => `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * redux-grid
 * Requires dependencies { React, FixedDataTable, connect } and exports a higher order component and controls that can select from redux state.
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */
export default dependencies => Object.keys(components).reduce((reduxGrid, x) => ({ ...reduxGrid, [capitalizeFirst(x)]: components[x](dependencies) }), {})
