
/**
 * PropTypes factory for <Pager /> components.
 */
export const PropTypes = React => ( { isMaximized: React.PropTypes.bool.isRequired
                                    , onMaximize: React.PropTypes.func.isRequired
                                    , onCompress: React.PropTypes.func.isRequired
                                    } )

/**
 * DefaultProps factory for <Pager /> components.
 */
export const DefaultProps = React => ({ })
