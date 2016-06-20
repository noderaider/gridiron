import React, { Component, PropTypes } from 'react'
import RowDefinition from './RowDefinition'
import { getStyleProperties } from './utils/StyleHelper'

export default class Table extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  getTableBodySection() {
    if(this.props.data.length < 1) {
      return (
        <tbody>
          <tr>
            <td>
              <this.props.components.NoResults
                components={this.props.components}
                styles={this.props.styles}
                settings={this.props.settings}
                events={this.props.events} />
            </td>
          </tr>
        </tbody>
      )
    }

    return <this.props.components.TableBody {...this.props} />
  }

  getColumns() {
    const columnProperties = this.props.renderProperties.columnProperties

    if(this.props.data.length > 0)
      return Object.keys(this.props.data[0])

    if(columnProperties) {
      return Object.keys(this.props.renderProperties.columnProperties).sort((first, second) => {
        const firstColumn = columnProperties[first]
        const secondColumn = columnProperties[second]

        //deal with columns without order properties
        if(!firstColumn['order'] && !secondColumn['order']) { return 0 }
        if(firstColumn['order'] && !secondColumn['order']) { return -1 }
        if(!firstColumn['order'] && secondColumn['order']) { return 1 }

        //order the columns if they both have an order property
        return (firstColumn['order']) - (secondColumn['order'])
      })
    }
    return []
  }

  getTableHeaderSection() {
    const columns = this.getColumns()
    if(columns.length > 0)
      return <this.props.components.TableHeading columns={columns} {...this.props} />
    return null
  }

  render() {
    const { settings, styles } = this.props
    const style = styles.getStyle({
      styles: styles.inlineStyles,
      styleName: 'table',
      mergeStyles: settings.useFixedTable && styles.getStyle({
        styles: styles.inlineStyles,
        styleName: 'fixedTable'
      })
    })

    const { className } = getStyleProperties(this.props, 'table')
    //translate the definition object to props for Heading / Body
    return (
      <table
        className={className}
        style={style}
      >
        { this.getTableHeaderSection() }
        { this.getTableBodySection() }
      </table>
    )
  }
}

//TODO: enabled the propTypes again
/*
Table.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.instanceOf(RowDefinition)
    // React.PropTypes.arrayOf(React.PropTypes.instanceOf(ColumnDefinition))
  ])
}; */
