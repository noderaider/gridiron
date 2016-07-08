/**
 * PropTypes factory for <Header /> components.
 */
export const PropTypes = React => ( { theme: React.PropTypes.object.isRequired
                                    , styles: React.PropTypes.object.isRequired
                                    , sort: React.PropTypes.object
                                    , filter: React.PropTypes.object
                                    , checkbox: React.PropTypes.object
                                    , radio: React.PropTypes.object
                                    } )

/**
 * DefaultProps factory for <Header/> components.
 */
export const DefaultProps = React => ({ theme: {}
                                      , styles: {}
                                      })
