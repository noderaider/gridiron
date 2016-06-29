import React, { Component, PropTypes } from 'react'
import { getStyleProperties }  from './utils/StyleHelper'

export default class Loading extends Component {
  render() {
    const { style, className } = getStyleProperties(this.props, 'loading')

    return (
      <tr>
        <td>
          <div style={style} className={className}>
            <h4>Loading...</h4>
          </div>
        </td>
      </tr>
    )
  }
}
