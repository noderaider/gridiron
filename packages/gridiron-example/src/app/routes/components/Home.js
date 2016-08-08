import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'
import Layout from './Layout'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron

export default pure (
  { displayName: 'Home'
  , defaultProps: {
                  }
  , init() {
      const { container } = this.props
      const childProps = { container }
      this.components = [ Accordion
                        , Cards
                        , Graph
                        , Grid
                        ].map((Component, i) => <Component key={i} {...childProps} />)
    }
  , render() {
      return (
        <Layout>
          {this.components}
        </Layout>
      )
    }
  }
)
