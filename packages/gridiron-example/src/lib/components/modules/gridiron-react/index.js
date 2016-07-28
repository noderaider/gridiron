import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import reactStamp from 'react-stamp'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import gridironReact from 'gridiron-react'
import util from 'util'

import { Pre, Arrows } from '../react-pre'
import formula from '../react-formula'

import reduxPager from 'redux-pager'

import styles from 'gridiron-styles'
import { sandy, black, carbon  } from 'gridiron-themes'

const should = require('chai').should()

const { compose } = reactStamp(React)

let defaults = { styles, theme: carbon }

const deps = { React, connect, shallowCompare, Immutable, formula, Pre }

const { Pager } = reduxPager(deps, defaults)
//const createColumn = configureColumn(deps, defaults)
const { Grid, Footer, Logo, Column } = gridironReact(deps, defaults)


function createContext() {


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


  return { mapCols }
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
  return formula.subscribe(formNames, formStates => {

    const filterState = ids.reduce((result, id, i) => {
      const getFilterValue = dataKey => formStates[i].getIn([ getFilterName(dataKey), 'value' ], false)
      return { ...result, [id]: getFilterValue }
    })
    console.warn('FILTER STREAM', filterState)
    onFilter(filterState)
  })
}

const getFormName = id => `filter-form-${id}`
const getFilterName = id => `filter_${id}`


const FilterForm = compose(
  { init() {
      const { id } = this.props
      this.form = formula(`filter-form-${id}`)
    }
  , shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
  , render() {
      const { id, data } = this.props
      const { Field, Submit } = this.form
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

      //const { mapCols, mapRows } = createContext()

      return (
        container(({ Controls, Box, isMaximized, id, actions }) => (
          <Pager
            rowsPerPage={5}

            //mapCols={mapCols}
            //mapRows={mapRows}

            filterStream={
              createFilterStream([ 'id', 'state' ])
            }

            map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
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
                <Grid
                    styles={styles}
                    theme={carbon}
                    cols={pager.cols}
                    data={pager.status.get('data', Immutable.Map())}

                    mapColumn={(
                      { local: ({ colID }) => {
                          const { Header, Cell, Footer } = Column(colID)
                          return { Header, Cell, Footer }
                        }
                      , header: ({ local, ...props }) => {
                          return (
                            <local.Header checkbox={{ label: 'check here' }} {...props}>{props.colID}</local.Header>
                          )
                        }
                      , cell: ({ local, ...props }) => { //({ context, local, rowID, colID, cellDatum }) => {
                          return (
                            <local.Cell {...props} />
                          )
                        }
                      , footer: ({ local, ...props }) => {
                          return (
                            <local.Footer {...props} />
                          )
                        }
                      }
                    )}

/*
                    templates={
                      { GridHeader: props => <span style={{ textAlign: 'center' }}><h3>Accordion</h3></span>
                      , Row: ({ context, rowID, children, ...props }) => (
                          <div style={{ margin: 10
                                      , padding: 10
                                      , color: '#000'
                                      , fontWeight: 'bold'
                                      , border: '2px dashed rgb(100, 100, 200)'
                                      , borderRadius: 3
                                      , backgroundColor: 'rgba(180, 180, 200, 0.7)'
                                      , cursor: 'pointer'
                                      }} {...props}>
                            <h4>{rowID}</h4>
                          </div>
                        )
                      }
                    }
                    */


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
