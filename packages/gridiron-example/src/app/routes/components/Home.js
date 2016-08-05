import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron

export default pure (
  { displayName: 'Home'
  , render() {
      const { title, subtitle, username, organization, email, full, packageName, ...childProps } = this.props
      return (
        <div>
          <Accordion {...childProps} />
          <Cards {...childProps} />
          <Graph {...childProps} />
          <Grid {...childProps} />
        </div>
      )
    }
  }
)
