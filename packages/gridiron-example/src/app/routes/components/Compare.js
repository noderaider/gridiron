import pure from 'lib/modules/pure'
import * as gridiron from './gridiron'
import Layout from './Layout'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron


export default pure (
  { displayName: 'Home'
  , state: { components: null }
  , componentDidMount() {
      const { container } = this.props
      const childProps = { container }
      const components =  [ Grid
                          , require('./ag-grid').default
                          ].map((Component, i) => <Component key={i} {...childProps} />)
      this.setState({ components })
    }
  , render() {
      return (
        <Layout>
          {this.state.components}
        </Layout>
      )
    }
  }
)
