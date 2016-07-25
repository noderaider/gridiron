import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import reactStamp from 'react-stamp'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import gridironReact, { factories } from 'gridiron-react'
import util from 'util'

import { Pre, Arrows } from 'lib/components/modules/react-pre'

import reduxPager from 'redux-pager'

import styles from 'gridiron-styles'
import { sandy, black, carbon  } from 'gridiron-themes'

import forms from '../react-formula'
const should = require('chai').should()

const { compose } = reactStamp(React)

let defaults = { styles, theme: carbon }

const deps = { React, connect, shallowCompare, Immutable, forms }

const { Pager } = reduxPager(deps, defaults)
const { header } = factories(deps, defaults)
const { CoreGrid, DrillGrid, Footer, Logo } = gridironReact(deps, defaults)


function createContext() {
  const headers = [ header(), header() ]

  const mapCols = ({ status, actions, filters }) => {
    return  [ { id: 'id'
              , header: ({ theme }) => {
                  const { Header } = headers[0]
                  return (
                    <Header
                      id="id"
                      checkbox={{ value: 'header_checkbox' }}
                      status={status}
                      filter={filters['id']}
                      actions={actions}
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
                    <Header
                      id="state"
                      status={status}
                      filter={filters['state']}
                      actions={actions}
                      theme={theme}
                      styles={styles}
                    >
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
                        <input
                          type="checkbox"
                          checked={checkboxValue}
                          onChange={({ target }) => {
                            const newState = { checked: target.checked }
                            this.sendPub({ state: newState })
                            this.setSubState(newState)
                          }}
                        />
                        {children}
                        <span><Pre>{this.state}</Pre></span>
                      </div>
                    )
                  }
                }

  const Cell = headers[0].createCell(cell)


  const mapRows = (data, { sort, map } = {}) => {
    const rowData = map.rowData(data)
    const multipliers = sort.get('direction') ? sort.get('cols').map(colID => sort.getIn([ 'direction', colID ]) === 'desc' ? -1 : 1) : []

    function createSortKeys (cellData) {
      return sort.get('cols')
        .filter(colID => typeof sort.getIn([ 'direction', colID ]) === 'string')
        .map(colID => {
          const sortKey = sort.getIn([ 'keys', colID ], null)
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

    if(rows.some(x => x.sortKeys.size > 0)) {
      rows.sort(function comparator(a, b) {
        for(let colIndex = 0; colIndex < a.sortKeys.size; colIndex++) {
          let result = a.sortKeys.get(colIndex).localeCompare(b.sortKeys.get(colIndex)) * multipliers.get(colIndex)
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


const filter = (data, formState) => {
  if(formState) {
    let anyFiltered = false
    let filtered = Object.keys(data).filter(x => {
      console.warn('FILTERING KEY', x, formState)
      const value = formState.getIn([ `filter_${x}`, 'value' ], false)
      if(value)
        anyFiltered = true
      console.warn('VALUE => ', value)
      return value
    }).reduce((newData, x) => ({ ...newData, [x]: data[x] }), {})
    console.warn('POST RUN FILTER', filtered)
    return anyFiltered ? filtered : data
  }
  return data
}

const filterStream = id => (getData, onChange) => {
  const { subscribe } = forms(`filter-form-${id}`)
  const unsubscribe = subscribe(formState => onChange(filter(getData(), formState)))
  return unsubscribe
}

const FilterForm = compose(
  { statics: { filter }
  , init() {
      const { id } = this.props
      this.formula = forms(`filter-form-${id}`)
    }
    /*
  , componentDidMount() {
      console.warn('SUBSCRIBING')
      const { id, data, onChange } = this.props
      if(onChange)
        this.unsubscribe = filterStream(id, { getData: () => data, onChange })
    }
  , componentWillUnmount() {
      console.warn('UNSUBSCRIBING')
      if(this.unsubscribe)
        this.unsubscribe()
    }
    */
  , shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
  , render() {
      const { id, data } = this.props
      const { Field, Submit } = this.formula
      return (
        <div>
          {Object.keys(data).map((name, key) => (
            <Field key={key} name={`filter_${name}`} type="checkbox" label={name} />
          ))}
        </div>
      )
    }
  }
)

const Gridiron = compose(
  { displayName: 'gridiron'
  , init() {
      //setInterval(() => this.forceUpdate(), 5000)

    }
  , state: { forms: Immutable.Map() }
  , shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
  , render() {
      const { container } = this.props
      const ReduxGridDetail = detailProps => {
        const { mapCols, mapRows } = createContext()
        return container(({ Controls, Box, isMaximized, id, actions }) => (

          <Pager
            maxRecords={5}

            mapCols={mapCols}
            mapRows={mapRows}
            filterStream={filterStream}
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

      const { mapCols, mapRows } = createContext()

      return (
        container(({ Controls, Box, isMaximized, id, actions }) => (
          <Pager
            rowsPerPage={5}

            mapCols={mapCols}
            mapRows={mapRows}
            filterStream={filterStream}
            filters={
              { id: filterStream('id')
              , state: filterStream('state')
              }
            }

            map={ { data: state => state
                  , rowData: data => {
                      return Object.keys(data).map(x => [ [ x ], data[x] ])
                    /*
                      const formState = forms.getState()
                      let filtered = Object.keys(data).filter(x => {
                        const value = formState.getIn([ 'filter-form-id', `filter_${x}` ], false)
                        console.warn('VALUE => ', value)
                        return value
                      })
                      console.warn('POST RUN FILTER', filtered)
                      return (filtered.size > 0 ? Array.from(filtered.values()) : Object.keys(data)).map(x => [ [ x ], data[x] ])
                      */
                    }
                  , cellData: (rowID, rowDatum) => ({ id: rowID, state: rowDatum })
                  }
                }

            Filter={FilterForm}

            sort={Immutable.fromJS(
              { cols: [ 'id', 'state' ]
              , keys: { id: data => data.join('_')
                      , state: data => Object.keys(data).join('_')
                      }
              })
            }

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
