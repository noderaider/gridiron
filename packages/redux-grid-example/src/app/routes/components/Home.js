import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { contextTypes } from 'lib/context'
import PrimaryGrid from 'app/elements/grids/PrimaryGrid'
import PageForm from 'app/elements/forms/PageForm'
import { Grid } from 'lib/redux/modules/redux-grid'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName } = this.props
    const { style } = this.context.theme
    const pageFormInit =  { title
                          , subtitle
                          , username
                          , organization
                          , email
                          , full
                          , packageName
                          }
    return (
      <div>
        <Grid title="redux-grid-example" />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { visual } = state
  return  {}
}

export default connect(mapStateToProps)(Home)
