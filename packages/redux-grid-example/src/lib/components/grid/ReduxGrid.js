import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import ReactDOM from 'react-dom'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import * as ReactVirtualized from 'react-virtualized'
import Select from 'react-select'
import './css/react-select.gcss'
import reduxGrid from 'redux-grid'
import reactPre from 'react-pre'
import util from 'util'

import styles from './css/redux-grid.css'
import sandy from './css/theme/sandy.css'
import subgrid from './css/theme/subgrid.css'


const should = require('chai').should()

const { CoreGrid, DrillGrid, Header, Footer, Expander, Pager, Resize } = reduxGrid({ React, ReactDOM, ReactVirtualized, connect, Select, Immutable })
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



const createRowMapper = ({ ids = [], pager } = {}) => (state, { rows } = {}) => {
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


const wideStyle = { display: 'flex'
                  , flexDirection: 'row'
                  , flex: '1 0 auto'
                  , justifyContent: 'space-between'
                  , alignItems: 'center'
                  , margin: 'auto'
                  , padding: 5
                  }


const mapDrill = (state, parentId) => {
  return (
      <Pager maxRecords={5} mapRows={createRowMapper({ ids: parentId })} styles={styles} theme={sandy}>
        {pager => (
          <DrillGrid
            styles={styles}
            theme={subgrid}
            mapCols={mapCols}
            mapRows={pager.mapRows}
            mapDrill={mapDrill}
            header={
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 6, fontSize: '1em' }}>
                <Arrows>{parentId}</Arrows> details
              </span>
            }
            footer={
              <div style={wideStyle}>
                <pager.Buttons />
                <pager.RowStatus />
                <pager.PageStatus />
              </div>
            }
          />
        )}
    </Pager>

  )
}


export default class ReduxGrid extends Component {
  constructor(props) {
    super(props)
    this.state =  { isMaximized: false
                  }
  }
  render() {
    return (
      <Pager maxRecords={5} mapRows={createRowMapper({ pager: this.state.pager })} styles={styles} theme={sandy}>
        {pager => (
          <DrillGrid
            styles={styles}
            theme={sandy}
            mapCols={mapCols}
            mapRows={pager.mapRows}
            mapDrill={mapDrill}
            header={
              <div style={wideStyle}>
                <h3 style={{ margin: 0, letterSpacing: 6 }}>redux-grid</h3>
                <Resize isMaximized={this.state.isMaximized} onMaximize={() => this.setState({ isMaximized: true })} onCompress={() => this.setState({ isMaximized: false })} />
              </div>
            }
            footer={
              <div style={wideStyle}>
                <pager.Buttons>
                  <pager.PageSelect />
                </pager.Buttons>
                <pager.RowStatus />
                <pager.PageStatus />
              </div>
            }
            isMaximized={this.state.isMaximized}
            {...this.props}
          />
        )}
      </Pager>
    )
  }
}

export default ReduxGrid
