import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import * as ReactVirtualized from 'react-virtualized'
import * as ReactGateway from 'react-gateway'
import reduxGrid from 'redux-grid'
import { factories } from 'redux-grid-core'
import reactPre from 'react-pre'
import util from 'util'


import reduxPager from 'redux-pager'
import reduxPagerStyles from './css/redux-pager.css' // 'redux-pager/lib/styles.css'


import styles from './css/redux-grid.css'
import sandy from './css/theme/sandy.css'
import subgrid from './css/theme/subgrid.css'


const should = require('chai').should()

const { Pager } = reduxPager({ React, connect, shallowCompare }, { styles: reduxPagerStyles })
const { header } = factories({ React })
const { CoreGrid, DrillGrid, Footer, Expander } = reduxGrid({ React, ReactDOM, ReactVirtualized, connect, Immutable })
const { Pre, Arrows } = reactPre({ React })



function createContext() {
  const headers = [ header(), header() ]

  const mapCols = state => {
    return  [ { id: 'id'
              , header: ({ theme }) => {
                  const { Header } = headers[0]
                  return (
                    <Header
                      checkbox={{ value: 'header_checkbox' }}
                      sort={{}}
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
            , { id: 'key'
              , header: ({ theme }) => {
                  const { Header } = headers[1]
                  return (
                    <Header sort={{}} filter={{}} theme={theme} styles={styles}>
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


  const createRowMapper = ({ ids = [] } = {}) => (state, { rows } = {}) => {
    const selectedState = ids.reduce((s, x) => s[x], state)

    return Object.keys(selectedState).reduce((rows, x, i) => {
      const id = [ ...ids, x ]
      return  [ ...rows
              , { id
                , render: () => [ (

                    <Cell><Arrows>{id}</Arrows></Cell>
                  ), <Pre>{selectedState[x]}</Pre> ]
                }
              ]
    }, [])
  }

  return { mapCols, createRowMapper }
}


class ReduxGrid extends Component {
  render() {
    const { container } = this.props
    const ReduxGridDetail = detailProps => {
      const { mapCols, createRowMapper } = createContext()
      return container(({ Controls, Box, isMaximized, id, actions }) => (
          <Pager maxRecords={5} mapRows={createRowMapper({ ids: detailProps.ids })} theme={sandy}>
          {pager => (
            <Box>
              <DrillGrid
                styles={styles}
                theme={sandy}
                mapCols={mapCols}
                mapRows={() => pager.rows}
                mapDrill={(state, parentId) => <div>THIRD</div> /*<ReduxGridDetail ids={parentId} />*/}
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
        )
      )
    }

    const { mapCols, createRowMapper } = createContext()

    return (
      container(
        ({ Controls, Box, isMaximized, id, actions }) => (
        <Pager rowsPerPage={5} mapRows={createRowMapper()} theme={subgrid}>
        {pager => (
          <Box>
            <DrillGrid
                styles={styles}
                theme={subgrid}
                mapCols={mapCols}
                mapRows={() => pager.rows}
                mapDrill={(state, parentId) => <ReduxGridDetail ids={parentId} />}
                header={
                  [ <h3 key="title" style={{ margin: 0, letterSpacing: 6 }}>redux-grid - {id}</h3>
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
      )
      )
      //</Container>
    )
  }
}

export default ReduxGrid
