import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import contextTypes from 'lib/context'
import { Gridiron } from 'lib/components/modules/gridiron-react'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName, container } = this.props
    const { style } = this.context.theme
    return <Gridiron container={container} />
  }
}

function mapStateToProps(state) {
  const { visual } = state
  return  {}
}

export default connect(mapStateToProps)(Home)
