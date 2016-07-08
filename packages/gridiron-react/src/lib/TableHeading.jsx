import React, { Component, PropTypes } from 'react'
import ColumnHelper from './utils/ColumnHelper'
import { getStyleProperties } from './utils/StyleHelper'
import { arraysEqual } from './utils/arrayHelper'

export default class TableHeading extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    //TODO: Make this nicer - shouldn't be reminiscent of clojure level paran usage
    return (!arraysEqual(this.props.columns, nextProps.columns) ||
      ((this.props.pageProperties && nextProps.pageProperties) &&
        (!arraysEqual(this.props.pageProperties.sortColumns, nextProps.pageProperties.sortColumns) ||
        this.props.pageProperties.sortAscending !== nextProps.pageProperties.sortAscending)
      )
    )
  }

  getColumnTitle(column) {
    const initial = this.props.columnTitles[column]  ?
              this.props.columnTitles[column] :
              column

    return this.props.renderProperties.columnProperties[column] && this.props.renderProperties.columnProperties[column].hasOwnProperty('displayName') ?
        this.props.renderProperties.columnProperties[column].displayName :
        initial
  }

  render() {
    let { headingClick, headingHover } = this.props.events
    const { renderProperties } = this.props
    const { style, className } = getStyleProperties(this.props, 'tableHeading')

    const headings = this.props.columns.map(column =>{
      let columnProperty = ColumnHelper.getColumnPropertyObject(renderProperties.columnProperties, column)
      const showColumn = ColumnHelper.isColumnVisible(column, { columnProperties: renderProperties.columnProperties, ignoredColumns: renderProperties.ignoredColumns })
      const sortAscending = this.props.pageProperties && this.props.pageProperties.sortAscending
      const sorted = this.props.pageProperties && this.props.pageProperties.sortColumns.indexOf(column) > -1

      const title = this.getColumnTitle(column)
      let component = null
      if(showColumn) {
        component = (<this.props.components.TableHeadingCell
            key={column}
            column={column}
            sorted={sorted}
            sortAscending={sortAscending}
            settings={this.props.settings}
            styles={this.props.styles}
            headingClick={headingClick}
            headingHover={headingHover}
            icons={this.props.styles.icons}
            title={title}
            columnProperty={columnProperty}
            {...columnProperty}
            {...this.props}/>)
      }

      return component
    })

    return this.props.columns.length > 0 ? (
      <thead style={style} className={className}>
        <tr>
          {headings}
        </tr>
      </thead>
    ) : null
  }
}
