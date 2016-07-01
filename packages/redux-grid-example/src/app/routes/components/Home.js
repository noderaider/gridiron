import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { contextTypes } from 'lib/context'
import ReduxGrid from './grid/ReduxGrid'
import PrimaryGrid from 'app/elements/grids/PrimaryGrid'
import PageForm from 'app/elements/forms/PageForm'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName, maximize } = this.props
    const { style } = this.context.theme
    return <ReduxGrid maximize={maximize} />
    //return maximize.container(x => <ReduxGrid maximize={maximize}  />)
  }
}

function mapStateToProps(state) {
  const { visual } = state
  return  {}
}

export default connect(mapStateToProps)(Home)
