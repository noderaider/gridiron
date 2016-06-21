import * as CoreGrid from './CoreGrid'

/**
 * Interface factory for <DrillGrid /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const PropTypes = React => ( { ...CoreGrid.PropTypes(React)
                                    , mapDrill: React.PropTypes.func.isRequired
                                    } )



/**
 * Creates a react-redux style connect function tailed for <DrillGrid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const Connect = CoreGrid.Connect
