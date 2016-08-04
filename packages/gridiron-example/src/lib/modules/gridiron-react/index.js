import React, { PropTypes, cloneElement } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import pureStamp from 'pure-stamp'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import util from 'util'

import gridironReact from 'gridiron-react'
import reduxPager from 'redux-pager'
import { Pre, Arrows } from '../react-pre'
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
const getFilterName = rowID => `filter_${rowID}`

const createFilterStream = columnIDs => {
  const formNames = columnIDs.map(getFormName)
  return onFilter => {
    const unsubscribe = formula.subscribe(formNames, formStates => {
      const filterState = columnIDs.reduce((result, columnID, i) => {
        const formState = formStates[i]
        const getFilterValue = rowID => formState ? formState.getIn([ getFilterName(rowID), 'value' ], false) : false
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
          {columnData.entrySeq().map(([ rowID, cellData ], rowIndex) => {
            const cellDatum = cellData.get(columnID)
            return (
              <form.Field key={rowIndex} name={getFilterName(rowID)} type="checkbox"><Pre>{cellDatum}</Pre></form.Field>
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

      const graphData = [ { x: 25, y: 80, r: 10 }
                        , { x: 140, y: 20, r: 15 }
                        , { x: 40, y: 120, r: 15 }
                        , { x: 80, y: 30, r: 5 }
                        , { x: 280, y: 240, r: 20 }
                        , { x: 100, y: 15, r: 30 }
                        , { x: 330, y: 130, r: 5 }
                        , { x: 140, y: 12, r: 25 }
                        , { x: 180, y: 130, r: 35 }
                        , { x: 280, y: 10, r: 20 }
                        , { x: 200, y: 115, r: 2 }
                        , { x: 130, y: 130, r: 45 }
                        , { x: 280, y: 30, r: 5 }
                        , { x: 180, y: 240, r: 20 }
                        , { x: 100, y: 15, r: 30 }
                        , { x: 30, y: 130, r: 5 }
                        , { x: 140, y: 12, r: 25 }
                        , { x: 180, y: 130, r: 35 }
                        , { x: 480, y: 10, r: 20 }
                        , { x: 200, y: 115, r: 2 }
                        , { x: 130, y: 130, r: 45 }
                        ]
    let randomizedData = () => graphData.map(({ x, y, r }) => {
      return  { x: Math.random() * x * 5
              , y: Math.random() * y * 5
              , r: Math.random() * r
              }
    })

    let lotsData =
      randomizedData()
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())
        .concat(randomizedData())

      return (
        <div>



          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={500}
              map={ { rowData: state => {
                        return Immutable.Map(lotsData.map((x, index) => ([ index, Immutable.Map(x) ])))
                      }
                    , cellData: (rowID, rowDatum) => Immutable.Map({ datum: rowDatum })
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
                        , <pager.RowStatus key="pager-row-status" />
                        , <pager.PageStatus key="pager-page-status" />
                        , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                        ]
                      }

                      mapDatum={({ rowID, rowIndex, datum }) => (
                        <circle r={datum.get('r')} cx={datum.get('x')} cy={datum.get('y')} />
                      )}
                    />

                </Box>
              )}
            </Pager>
          ))}






          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={5}
              map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cellData: (rowID, rowDatum) => Immutable.Map({ accordion: Immutable.Map({ header: rowID, content: rowDatum }) })
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
                        , <pager.RowStatus key="pager-row-status" />
                        , <pager.PageStatus key="pager-page-status" />
                        , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                        ]
                      }

                      mapHeader={({ rowID, rowIndex, datum }) => (
                        <h3>{datum}</h3>
                      )}
                      mapContent={({ rowID, rowIndex, datum }) => (
                        <h4>content: <Pre>{{ rowID, rowIndex, datum }}</Pre></h4>
                      )}
                    />


                </Box>
              )}
            </Pager>
          ))}

          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={6}
              map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cellData: (rowID, rowDatum) => Immutable.Map({ accordion: Immutable.Map({ header: rowID, content: rowDatum }) })
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
                        [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                        , <pager.RowStatus key="pager-row-status" />
                        , <pager.PageStatus key="pager-page-status" />
                        , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                        ]
                      }

                      mapHeader={({ rowID, rowIndex, datum }) => (
                        <h3>{datum}</h3>
                      )}
                      mapContent={({ rowID, rowIndex, datum }) => (
                        <h4>content: <Pre>{{ rowID, rowIndex, datum }}</Pre></h4>
                      )}
                    />

                </Box>
              )}
            </Pager>
          ))}



          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={5}
              filterStream={createFilterStream(columns.ids)}

              map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cellData: (rowID, rowDatum) => Immutable.Map({ id: rowID, state: rowDatum })
                    }
                  }

              /** EARLY PROPS ({ rowData }) -> WILL BYPASS UPDATES IF DEFINED HERE */
              mapEarlyProps={
                ({ rowData, columnData }) => {
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
                      mapRow={(
                        { header: ({ local, rowID, rowIndex, rowDatum }) => (
                            <h3>{rowID}</h3>
                          )
                        , footer: ({ local, rowID, rowIndex, rowDatum }) => (
                            <h5 style={{ float: 'right' }}>({rowIndex + 1})</h5>
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
                      mapCell={({ columnLocal, rowLocal, rowIndex, columnIndex, rowID, columnID, datum }) => (
                        <columnLocal.Cell rowID={rowID}>
                          <Pre>{{ rowIndex, columnIndex, rowID, columnID, datum }}</Pre>
                        </columnLocal.Cell>
                      )}


                      mapDrill={parentId => <div>Sub grid for {parentID}</div>} //<ReduxGridDetail ids={parentId} />}
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
                                    <pager.RowStatus key="pager-row-status" />
                                    <pager.PageStatus key="pager-page-status" />
                                  </span>
                                )
                              , (
                                  <span key="footer-right">
                                    <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
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










      /*
      const ReduxGridDetail = detailProps => {
        const { mapCols, mapRows } = createContext()
        return container(({ Controls, Box, isMaximized, id, actions }) => (

          <Pager
            maxRecords={5}

            mapCols={mapCols}
            mapRows={mapRows}
            filters={
              { id: filterStream('id')
              , state: filterStream('state')
              }
            }
            map={ { data: state => detailProps.ids.reduce((subState, id) => subState[id], state)
                  , rowData: data => {
                      return Object.keys(data).map(x => [ [ ...detailProps.ids, x ], data[x] ]) //Object.keys(data).map(x => [ [ detailProps.ids, data ] ])
                    }
                  , cellData: (rowID, rowDatum) => ({ id: rowID, state: rowDatum })
                  }
                }

            sort={{ cols: [ 'id', 'state' ]
                  , keys: { id: data => data.join('_')
                          , state: data => Object.keys(data).join('_')
                          }
                  }}

            filter={data => {
              const status =  { id: { content: <FilterForm id="id" data={data} onChange={() => this.forceUpdate()} /> }
                              , state: { content: <FilterForm id="state" data={data} onChange={() => this.forceUpdate()} /> }
                              }
              return { data, status }
            }}



            theme={black}>
            {pager => (
              <Box>
                <DrillGrid
                  styles={styles}
                  theme={black}
                  cols={pager.cols}
                  rows={pager.rows}
                  mapDrill={parentId => <ReduxGridDetail ids={parentId} />}
                  header={
                    [ <span key="title" style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 6, fontSize: '1em' }}>
                        <Arrows>{detailProps.ids}</Arrows> details ({id})
                      </span>
                    , <Controls key="maximize" />
                    ]
                  }
                  footer={
                    [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                    , <pager.RowStatus key="pager-row-status" />
                    , <pager.PageStatus key="pager-page-status" />
                    , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                    ]
                  }
                  maximize={this.props.maximize}
                />
              </Box>
            )}
          </Pager>
        ))
      }
      */
