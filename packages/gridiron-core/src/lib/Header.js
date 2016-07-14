


/** PropTypes factory for <Header /> components. */
export const PropTypes = React => {
  const Types = React.PropTypes

  const sortShape = { direction: Types.oneOf([ 'asc', 'desc' ])
                    }

  return ({ theme: Types.object.isRequired
          , styles: Types.object.isRequired
          , status: Types.object.isRequired
          , filter: Types.object
          , checkbox: Types.object
          , radio: Types.object
          })
}

/** DefaultProps factory for <Header/> components. */
export const DefaultProps = () => ( { theme: {}
                                    , styles: {}
                                    , status: {}
                                    } )
