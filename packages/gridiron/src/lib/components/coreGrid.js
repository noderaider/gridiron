const should = require('chai').should()

/**
 * <Grid /> factory
 * @param  {Object}    options.ReactVirtualized react-virtualized dependency for a higher order react-virtualized <Grid />.
 * @param  {Object}    options.FixedDataTable   fixed-data-table dependency for a higher order fixed-data-table <Grid />.
 * @param  {...Object} options.rest             The rest of the <Grid /> dependencies.
 * @return {Grid}                               A higher order <Grid /> component.
 */
export default function coreGrid({ ReactVirtualized, FixedDataTable, ...rest }) {
  should.exist(ReactVirtualized || FixedDataTable, 'react-virtualized or fixed-data-table are required for <Grid />')
  return ReactVirtualized ? require('./react-virtualized/coreGrid').default({ ReactVirtualized, ...rest })
                          : require('./fixed-data-table/coreGrid').default({ FixedDataTable, ...rest })
}
