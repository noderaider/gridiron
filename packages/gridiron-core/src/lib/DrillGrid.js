import * as CoreGrid from './CoreGrid'

/**
 * Interface factory for <DrillGrid /> components.
 */
export const PropTypes = React => ( { cols: React.PropTypes.array.isRequired
                                    //, rows: React.PropTypes.array.isRequired
                                    , data: React.PropTypes.object.isRequired
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
