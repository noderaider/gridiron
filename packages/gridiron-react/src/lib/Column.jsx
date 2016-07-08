import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { getStyleProperties } from './utils/StyleHelper'

class Column extends Component {
  shouldComponentUpdate(nextProps) {
    if(this.props.forceUpdate) { return true }
    if(this.props.value === nextProps.value) {
      return false
    }

    return true
  }

  render() {
    //TODO: this is temporary -- we'll need to merge styles or something
    //  why not use the getStyle from defaultStyles?
    const styles = this._getStyles()

    const { className } = getStyleProperties(this.props, 'column')
    const classNames = classnames(className, this.props.cssClassName)

    return (
      <td
        style={styles}
        key={this.props.dataKey}
        rowIndex={this.props.rowIndex}
        onClick={this._handleClick}
        onMouseOver={this._handleHover}
        className={classNames}>
          {this.props.hasOwnProperty('customComponent') ?
            <this.props.customComponent
              data={this.props.value}
              rowData={this.props.rowData}
              originalData={this.props.originalRowData}
              rowIndex={this.props.rowIndex}
              absoluteRowIndex={this.props.absoluteRowIndex}
              extraData={this.props.extraData} /> :
            this.props.value}
      </td>
    )
  }

  //TODO: Figure out a way to get this hooked up with the normal styles methods
  //maybe a merge styles property or something along those lines
  _getStyles = () => {
    const style = this.props.styles.getStyle({
      styles: this.props.styles.inlineStyles,
      styleName: 'column',
      //todo: make this nicer
      mergeStyles: {
          ...((this.props.width || this.props.alignment || this.props.styles) ?
            Object.assign({ width: this.props.width || null, textAlign: this.props.alignment }) : {}),
          ...this.props.style
      }
    })

    return style
  }

  _handleClick = (e) => {
    if (this.props.onClick) this.props.onClick(e)

    this.props.events.columnClick(this.props.dataKey, this.props.value, this.props.rowIndex, this.props.rowData)
  }

  _handleHover = (e) => {
    this.props.events.columnHover(this.props.dataKey, this.props.value, this.props.rowIndex, this.props.rowData)
  }
}

Column.defaultProps = {
  columnProperties: {
    cssClassName: ''
  }
}

Column.propTypes = {
  alignment: React.PropTypes.oneOf(['left', 'right', 'center']),
  columnHover: React.PropTypes.func,
  columnClick: React.PropTypes.func
}

export default Column
