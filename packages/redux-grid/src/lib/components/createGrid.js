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
export const createPropTypes = ({ PropTypes }) => ( { mapCols: PropTypes.func.isRequired
                                                    , mapRows: PropTypes.func.isRequired
                                                    , styles: PropTypes.object.isRequired
                                                    , state: PropTypes.object.isRequired
                                                    , maxHeight: PropTypes.number
                                                    } )

/** Creates mapStateToProps for <Grid /> component */
export const createMapStateToProps = ({ getState } = {}) => state => ({ state: getState ? getState() : state })

/** Creates mapDispatchToProps for <Grid /> component */
export const createMapDispatchToProps = ({} = {}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailed for <Grid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const createConnect = ({ connect, getState, ...rest } = {}) => {
  should.exist(connect, 'redux connect is required for <Grid /> connect')
  connect.should.be.a('function')
  const mapStateToProps = createMapStateToProps({ getState, ...rest })
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect')
  mapStateToProps.should.be.a('function')
  const mapDispatchToProps = createMapDispatchToProps({ ...rest })
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect')
  mapDispatchToProps.should.be.a('function')
  return Component => connect(mapStateToProps, mapDispatchToProps)(Component)
}
