import React, { Component, PropTypes } from 'react'

class ColumnDefinition extends Component {
  render() {
    return null
  }
}

ColumnDefinition.PropTypes = {
  //this is the name of the column that this definition applies to.
  //This used to be known as columnName
  id: PropTypes.string.isRequired,
  //The order that this column appears in. If not specified will just use the order that they are defined
  order: PropTypes.number,
  //Determines whether or not the user can disable this column from the settings.
  locked: PropTypes.bool,
  //The css class name to apply to the header for the column
  headerCssClassName: PropTypes.string,
  //The css class name to apply to this column.
  cssClassName: PropTypes.string,
  //The display name for the column. This is used when the name in the column heading and settings should be different from the data passed in to the Griddle component.
  displayName: PropTypes.string,
  //The component that should be rendered instead of the standard column data. This component will still be rendered inside of a TD element.
  customComponent: PropTypes.object,
  //The component that should be used instead of the normal title
  customHeaderComponent: PropTypes.object,
  //Can this column be sorted
  sortable: PropTypes.bool,
  //What sort type this column uses - magic string :shame:
  sortType: PropTypes.string,
  //Any extra data that should be passed to each instance of this column
  extraData: PropTypes.object,
  //The width of this column -- this is string so things like % can be specified
  width: PropTypes.string
}

export default ColumnDefinition
