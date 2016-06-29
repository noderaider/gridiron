
/**
 * PropTypes factory for <Pager /> components.
 */
export const PropTypes = React => ( { maxRecords: React.PropTypes.number.isRequired
                                    , mapRows: React.PropTypes.func.isRequired
                                    } )

/**
 * DefaultProps factory for <Pager /> components.
 */
export const DefaultProps = React => ({ maxRecords: 5 })
