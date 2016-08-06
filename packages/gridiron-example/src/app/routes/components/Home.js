import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron

export default pure (
  { displayName: 'Home'
  , render() {
      const { title, subtitle, username, organization, email, full, packageName, container } = this.props
      return (
        <div>
          <Accordion container={container} />
          <Cards container={container} />
          <Graph container={container} />
          <Grid container={container} />
        </div>
      )
    }
  }
)
