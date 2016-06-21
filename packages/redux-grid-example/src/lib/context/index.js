import { PropTypes } from 'react'

export const gridPropsShape = PropTypes.shape({ xs: PropTypes.number
                                              , sm: PropTypes.number
                                              , md: PropTypes.number
                                              , lg: PropTypes.number
                                              , xsOffset: PropTypes.number
                                              , smOffset: PropTypes.number
                                              , mdOffset: PropTypes.number
                                              , lgOffset: PropTypes.number
                                              })

const paletteShape = PropTypes.shape( { scheme: PropTypes.string
                                      , base03: PropTypes.string
                                      , base02: PropTypes.string
                                      , base01: PropTypes.string
                                      , base00: PropTypes.string
                                      , base0:  PropTypes.string
                                      , base1:  PropTypes.string
                                      , base2:  PropTypes.string
                                      , base3:  PropTypes.string
                                      , yellow: PropTypes.string
                                      , orange: PropTypes.string
                                      , red:    PropTypes.string
                                      , magenta:PropTypes.string
                                      , violet: PropTypes.string
                                      , blue:   PropTypes.string
                                      , cyan:   PropTypes.string
                                      , green:  PropTypes.string
                                      } )

const colorShape = PropTypes.shape( { primary: PropTypes.string.isRequired
                                    , secondary: PropTypes.string.isRequired
                                    , accent: PropTypes.string.isRequired
                                    } )

const brandShape = PropTypes.shape( { default: PropTypes.string.isRequired
                                    , primary: PropTypes.string.isRequired
                                    , info: PropTypes.string.isRequired
                                    , success: PropTypes.string.isRequired
                                    , warning: PropTypes.string.isRequired
                                    , danger: PropTypes.string.isRequired
                                    } )

const panelStyleShape = PropTypes.shape({ backgroundColor: PropTypes.string.isRequired
                                        , borderColor: PropTypes.string.isRequired
                                        , borderStyle: PropTypes.string.isRequired
                                        , borderWidth: PropTypes.number.isRequired
                                        , margin: PropTypes.number.isRequired
                                        , borderRadius: PropTypes.number.isRequired
                                        , fontFamily: PropTypes.string.isRequired
                                        , fontWeight: PropTypes.number.isRequired
                                        })

const boldShape = PropTypes.shape({ fontWeight: PropTypes.number.isRequired })

const inputShape = PropTypes.shape( { color: PropTypes.string.isRequired
                                    , backgroundColor: PropTypes.string.isRequired
                                    , borderColor: PropTypes.string.isRequired
                                    , borderWidth: PropTypes.number.isRequired
                                    , borderStyle: PropTypes.string.isRequired
                                    } )

const styleShape = PropTypes.shape( { app: PropTypes.object.isRequired
                                    , panel: panelStyleShape
                                    , bold: boldShape
                                    , input: inputShape
                                    } )

const themeShape = PropTypes.shape( { palette: paletteShape
                                    , color: colorShape
                                    , brand: brandShape
                                    , style: styleShape
                                    })

const contextTypes =  { gridProps: gridPropsShape
                      , theme: themeShape
                      }

export default contextTypes
