import * as create from './components/create'

/**
 * redux-grid
 * Requires dependencies { React, FixedDataTable, connect } and exports a higher order component and controls that can select from redux state.
 * @param  {[type]} dependencies [description]
 * @return {[type]}              [description]
 */
export default dependencies => Object.keys(create).reduce((reduxGrid, x) => ({ ...reduxGrid, [x]: create[x](dependencies) }), {})
