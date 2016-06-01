const should = require('chai').should()

/**
 * <Grid /> factory
 * @param  {Object}    options.ReactVirtualized react-virtualized dependency for a higher order react-virtualized <Grid />.
 * @param  {Object}    options.FixedDataTable   fixed-data-table dependency for a higher order fixed-data-table <Grid />.
 * @param  {...Object} options.rest             The rest of the <Grid /> dependencies.
 * @return {Grid}                               A higher order <Grid /> component.
 */
export default function createGrid({ ReactVirtualized, FixedDataTable, ...rest }) {
  should.exist(ReactVirtualized || FixedDataTable, 'react-virtualized or fixed-data-table are required for <Grid />')
  return ReactVirtualized ? require('./react-virtualized/createGrid').default({ ReactVirtualized, ...rest })
                          : require('./fixed-data-table/createGrid').default({ FixedDataTable, ...rest })
}

/**
 * Interface factory for <Grid /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const createPropTypes = ({ PropTypes }) => ( { selectColumns: PropTypes.func.isRequired
                                                    , selectRows: PropTypes.func.isRequired
                                                    , maxHeight: PropTypes.number.isRequired
                                                    } )

/** Creates mapStateToProps for <Grid /> component */
export const createMapStateToProps = ({}) => state => state

/** Creates mapDispatchToProps for <Grid /> component */
export const createMapDispatchToProps = ({}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailed for <Grid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const createConnect = ({ connect, ...rest }) => {
  should.exist(connect, 'redux connect is required for <Grid /> connect')
  connect.should.be.a('function')
  const mapStateToProps = createMapStateToProps({ ...rest })
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect')
  mapStateToProps.should.be.a('function')
  const mapDispatchToProps = createMapDispatchToProps({ ...rest })
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect')
  mapDispatchToProps.should.be.a('function')
  return Component => connect(mapStateToProps, mapDispatchToProps)(Component)
}
