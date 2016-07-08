import * as CoreGrid from './CoreGrid'

/**
 * Interface factory for <DrillGrid /> components.
 */
export const PropTypes = React => ( { mapCols: React.PropTypes.func.isRequired
                                    , mapRows: React.PropTypes.func.isRequired
                                    , mapDrill: React.PropTypes.func.isRequired
                                    , styles: React.PropTypes.object.isRequired
                                    , maxHeight: React.PropTypes.number
                                    } )

/**
 * DefaultProps factory for <CoreGrid /> components.
 */
export const DefaultProps = React => ({
                                      })



/**
 * Creates a react-redux style connect function tailed for <DrillGrid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
export const Connect = CoreGrid.Connect
