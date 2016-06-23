const should = require('chai').should()

/**
 * PropTypes factory for <CoreGrid /> components.
 */
export const PropTypes = React => ( { mapCols: React.PropTypes.func.isRequired
                                    , mapRows: React.PropTypes.func.isRequired
                                    , styles: React.PropTypes.object.isRequired
                                    , theme: React.PropTypes.object.isRequired
                                    , gridStyle: React.PropTypes.object.isRequired
                                    , state: React.PropTypes.object.isRequired
                                    , maxHeight: React.PropTypes.number
                                    } )

/**
 * DefaultProps factory for <CoreGrid /> components.
 */
export const DefaultProps = React => ({ gridStyle: {}
                                      , mapIds: (state, index) => index
                                      })



/** Creates mapStateToProps for <CoreGrid /> component */
export const MapStateToProps = ({ getState } = {}) => state => ({ state: getState ? getState() : state })

/** Creates mapDispatchToProps for <CoreGrid /> component */
export const MapDispatchToProps = ({} = {}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailored for <CoreGrid />
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
