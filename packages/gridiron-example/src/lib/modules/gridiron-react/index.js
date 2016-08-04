import React, { PropTypes, cloneElement } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import pureStamp from 'pure-stamp'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import util from 'util'

import gridironReact from 'gridiron-react'
import reduxPager from 'redux-pager'
import { Pre } from '../react-pre'
import formula from '../react-formula'


import styles from 'gridiron-styles'
import { sandy, black, carbon, mellow } from 'gridiron-themes'

const should = require('chai').should()

const deps = { React, shallowCompare, connect, Immutable, formula, Pre }
const defaults = { styles, theme: mellow }
const pure = pureStamp(deps, defaults)

const { Pager } = reduxPager(deps, defaults)
const { Grid, Accordion, Cards, Graph, Columns, Logo } = gridironReact(deps, defaults)

const getFormName = columnID => `filter-form-${columnID}`
const getFilterName = documentID => `filter_${documentID}`

const createFilterStream = columnIDs => {
  const formNames = columnIDs.map(getFormName)
  return onFilter => {
    const unsubscribe = formula.subscribe(formNames, formStates => {
      const filterState = columnIDs.reduce((result, columnID, i) => {
        const formState = formStates[i]
        const getFilterValue = documentID => formState ? formState.getIn([ getFilterName(documentID), 'value' ], false) : false
        return { ...result, [columnID]: getFilterValue }
      }, {})

      onFilter(filterState)
    })
    return unsubscribe
  }
}



const FilterForm = pure (
  { displayName: 'FilterForm'
  , propTypes:  { columnID: PropTypes.any
                , columnData: PropTypes.object.isRequired
                }
  , render() {
      const { columnData, columnID } = this.props
      const form = formula(getFormName(this.props.columnID))
      return (
        <div>
          {columnData.entrySeq().map(([ documentID, cells ], documentIndex) => {
            const cellDatum = cells.get(columnID)
            return (
              <form.Field key={documentIndex} name={getFilterName(documentID)} type="checkbox"><Pre>{cellDatum}</Pre></form.Field>
            )
          })}
        </div>
      )
    }
  }
)

const Gridiron = pure (
  { displayName: 'Gridiron'
  , state: { forms: Immutable.Map() }
  , render() {
      const { container } = this.props

      const columns = Columns('id', 'state')

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

      let fib = fibonacci()

      let spiral = n => times(n)(() => fib.next().value || 0.001)
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
      let spiralData = spiral(3000)

      return (
        <div>

          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              documentsPerPage={500}
              map={ { documents: state => (
                        Immutable.Map(spiralData.map((x, index) => ([ index, Immutable.Map(x) ])))
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
          ))}




          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              documentsPerPage={5}
              map={ { documents: state => (Immutable.Map.isMap(state) ? state : Immutable.Map(state)).map(
                        (datum, documentID) => Immutable.Map({ header: documentID, content: datum })
                      )
                    }
                  }
            >
              {pager => (
                <Box>

                  <Accordion
                      data={pager.status.get('data', Immutable.Map())}

                      header={
                        [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Accordion</h2>
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

                      mapHeader={({ documentID, documentIndex, datum }) => (
                        <h3>{datum}</h3>
                      )}
                      mapContent={({ documentID, documentIndex, datum }) => (
                        <h4><Pre>{{ documentID, documentIndex, datum }}</Pre></h4>
                      )}
                    />


                </Box>
              )}
            </Pager>
          ))}

          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              documentsPerPage={6}
              map={ { documents: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cells: (documentID, document) => Immutable.Map({ accordion: Immutable.Map({ header: documentID, content: document }) })
                    }
                  }
            >
              {pager => (
                <Box>

                  <Cards
                      data={pager.status.get('data', Immutable.Map())}

                      header={
                        [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Cards</h2>
                        , <Controls key="maximize" />
                        ]
                      }
                      footer={
                        [ <pager.Controls key={0}><pager.Select /></pager.Controls>
                        , <pager.DocumentStatus key={1} />
                        , <pager.PageStatus key={2} />
                        , <pager.DocumentsPerPage key={3} label="Documents Per Page" />
                        ]
                      }

                      mapHeader={({ documentID, documentIndex, datum }) => (
                        <h3>{datum}</h3>
                      )}
                      mapContent={({ documentID, documentIndex, datum }) => (
                        <h4>content: <Pre>{{ documentID, documentIndex, datum }}</Pre></h4>
                      )}
                    />

                </Box>
              )}
            </Pager>
          ))}



          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              documentsPerPage={5}
              filterStream={createFilterStream(columns.ids)}

              map={ { documents: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cells: (documentID, document) => Immutable.Map({ id: documentID, state: document })
                    }
                  }

              /** EARLY PROPS ({ documents }) -> WILL BYPASS UPDATES IF DEFINED HERE */
              mapEarlyProps={
                ({ documents, columnData }) => {
                  const columnFilters = columns.reduce(columnID => <FilterForm columnData={columnData} columnID={columnID} />)
                  return { columnFilters }
                }
              }

              sort={Immutable.fromJS(
                { cols: columns.ids
                , keys: { id: datum => datum
                        , state: datum => Object.keys(datum).join('_')
                        }
                })
              }
            >
              {pager => (
                <Box>
                  <Grid
                      data={pager.status.get('data', Immutable.Map())}
                      mapDocument={(
                        { header: ({ local, documentID, documentIndex, document }) => (
                            <h3>{documentID}</h3>
                          )
                        , footer: ({ local, documentID, documentIndex, document }) => (
                            <h5 style={{ float: 'right' }}>({documentIndex + 1})</h5>
                          )
                        }
                      )}
                      mapColumn={
                        { local: columnID => columns[columnID]
                        , header: ({ local, columnID, columnIndex }) => (
                            <local.Header
                              actions={pager.actions}
                              fields={{ checkbox: true
                                      //, radio: [ { yes: 'Yes', no: 'No' }, 'yes' ]
                                      , filter: true
                                      , sort: pager.status.get('sort')
                                      }}
                              paneContent={pager.earlyProps.columnFilters[columnID]}
                            >
                              {columnID}
                            </local.Header>
                          )
                        , footer: ({ local, columnID, columnIndex }) => (
                            <local.Footer />
                          )
                        }
                      }
                      mapCell={({ local, documentIndex, columnIndex, documentID, columnID, datum }) => (
                        <local.Cell documentID={documentID}>
                          <Pre>{{ documentIndex, columnIndex, documentID, columnID, datum }}</Pre>
                        </local.Cell>
                      )}

                      header={
                        [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Grid</h2>
                        , <Controls key="maximize" />
                        ]
                      }
                      footer={[ (
                                  <span key="footer-left">
                                    <pager.Controls key="pager-buttons">
                                      <pager.Select />
                                    </pager.Controls>
                                  </span>
                                )
                              , (
                                  <span key="footer-center">
                                    <pager.DocumentStatus key="pager-row-status" />
                                    <pager.PageStatus key="pager-page-status" />
                                  </span>
                                )
                              , (
                                  <span key="footer-right">
                                    <pager.DocumentsPerPage label="Documents Per Page" key="documents-per-page" />
                                  </span>
                                )
                              ]}
                      {...this.props}
                    />
                </Box>
              )}
            </Pager>
          ))}
        </div>
      )
    }
  }
)

export { Logo, Gridiron }
