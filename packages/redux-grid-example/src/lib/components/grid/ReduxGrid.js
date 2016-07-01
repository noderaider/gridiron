import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import ReactDOM from 'react-dom'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import * as ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'
import reactPre from 'react-pre'
import util from 'util'

import reduxPager from 'redux-pager'
import reduxPagerStyles from './css/redux-pager.css' // 'redux-pager/lib/styles.css'

import reactMaximize from 'react-maximize'
import reactMaximizeStyles from './css/react-maximize.css' // 'react-maximize/lib/styles.css'

import styles from './css/redux-grid.css'
import sandy from './css/theme/sandy.css'
import subgrid from './css/theme/subgrid.css'


const should = require('chai').should()

const { Maximize } = reactMaximize({ React, ReactDOM }, { styles: reactMaximizeStyles })
const { Pager } = reduxPager({ React, connect }, { styles: reduxPagerStyles })
const { CoreGrid, DrillGrid, Header, Footer, Expander } = reduxGrid({ React, ReactDOM, ReactVirtualized, connect, Immutable, Maximize })
const { Pre, Arrows } = reactPre({ React })


const mapCols = state => {
  return  [ { id: 'id'
            , header: ({ theme }) => <Header hasSort={true} hasFilter={true} theme={theme}>Path</Header>
            //, footer: ({ rows }) => <Footer theme={sandy}>{rows.length} rows</Footer>
            , width: 300
            }
          , { id: 'key'
            , header: ({ theme }) => <Header hasSort={true} hasFilter={true} theme={theme}>State</Header>
            //, footer: ({ rows }) => <Footer theme={sandy}>State</Footer>
            }
          ]
}



const createRowMapper = ({ ids = [] } = {}) => (state, { rows } = {}) => {
  const selectedState = ids.reduce((s, x) => s[x], state)

  return Object.keys(selectedState).reduce((rows, x, i) => {
    const id = [ ...ids, x ]
    return  [ ...rows
            , { id
              , render: () => [ <Arrows>{id}</Arrows>, <Pre>{selectedState[x]}</Pre> ]
              }
            ]
  }, [])
}

const mapDrill = (state, parentId) => <ReduxGridDetail ids={parentId} />

const ReduxGridDetail = props => (
  <Pager maxRecords={5} mapRows={createRowMapper({ ids: props.ids })} theme={sandy}>
    {pager => (
      <DrillGrid
        styles={styles}
        theme={sandy}
        mapCols={mapCols}
        mapRows={() => pager.rows}
        mapDrill={mapDrill}
        header={
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 6, fontSize: '1em' }}>
            <Arrows>{props.ids}</Arrows> details
          </span>
        }
        footer={
          [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
          , <pager.RowStatus key="pager-row-status" />
          , <pager.PageStatus key="pager-page-status" />
          , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
          ]
        }
        hasMaximize={true}
      />
    )}
  </Pager>
)

const ReduxGrid = props => (
  <Pager maxRecords={5} mapRows={createRowMapper()} theme={subgrid}>
    {pager => (
      <DrillGrid
        styles={styles}
        theme={subgrid}
        mapCols={mapCols}
        mapRows={() => pager.rows}
        mapDrill={mapDrill}
        header={
          <h3 style={{ margin: 0, letterSpacing: 6 }}>redux-grid</h3>
        }
        footer={
          [ <pager.Controls key="controls"><pager.Select /></pager.Controls>
          , <pager.RowStatus key="row-status" />
          , <pager.PageStatus key="page-status" />
          , <pager.RowCount key="row-count" />
          , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
          ]
        }
        hasMaximize={true}
        maximize={props.maximize}
        {...props}
      />
    )}
  </Pager>
)

export default ReduxGrid
