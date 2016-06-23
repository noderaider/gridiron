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
import cream from './css/theme/cream.css'
import subgrid from './css/theme/subgrid.css'

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

const { CoreGrid, DrillGrid, Header, Expander } = reduxGrid({ /*getState, */ React, ReactDOM, ReactCSSTransitionGroup, ReactVirtualized, connect, Immutable, ContentBox })


/*
const mapCols = state =>  [ { id: 'name', render: () => <Header>Name</Header>, width: 100 }
                          , { id: 'interest', render: () => <Header>User Interest</Header> }
                          , { id: 'age', render: () => <Header>Age</Header> }
                          , { id: 'sex', render: () => <Header>Sex</Header> }
                          ]
                          */
                          /*
const mapCols = state => Object.keys(state).reduce((cols, x) => {
  return [ ...cols, { id: x, render: () => <Header>{x}</Header> } ]
}, [])
*/



const mapCols = state => {
  return  [ { id: 'index', render: () => <Header>Index</Header>, width: 100 }
          , { id: 'key', render: () => <Header>Key</Header> }
          ]
}

//const mapRows = state => state.rows.map(([ name, age, interest, sex ], index) => [ name, interest, age, sex ])
const mapRows = state => Object.keys(state).reduce((rows, x, i) => {
  return [ ...rows, [ i, x ] ]
}, [])

const mapIds = (state, index) => {
  const stateKeys = Object.keys(state)
  return stateKeys[index]
}

const mapDrill = (state, id) => {
  const stateKey = Object.keys(state)[id]
  const subState = state[stateKey]
  const subStateKeys = Object.keys(subState)
  console.info('STATE KEY', stateKey, subState, subStateKeys)
  /*
  const mapSubCols = s => {
    return  [ { id: 'index', render: () => <Header>Index</Header> }
            , { id: 'key', render: () => <Header>Key</Header> }
            ]

  }
  */
  const mapSubRows = s => {
    return subStateKeys.reduce((rows, x, i) => {
      return [ ...rows, [ i, x ] ]
    }, [])
  }
  return (
    <div>
      <span style={{ fontWeight: 'bold', letterSpacing: 3 }}>Subgrid for {id}</span>
      <DrillGrid
        styles={styles}
        theme={subgrid}
        mapCols={mapCols}
        mapIds={mapIds}
        mapRows={mapSubRows}
        mapDrill={mapDrill}
      />
    </div>
  )
}


export default class ReduxGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { expandedRows: [] }
  }
  render() {
    const { expandedRows } = this.state

    const getExpandedIndices = () => this.state.expandedRows
    const getClassName = index => styles.expandedRow
    const getExpanderClassName = index => styles.expander
    const getExpanderWidth = index => 25
    const onToggleExpand = index => {
      let newExpandedRows = expandedRows.includes(index) ? expandedRows.filter(x => x !== index) : [ ...expandedRows, index ]
      newExpandedRows.sort()
      this.setState({ expandedRows: newExpandedRows })
    }

    return (
        <DrillGrid
          styles={styles}
          theme={cream}
          mapCols={mapCols}
          mapRows={mapRows}
          mapIds={mapIds}
          mapDrill={mapDrill}
          {...this.props}
        />
    )
  }
}
