import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { getStyleProperties } from './utils/StyleHelper'
export default class TableHeadingCell extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleClick = this._handleClick.bind(this)
    this._handleHover = this._handleHover.bind(this)
  }

  getSortIcon() {
    const { sorted, sortAscending, icons } = this.props
    if (sorted)
      return sortAscending ? icons.sortAscending : icons.sortDescending
  }

  isSortable() {
    const { column, renderProperties } = this.props
    const columnProperties = renderProperties.columnProperties[column]

    if(columnProperties && columnProperties.hasOwnProperty('sortable') && columnProperties.sortable === false)
      return false
    return true
  }


  render() {
    const style = this.props.styles.getStyle({
        styles: this.props.styles.inlineStyles,
        styleName: 'columnTitle',
        mergeStyles: {
          width: this.props.columnProperty.width,
          ...(this.props.alignment || this.props.headerAlignment ? {textAlign: this.props.headerAlignment || this.props.alignment} : {}),
          ...this.props.style
        }
      })

    const { className } = getStyleProperties(this.props, 'tableHeadingCell')
    const classNames = classnames(className, this.props.columnProperty ? this.props.columnProperty.headerCssClassName : null)
    const { sorted } = this.props
    const clickEvent = this.isSortable() ? this._handleClick : null

    return (
      <th
        key={this.props.column}
        style={style}
        onMouseOver={this._handleHover}
        onClick={clickEvent}
        className={classNames}
      >
        {this.props.customHeaderComponent ? <this.props.customHeaderComponent {...this.props} /> : this.props.title } { this.getSortIcon() }
      </th>)
  }

  _handleHover() {
    this.props.headingHover(this.props.column)
  }

  _handleClick() {
    this.props.headingClick(this.props.column)
  }
}

TableHeadingCell.propTypes = {
  headingHover: React.PropTypes.func,
  headingClick: React.PropTypes.func,
  column: React.PropTypes.string,
  headerAlignment: React.PropTypes.oneOf(['left', 'right', 'center']),
  alignment: React.PropTypes.oneOf(['left', 'right', 'center']),
  sortAscending: React.PropTypes.bool,
  sorted: React.PropTypes.bool
}
