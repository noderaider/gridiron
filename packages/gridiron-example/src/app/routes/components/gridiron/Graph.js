import pure from 'lib/modules/pure'
import { sandy, black, carbon, mellow } from 'gridiron-themes'

import styles from './Graph.css'


const { React, PropTypes, cloneElement, Immutable, gridiron, defaults } = pure
const { Pager, Grid, Columns, Accordion, Cards, Graph, Pre, formula } = gridiron

const should = require('chai').should()

const times = n => fn => Array(n).fill().map((_, i) => fn(i, n))

function* fibonacci (n) {
  const isInfinite = n === undefined
  let current = 0
  let next = 1

  while (isInfinite || n--) {
    yield current
    ;[ current, next ] = [ next, current + next ]
  }
}


function* sunflower(n, { scaleX = 0.04, scaleY = 0.04, scaleR = 0.06 } = {}) {
  const isInfinite = typeof n !== 'number'
  const fib = fibonacci(n)
  let last = 0
  let current = 0
  let iteration = 0

  while (isInfinite || n--) {
    last = current
    current = fib.next().value

    if(last === 0)
      yield Immutable.Map({ x: 0, y: 0, r: 0 })
    const phi = current / last
    const angle = 360 - (360 / last)
    const theta = angle * (iteration - 1)
    const d = Math.sqrt(iteration)
    const x = d * Math.cos(theta)
    const y = d * Math.sin(theta)

    yield Immutable.Map({ x: scaleX * d * x
                        , y: scaleY * d * y
                        , r: scaleR * d
                        })
    iteration++
  }
}

function* spiral(n, { thetaIncrement = 1, a = 1 } = {}) {
  const isInfinite = typeof n !== 'number'
  //const [ ...fib ]= fibonacci(75)
  const fib = fibonacci(n)
  let theta = 0
  let last = 0
  let current = 0



  while (isInfinite || n--) {
    last = current
    current = fib.next().value
    const phi = current / last
    const b = Math.log(phi) / 90


    const rads = theta * (Math.PI / 180)
    const calc = Math.exp(b * rads)
    const x = a * Math.cos(rads) * calc
    const y = a * Math.sin(rads) * calc

    yield { x, y, theta }
    theta += thetaIncrement
  }
}

const spiralState = [ ...spiral(1080, { a: 5 }) ]

export default pure (
  { displayName: 'Graph'
  , componentWillMount() {
      this.setState({ spiral: spiralState })
    }
  , render() {
      const { container } = this.props
      const maxX = 8
      const maxY = 8
      const minX = -8
      const minY = -8
      return container(({ Controls, Box, isMaximized, id, actions }) => (
        <Pager
          documentsPerPage={500}
          map={ { documents: state => (
                    Immutable.OrderedMap(this.state.spiral.map((point, index) => ([ index, Immutable.Map(point) ]) ))
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
                  minX={minX}
                  maxX={maxX}
                  minY={minY}
                  maxY={maxY}
                  mapDatum={({ documentID, documentIndex, datum }) => {

                    const rawX = datum.get('x')
                    const rawY = datum.get('y')
                    const theta = datum.get('theta')

                    const x = rawX === Infinity ? maxX : Number.isNaN(rawX) ? minX : rawX.toFixed(2) || 0
                    const y = rawY === Infinity ? maxY : Number.isNaN(rawY) ? minY : rawY.toFixed(2) || 0

                    let localText = null
                    return (
                      <g
                        transform={`translate(${x}, ${y})`}
                        className={styles.g}
                      >
                        <circle
                          r={0.1}
                          onMouseOver={() => {
                            if(localText)
                              localText.display = true
                          }}
                        />
                        <text
                          ref={x => localText = x}
                          className={styles.text}
                        >
                          {theta}° ({x}, {y})
                        </text>
                      </g>
                    )
                  }}
                />
            </Box>
          )}
        </Pager>
      ))
    }
  }
)
