import React, { Component, PropTypes } from 'react'
import {getStyleProperties}  from './utils/StyleHelper'

export default class NoResults extends Component {
  render() {
    const { style, className } = getStyleProperties(this.props, 'noResults')

    return (
      <div style={style} className={className}>
        <h4>No results found.</h4>
      </div>
    )
  }
}
