import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'
import Layout from './Layout'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron

const component = (Component, meta = {}) => ({ Component, ...meta })
const componentLayout = (Components, childProps) => Components.map((({ Component, ...meta }, i) => ({ key: i, component: <Component {...childProps} />, ...meta })))

export default pure (
  { displayName: 'Home'
  , defaultProps: {
                  }
  , init() {
      const { container } = this.props
      this.components = componentLayout([ component(Accordion)
                                        , component(Graph)
                                        , component(Cards, { h: { xl: 21, lg: 10,  md: 8 } })
                                        , component(Grid, { w: { xl: 2, lg: 2,  md: 1 }, h: 15 })
                                        ], { container })
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
