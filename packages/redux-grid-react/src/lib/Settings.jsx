import React, { Component, PropTypes } from 'react'
import { getStyleProperties } from './utils/StyleHelper'

class CheckItem extends Component {
  static propTypes =  { toggleColumn: PropTypes.func.isRequired
                      , name: PropTypes.string.isRequired
                      , checked: PropTypes.bool
                      , value: PropTypes.oneOfType( [ PropTypes.string
                                                    , PropTypes.Number
                                                    ])
                      , text: PropTypes.string
                      };
  render() {
    return (
      <label onClick={this._handleClick}>
        <input type="checkbox" checked={this.props.checked} name={this.props.name} />
        {this.props.text}
      </label>)
  }
  _handleClick = () => this.props.toggleColumn(this.props.name);
}



class PageSize extends Component {
  static defaultProps = { sizes: [5, 10, 20, 30, 50, 100]
                        };
  render() {
    return (
      <select name="pageSize" onChange={this._handleChange}>
        {this.props.sizes.map(size => <option value={size}>{size}</option>)}
      </select>
    )
  }
  _handleChange = e => this.props.setPageSize(parseInt(e.target.value));
}

export default class Settings extends Component {
  static propTypes =  { allColumns: PropTypes.arrayOf(PropTypes.string)
                      , visibleColumns: PropTypes.arrayOf(PropTypes.node)
                      };
  render() {
    const keys = Object.keys(this.props.renderProperties.columnProperties)
    const { style, className } = getStyleProperties(this.props, 'settings')

    var columns = this.props.allColumns.map(column =>
      <CheckItem
        toggleColumn={this.props.events.toggleColumn}
        name={column}
        text={this._getDisplayName(column)}
        checked={keys.indexOf(column) > -1} />)
    return (
      <div style={style} className={className}>
        {columns}
        <PageSize setPageSize={this.props.events.setPageSize}/>
      </div>
    )
  }

  _getDisplayName = (column) => {
    const { renderProperties } = this.props
    if(renderProperties.columnProperties.hasOwnProperty(column)) {
      return renderProperties.columnProperties[column].hasOwnProperty('displayName') ?
        renderProperties.columnProperties[column].displayName :
        column
    } else if (renderProperties.hiddenColumnProperties.hasOwnProperty(column)) {
    return renderProperties.hiddenColumnProperties[column].hasOwnProperty('displayName') ?
        renderProperties.hiddenColumnProperties[column].displayName :
        column
    }
    return column
  }
}

