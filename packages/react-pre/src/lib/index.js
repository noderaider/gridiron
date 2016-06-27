import * as components from './components'

const capitalizeFirst = str => `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * react-pre
 * Requires dependencies { React, FixedDataTable, connect } and exports a higher order component and controls that can select from redux state.
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */
export default deps => Object.keys(components).reduce((reactPre, x) => ({ ...reactPre, [capitalizeFirst(x)]: components[x](deps) }), {})
