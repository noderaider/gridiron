const should = require('chai').should()

/**
 * PropTypes factory for <CoreGrid /> components.
 */
export const PropTypes = React => ( { mapCols: React.PropTypes.func.isRequired
                                    , mapRows: React.PropTypes.func.isRequired
                                    , cols: React.PropTypes.array.isRequired
                                    , rows: React.PropTypes.array.isRequired
                                    , styles: React.PropTypes.object.isRequired
                                    , theme: React.PropTypes.object.isRequired
                                    , gridStyle: React.PropTypes.object.isRequired
                                    //, state: React.PropTypes.object.isRequired
                                    , maxHeight: React.PropTypes.number
                                    , header: React.PropTypes.any
                                    , footer: React.PropTypes.any
                                    , isMaximized: React.PropTypes.bool.isRequired
                                    } )

/**
 * DefaultProps factory for <CoreGrid /> components.
 */
export const DefaultProps = React => ({ gridStyle: {}
                                      , mapIds: (state, index) => index
                                      , isMaximized: false
                                      })



/** Creates mapStateToProps for <CoreGrid /> component */
export const MapStateToProps = (deps, { getState } = {}) => (state, ownProps) => {
  const resolvedState = getState ? getState() : state
  return  { cols: ownProps.mapCols(resolvedState)
          , rows: ownProps.mapRows(resolvedState)
          }
}

/** Creates mapDispatchToProps for <CoreGrid /> component */
export const MapDispatchToProps = (deps, { getState } = {}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailored for <CoreGrid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const Connect = ({ connect, ...rest } = {}, { getState } = {}) => {
  should.exist(connect, 'redux connect is required for <Grid /> connect')
  connect.should.be.a('function')
  const mapStateToProps = MapStateToProps(rest, { getState })
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect')
  mapStateToProps.should.be.a('function')
  const mapDispatchToProps = MapDispatchToProps(rest, { getState })
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect')
  mapDispatchToProps.should.be.a('function')
  return Component => connect(mapStateToProps, mapDispatchToProps)(Component)
}
