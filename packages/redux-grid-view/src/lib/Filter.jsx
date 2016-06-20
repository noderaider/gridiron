import React, { Component, PropTypes } from 'react'
import { getStyleProperties }  from './utils/StyleHelper'

class Filter extends Component {
  constructor(props, context) {
    super(props, context)
    this._handleChange = this._handleChange.bind(this)
  }

  shouldComponentUpdate(props) {
    return false
  }

  render() {
    const {style, className } = getStyleProperties(this.props, 'filter')

    return (
      <input
        type="text"
        name="filter"
        className={className}
        style={style}
        placeholder="filter"
        onChange={this._handleChange} />
    )
  }

  _handleChange = (e) => {
    //TODO: debounce this
    this.props.events.setFilter(e.target.value)
  }
}

Filter.propTypes = {
  setFilter: React.PropTypes.func
}

export default Filter
