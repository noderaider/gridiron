import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import ReactDOM from 'react-dom'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import FixedDataTable from 'fixed-data-table'
import * as ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'
import util from 'util'

import styles from './css/redux-grid.css'
import { ContentBox } from './ContentBox'

const should = require('chai').should()


const rows =  [ [ 'jim', 26, 'being boring', 'male' ]
              , [ 'tony', 37, 'skydiving', 'male' ]
              , [ 'lisa', 40, 'sleeping', 'female' ]
              , [ 'dan', 20, 'jumping', 'male' ]
              , [ 'sarah', 15, 'eating', 'female' ]
              , [ 'michael', 25, 'nothing', 'unsure' ]
              , [ 'michelle', 35, 'idk', 'female' ]
              ]

const list = Immutable.List(rows)

const getState = () => ({ rows, list })

const { CoreGrid, DrillGrid, Header, Expander } = reduxGrid({ getState, React, ReactDOM, ReactCSSTransitionGroup, ReactVirtualized, connect, Immutable, ContentBox })

const mapCols = state => ({ name: { render: <Header>Name</Header>, width: 100 }
                          , interest: <Header>User Interest</Header>
                          , age: <Header>Age</Header>
                          , sex: <Header>Sex</Header>
                          })


console.info('INFO', util.inspect({ CoreGrid, DrillGrid, Header, Expander }))

export default class ApiGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { expandedRows: [] }
  }
  render() {
    const { expandedRows } = this.state
    const isExpanded = index => expandedRows.includes(index)

    const mapRows = state => state.rows.map(([ name, age, interest, sex ], index) => [ name, interest, age, sex ])
    const getExpandedIndices = () => this.state.expandedRows
    const isExpandable = index => index > 0
    const getClassName = index => styles.expandedRow
    const getExpanderClassName = index => styles.expander
    const getExpanderWidth = index => 25
    const onToggleExpand = index => {
      let newExpandedRows = expandedRows.includes(index) ? expandedRows.filter(x => x !== index) : [ ...expandedRows, index ]
      newExpandedRows.sort()
      this.setState({ expandedRows: newExpandedRows })
    }

    const getContent = (index, state) => {
      return (
        <div style={{ border: '1px solid black' }}>
          <h3>EXPANDED {JSON.stringify(state.rows[index])}</h3>
          <hr />
          <div>
            <h4>MORE STUFF</h4>
          </div>
          <hr />
          <div style={{ fontSize: '0.9em' }}>
            FOOTER GOES HERE
          </div>
        </div>
      )
    }
    const getHeight = content => 150

    const expandRowManager =  { getExpandedIndices
                              , isExpandable
                              , getContent
                              , getHeight
                              , getClassName
                              , getExpanderClassName
                              , getExpanderWidth
                              , onToggleExpand
                              , rowStyle: styles.rowStyle
                              , totalHeight: 0
                              }


    return (
        <DrillGrid
          styles={styles}
          mapCols={mapCols}
          mapRows={mapRows}
          expandedRows={this.state.expandedRows}
          expandRowManager={expandRowManager}
        />
    )
  }
}
