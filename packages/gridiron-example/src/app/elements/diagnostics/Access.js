import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { logAccess } from 'lib/redux/actions/api'
import { path, query, title } from 'lib/services/location'

class Access extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(logAccess(path, query, title))
  }
  render() {
    return (
      <div id="access">
        {__DEV__ ? (
          <ul>
            <li>Path: {path}</li>
            <li>Query: {query}</li>
            <li>Title: {title}</li>
          </ul>
        ) : null}
      </div>
    )
  }
}

export default connect()(Access)
