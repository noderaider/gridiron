import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import contextTypes from 'lib/context'
import { Accordion, Cards, Graph, Grid } from './gridiron'

class Home extends Component {
  static contextTypes = contextTypes;
  render() {
    const { title, subtitle, username, organization, email, full, packageName, container } = this.props
    const { style } = this.context.theme
    return (
      <div>
        <Accordion />
        <Cards />
        <Graph />
        <Grid />
      </div>
    )
  }
}
