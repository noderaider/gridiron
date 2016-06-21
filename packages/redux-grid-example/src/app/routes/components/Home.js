import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { contextTypes } from 'lib/context'
import ApiGrid from 'lib/components/grid/ApiGrid'
import PrimaryGrid from 'app/elements/grids/PrimaryGrid'
import PageForm from 'app/elements/forms/PageForm'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName } = this.props
    const { style } = this.context.theme
    return (
      <ApiGrid />
    )
  }
}

function mapStateToProps(state) {
  const { visual } = state
  return  {}
}

export default connect(mapStateToProps)(Home)
