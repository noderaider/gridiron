import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import reactStamp from 'react-stamp'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import gridironReact, { factories } from 'gridiron-react'
import util from 'util'

import reactPre from 'react-pre'
import reduxPager from 'redux-pager'

import styles from 'gridiron-styles'
import { sandy, black, carbon  } from 'gridiron-themes'

const should = require('chai').should()

const { compose } = reactStamp(React)

let defaults = { styles, theme: carbon }

const { Pager } = reduxPager({ React, connect, shallowCompare }, defaults)
const { header } = factories({ React }, defaults)
const { CoreGrid, DrillGrid, Footer, Logo } = gridironReact({ React, shallowCompare, connect, Immutable }, defaults)
const { Pre, Arrows } = reactPre({ React })

function createContext() {
  const headers = [ header(), header() ]

  const mapCols = ({ status, actions }) => {
    return  [ { id: 'id'
              , header: ({ theme }) => {
                  const { Header } = headers[0]
                  return (
                    <Header
                      id="id"
                      checkbox={{ value: 'header_checkbox' }}
                      status={status}
                      actions={actions}
                      filter={{}}
                      styles={styles}
                    >
                      Path
                    </Header>
                  )
              }

              //, footer: ({ rows }) => <Footer theme={sandy}>{rows.length} rows</Footer>
              , width: 300
              }
            , { id: 'state'
              , header: ({ theme }) => {
                  const { Header } = headers[1]
                  return (
                    <Header id="state" status={status} actions={actions} filter={{}} theme={theme} styles={styles}>
                      State
                    </Header>
                  )
                }
              //, footer: ({ rows }) => <Footer theme={sandy}>State</Footer>
              }
            ]
  }

  const cellStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'wrap'
                    , justifyContent: 'space-between'
                    , alignItems: 'center'
                    }


  const cell =  { state: { checked: false }
                , render() {
                    const { checkbox, children } = this.props
                    const { pub, sub } = this.state
                    const checkboxValue = this.latest([ 'state', 'checked' ], false)
                    return (
                      <div style={cellStyle}>
                        <input type="checkbox" checked={checkboxValue} onChange={({ target }) => this.sub({ state: { checked: target.checked } })} />
                        {children}
                        <span><Pre>{this.state}</Pre></span>
                      </div>
                    )
                  }
                }

  const Cell = headers[0].createSub(cell)


  const mapRows = (data, { sort, map } = {}) => {
    const rowData = map.rowData(data)
    const multipliers = sort.direction ? sort.cols.map(colID => sort.direction[colID] === 'desc' ? -1 : 1) : []


    function createSortKeys (cellData) {
      return sort.cols
        .filter(colID => sort.direction && typeof sort.direction[colID] === 'string')
        .map(colID => {
          const sortKey = sort.keys ? sort.keys[colID] : null
          const cellDatum = cellData[colID]
          const currentKey = sortKey ? sortKey(cellDatum) : cellDatum
          return typeof currentKey === 'string' ? currentKey : currentKey.toString()
        })
    }

    let rows = rowData.map(([ rowID, rowDatum ]) => {
      const cellData = map.cellData(rowID, rowDatum)
      const sortKeys = createSortKeys(cellData)
      return ({ rowID
              , rowDatum
              , cellData
              , sortKeys
              , cells:  [ ({ datum }) => <Cell><Arrows>{datum}</Arrows></Cell>
                        , ({ datum }) => <Pre>{datum}</Pre>
                        ]
              })
    })

    if(rows.some(x => x.sortKeys.length > 0)) {
      rows.sort(function comparator(a, b) {
        for(let colIndex = 0; colIndex < a.sortKeys.length; colIndex++) {
          let result = a.sortKeys[colIndex].localeCompare(b.sortKeys[colIndex]) * multipliers[colIndex]
          if(result !== 0)
            return result
        }
        return 0
      })
    }

    return rows
  }
  return { mapCols, mapRows }
}


const Gridiron = compose(
  { displayName: 'gridiron'
  , render() {
      const { container } = this.props
      const ReduxGridDetail = detailProps => {
        const { mapCols, mapRows } = createContext()
        console.warn('DETAIL', detailProps)
        return container(({ Controls, Box, isMaximized, id, actions }) => (

          <Pager
            maxRecords={5}
            mapCols={mapCols}
            mapRows={mapRows}

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

      const { mapCols, mapRows } = createContext()

      return (
        container(({ Controls, Box, isMaximized, id, actions }) => (
          <Pager
            rowsPerPage={5}

            mapCols={mapCols}
            mapRows={mapRows}

            map={ { data: state => state
                  , rowData: data => Object.keys(data).map(x => [ [ x ], data[x] ])
                  , cellData: (rowID, rowDatum) => ({ id: rowID, state: rowDatum })
                  }
                }


            sort={{ cols: [ 'id', 'state' ]
                  , keys: { id: data => data.join('_')
                          , state: data => Object.keys(data).join('_')
                          }
                  }}
            theme={carbon}>
            {pager => (
              <Box>
                <DrillGrid
                    styles={styles}
                    theme={carbon}
                    cols={pager.cols}
                    rows={pager.rows}
                    mapDrill={parentId => <ReduxGridDetail ids={parentId} />}
                    header={
                      [ <h3 key="title" style={{ margin: 0, letterSpacing: 6 }}>gridiron - {id}</h3>
                      , <Controls key="maximize" />
                      ]
                    }
                    footer={[ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                            , <pager.RowStatus key="pager-row-status" />
                            , <pager.PageStatus key="pager-page-status" />
                            , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                            ]}
                    {...this.props}
                  />
              </Box>
            )}
          </Pager>
        ))
      )
    }
  }
)

export { Logo, Gridiron }
