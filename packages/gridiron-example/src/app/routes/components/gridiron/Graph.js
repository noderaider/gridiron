import pure from 'lib/modules/pure'
import { sandy, black, carbon, mellow } from 'gridiron-themes'

const { React, PropTypes, cloneElement, Immutable, gridiron, defaults } = pure
const { Pager, Grid, Columns, Accordion, Cards, Graph, Pre, formula } = gridiron
const { styles, theme } = defaults

const should = require('chai').should()

const times = n => fn => Array(n).fill().map((_, i) => fn(i, n))

function* fibonacci(){
  let last = 0
  let next = 1
  while (true) {
    let current = last
    last = next
    next = current + last
    if(yield { current, last }) {
      last = 0
      next = 1
    }
  }
}


export default pure (
  { displayName: 'Graph'
  , init() {
      this.fib = fibonacci()

      this.generateSpiral = n => times(n)(() => this.fib.next().value || 0.001)
        .filter(({ current, last }) => last > 0)
        .map(({ current, last }, i) => {
          const phi = current / last
          const angle = 360 - (360 / last)
          const theta = angle * (i - 1)
          const d = Math.sqrt(i)
          const x = d * Math.cos(theta)
          const y = d * Math.sin(theta)
          return Immutable.Map( { x: window.innerWidth / 2 + 0.1 * d * x
                                , y: (396 / 2) + 0.1 * d * y
                                , r: 0.2 * d
                                })
        })
    }
  , componentWillMount() {
      this.setState({ spiral: this.generateSpiral(3000) })
    }
  , render() {
      const { container } = this.props
      return container(({ Controls, Box, isMaximized, id, actions }) => (
        <Pager
          documentsPerPage={500}
          map={ { documents: state => (
                    Immutable.Map(this.state.spiral.map((x, index) => ([ index, Immutable.Map(x) ])))
                  )
                }
              }
        >
          {pager => (
            <Box>
              <Graph
                  data={pager.status.get('data', Immutable.Map())}
                  header={
                    [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Graph</h2>
                    , <Controls key="maximize" />
                    ]
                  }
                  footer={
                    [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                    , <pager.DocumentStatus key="pager-row-status" />
                    , <pager.PageStatus key="pager-page-status" />
                    , <pager.DocumentsPerPage label="Documents Per Page" key="documents-per-page" />
                    ]
                  }
                  mapDatum={({ documentID, documentIndex, datum }) => (
                    <circle r={datum.get('r')} cx={datum.get('x')} cy={datum.get('y')} />
                  )}
                />
            </Box>
          )}
        </Pager>
      ))
    }
  }
)
