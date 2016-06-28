import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import ReactDOM from 'react-dom'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import FixedDataTable from 'fixed-data-table'
import * as ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'
import reactPre from 'react-pre'
import util from 'util'

import styles from './css/redux-grid.css'
import sandy from './css/theme/sandy.css'
import subgrid from './css/theme/subgrid.css'

import { ContentBox } from './ContentBox'

const should = require('chai').should()


const { CoreGrid, DrillGrid, Header, Footer, Expander } = reduxGrid({ React, ReactDOM, ReactCSSTransitionGroup, ReactVirtualized, connect, Immutable, ContentBox })
const { Pre, Arrows } = reactPre({ React })


const mapCols = state => {
  return  [ { id: 'id'
            , header: () => <Header hasSort={true} hasFilter={true} theme={sandy}>Path</Header>
            , footer: ({ rows }) => <Footer hasSort={true} hasFilter={true} theme={sandy}>{rows.length} rows</Footer>
            , width: 300
            }
          , { id: 'key'
            , header: () => <Header hasSort={true} hasFilter={true} theme={sandy}>State</Header>
            //, footer: ({ rows }) => <Footer theme={sandy}>State</Footer>
            }
          ]
}



const mapIdRows = (ids = []) => state => {
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

const mapDrill = (state, parentId) => {
  const mapSubRows = mapIdRows(parentId)
  return (
    <div style={{ marginTop: 6, marginBottom: 4 }}>
      <span style={{ marginLeft: '5%', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 6, fontSize: '1em', color: '#2B3140' }}>
        <Arrows>{parentId}</Arrows> details
      </span>
      <DrillGrid
        style={{ marginTop: 10 }}
        styles={styles}
        theme={subgrid}
        mapCols={mapCols}
        mapRows={mapSubRows}
        mapDrill={mapDrill}
      />
    </div>
  )
}


const ReduxGrid = props => (
  <DrillGrid
    styles={styles}
    theme={sandy}
    mapCols={mapCols}
    mapRows={mapIdRows()}
    mapDrill={mapDrill}
    {...props}
  />
)

export default ReduxGrid
