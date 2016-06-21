import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import FixedDataTable from 'fixed-data-table'
import * as ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'

import './css/react-virtualized.css'
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
const state = { rows, list }

const { Grid, Header, Expander } = reduxGrid({ React, ReactDOM, ReactVirtualized, connect, Immutable, ContentBox })


const selectColumns = state => ({ name: <Header>Name</Header>
                                , interest: <Header>User Interest</Header>
                                , age: <Header>Age</Header>
                                //, sex: <Header>Sex</Header>
                                })


export default class ApiGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { expandedRows: [] }
  }
  componentDidMount() {
    //require('fixed-data-table/dist/fixed-data-table.css')
  }
  render() {
    const { expandedRows } = this.state
    const isExpanded = index => expandedRows.includes(index)

    const selectRows = state => {
      const rows = state.rows.map(([name, age, interest, sex], index) => {
        /*
        const controls = (
          <Expander handleExpand={() => {
            let newExpandedRows = expandedRows.includes(index) ? expandedRows.filter(x => x !== index) : [...expandedRows, index]
            newExpandedRows.sort()
            this.setState({ expandedRows: newExpandedRows })
          }} expanded={isExpanded(index)} />
        )
        */
        //const row = [controls, name, interest, age, sex ]
        const row = [name, interest, age, sex ]
        return row
      })
      return rows
    }



    const getExpandedIndices = () => this.state.expandedRows
    const isExpandable = index => index > 0
    const getClassName = index => styles.expandedRow
    const getExpanderClassName = index => styles.expander
    const getExpanderWidth = index => 25
    const onToggleExpand = index => {
      let newExpandedRows = expandedRows.includes(index) ? expandedRows.filter(x => x !== index) : [...expandedRows, index]
      newExpandedRows.sort()
      this.setState({ expandedRows: newExpandedRows })
    }

    const getContent = (index, state) => {
      return (
        <div style={{height: 200, border: '1px solid red'}}>
          <h3>EXPANDED {JSON.stringify(state.rows[index])}</h3>
        </div>
      )
      /* GRID CHILD
      return (
        <div>
          <h3>EXPANDED {JSON.stringify(state.rows[index])}</h3>
          <Grid
            styles={styles}
            selectColumns={selectColumns}
            selectRows={selectRows}
            expandedRows={[]}
            expandRowManager={{ isExpandable: index => false
                              , getExpandedIndices: index => []
                              }}
            state={state}
            height={200}
          />
        </div>
      )
      */
    }
    const getHeight = content => new Promise((resolve, reject) => {
      resolve(40)
      /*
      const divNode = document.createElement('div')
      document.body.appendChild(divNode)
      ReactDOM.render((
        <ReactHeight onHeightReady={
          height => resolve(height)
        }>
          {content}
        </ReactHeight>
      ), divNode)
      */
    })

    const expandRowManager =  { getExpandedIndices
                              , isExpandable
                              , getContent
                              , getHeight
                              , getClassName
                              , getExpanderClassName
                              , getExpanderWidth
                              , onToggleExpand
                              }


    return (
        <Grid
          styles={styles}
          selectColumns={selectColumns}
          selectRows={selectRows}
          expandedRows={this.state.expandedRows}
          expandRowManager={expandRowManager}
          state={state}  />
    )
  }
}
