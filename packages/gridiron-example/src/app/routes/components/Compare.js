import pure from 'lib/modules/pure'
import ReactGridLayoutRaw, { WidthProvider } from 'react-grid-layout'
import * as gridiron from './gridiron'
import AgGrid from './ag-grid'

import './styles/vendor/react-grid-layout'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron

const ReactGridLayout = WidthProvider(ReactGridLayoutRaw)


export default pure (
  { displayName: 'Home'
  , defaultProps: { className: 'layout'
                  , rowHeight: 200
                  , cols: 2
                  , onLayoutChange: layout => console.warn('LAYOUT CHANGED', layout)
                  }
  , init() {
      const childProps = { container: this.props.container }
      this.components = [ <AgGrid />
                        , <Grid {...childProps} />
                        ]
      this.generateDOM = () => {
        return this.components.map((component, i) => {
          return <div key={i}>{component}</div>
        })
      }
      this.generateLayout = () => {
        const { cols } = this.props
        return this.components.map((component, i) => {
          const y = Math.floor(i / cols)
          return { x: i % cols, y, w: 1, h: 1, i: i.toString() }
        })
      }
    }
  , componentWillMount() {
      this.setState({ layout: this.generateLayout() })
    }
  , render() {
      const { title, subtitle, username, organization, email, full, packageName, container, ...props } = this.props
      console.table(this.state.layout)
      console.info(props)
      return (
        <ReactGridLayout
          {...props}
          layout={this.state.layout}
        >
          {this.generateDOM()}
        </ReactGridLayout>
        /*
          <Accordion key="a" container={container} />
          <Cards key="b" container={container} />
          <Graph key="c" container={container} />
          <Grid key="d" container={container} />
          */
      )
    }
  }
)
