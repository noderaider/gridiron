import pure from 'lib/modules/pure'
import ReactGridLayout from 'react-grid-layout'
import * as gridiron from './gridiron'

import './styles/vendor/react-grid-layout'

const { React, PropTypes } = pure
const { Accordion, Cards, Graph, Grid } = gridiron


const layout =
[ { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true }
, { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }
, { i: 'c', x: 4, y: 0, w: 1, h: 2 }
, { i: 'd', x: 4, y: 0, w: 1, h: 2 }
]

export default pure (
  { displayName: 'Home'
  , render() {
      const { title, subtitle, username, organization, email, full, packageName, container } = this.props
      return (
        /*
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}

        >
        </ReactGridLayout>
        */
        <div>
          <Accordion key="a" container={container} />
          <Cards key="b" container={container} />
          <Graph key="c" container={container} />
          <Grid key="d" container={container} />
        </div>
      )
    }
  }
)
