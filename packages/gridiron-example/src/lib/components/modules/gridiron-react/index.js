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

const deps = { React, connect, shallowCompare, Immutable, forms, Pre }

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



const filter = (data, filterState) => {
  if(filterState) {
    let anyFiltered = false
    let filtered = Object.keys(data).filter(x => {
      const value = filterState.getIn([ `filter_${x}`, 'value' ], false)
      if(value)
        anyFiltered = true
      return value
    }).reduce((newData, x) => ({ ...newData, [x]: data[x] }), {})
    return anyFiltered ? filtered : data
  }
  return data
}

const filterData = (data, filterState) => {
  if(filterState) {
    let anyFiltered = false
    let filtered = data.entrySeq().filter(([ id, datum ]) => {
      const value = Object.keys(filterState).some(filterID => {
        return filterState[filterID](id) === true
      })

      if(value)
        anyFiltered = true
      return value
    }).reduce((newData, x) => ({ ...newData, [x]: data[x] }), {})
    console.warn('FILTERED =>', filterState, filtered)
    return anyFiltered ? filtered : data
  }
  return data
}

const createFilterStream = ids => onFilter => {  //(getData, onChange) => {
  const formNames = ids.map(getFormName)
  return forms.subscribe(formNames, formStates => {

    const filterState = ids.reduce((result, id, i) => {
      const getFilterValue = dataKey => formStates[i].getIn([ getFilterName(dataKey), 'value' ], false)
      return { ...result, [id]: getFilterValue }
    })
    console.warn('FILTER STREAM', filterState)
    onFilter(filterState)
    //onChange(filterData(getData(), filterState))
  })
}

const filterStream = id => (getData, onChange) => {
  const { subscribe } = forms(`filter-form-${id}`)
  const unsubscribe = subscribe(filterState => onChange(filter(getData(), filterState)))
  return unsubscribe
}


const getFormName = id => `filter-form-${id}`
const getFilterName = id => `filter_${id}`


const FilterForm = compose(
  { statics: { filter }
  , init() {
      const { id } = this.props
      this.formula = forms(`filter-form-${id}`)
    }
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
  , state: { forms: Immutable.Map() }
  , shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
  , render() {
      const { container } = this.props

      const { mapCols, mapRows } = createContext()

      return (
        container(({ Controls, Box, isMaximized, id, actions }) => (
          <Pager
            rowsPerPage={5}

            mapCols={mapCols}
            mapRows={mapRows}
            filters={
              { id: filterStream('id')
              , state: filterStream('state')
              }
            }
            filterStream={
              createFilterStream([ 'id', 'state' ])
            }

            map={ { data: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
              /*
                  , rowData: data => {
                      return Immutable.Map(data)
                      //return Object.keys(data).map(x => [ [ x ], data[x] ])
                    }
                    */
                  , cellData: (rowID, rowDatum) => Immutable.Map({ id: rowID, state: rowDatum })
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
                    data={pager.status.get('data', Immutable.Map())}
                    mapDrill={parentId => <div>Sub grid for {parentID}</div>} //<ReduxGridDetail ids={parentId} />}
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
                    Pre={Pre}
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
