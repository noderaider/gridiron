import * as components from './components'

const applyCapitalization = str => str.length <= 2 ? {str.toUpperCase()} : `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * react-ai
 * Requires dependencies { React, FixedDataTable, connect } and exports a higher order component and controls that can select from redux state.
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */
export default deps => Object.keys(components).reduce((reactAI, x) => ({ ...reactAI, [applyCapitalization(x)]: components[x](deps) }), {})
