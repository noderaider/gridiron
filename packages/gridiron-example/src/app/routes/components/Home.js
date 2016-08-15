import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'
import Layout from './Layout'

const { React, PropTypes, cloneElement } = pure
const { Accordion, Cards, Graph, Grid } = gridiron


export default pure (
  { displayName: 'Home'
  , defaultProps: {
                  }
  , init() {
    /*
      const { ...props } = this.props
      this.components = [ { component: <Accordion orientation="ttb" {...props} /> }
                        , { component: <Accordion orientation="ltr" {...props} /> }
                        , { component: <Graph {...props} /> }
                        , { component: <Cards {...props} />, h: { xl: 21, lg: 10,  md: 8 } }
                        , { component: <Grid {...props} />, w: { xl: 2, lg: 2,  md: 1 }, h: 15 }
                        ].map((({ component, ...meta }, i) => ({ key: i, component, ...meta })))
                        */
    }
  , render() {
      return (
        <div>
          <Grid {...this.props} />
        </div>
      )
      return (
        <Layout>
          {this.components}
        </Layout>
      )
    }
  }
)
