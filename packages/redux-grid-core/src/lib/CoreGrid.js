const should = require('chai').should()

/**
 * Interface factory for <Grid /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const PropTypes = React => ( { mapCols: React.PropTypes.func.isRequired
                                    , mapRows: React.PropTypes.func.isRequired
                                    , styles: React.PropTypes.object.isRequired
                                    , state: React.PropTypes.object.isRequired
                                    , maxHeight: React.PropTypes.number
                                    } )




/** Creates mapStateToProps for <Grid /> component */
export const MapStateToProps = ({ getState } = {}) => state => ({ state: getState ? getState() : state })

/** Creates mapDispatchToProps for <Grid /> component */
export const MapDispatchToProps = ({} = {}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailed for <Grid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const Connect = ({ connect, getState, ...rest } = {}) => {
  should.exist(connect, 'redux connect is required for <Grid /> connect')
  connect.should.be.a('function')
  const mapStateToProps = MapStateToProps({ getState, ...rest })
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect')
  mapStateToProps.should.be.a('function')
  const mapDispatchToProps = MapDispatchToProps({ ...rest })
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect')
  mapDispatchToProps.should.be.a('function')
  return Component => connect(mapStateToProps, mapDispatchToProps)(Component)
}
