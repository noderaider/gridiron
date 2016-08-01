import React, { PropTypes, cloneElement } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import shallowCompare from 'react-addons-shallow-compare'
import pureStamp from 'pure-stamp'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import util from 'util'

import gridironReact from 'gridiron-react'
import reduxPager from 'redux-pager'
import { Pre, Arrows } from '../react-pre'
import formula from '../react-formula'


import styles from 'gridiron-styles'
import { sandy, black, carbon  } from 'gridiron-themes'

const should = require('chai').should()

const deps = { React, shallowCompare, connect, Immutable, formula, Pre }
const defaults = { styles, theme: carbon }
const pure = pureStamp(deps, defaults)

const { Pager } = reduxPager(deps, defaults)
const { Grid, Accordion, Column, Logo } = gridironReact(deps, defaults)


function createContext() {
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
                          }}
                        />
                        {children}
                      </div>
                    )
                  }
                }

  const Cell = headers[0].createCell(cell)


  return { mapCols }
}


const createFilterStream = columnIDs => onFilter => {  //(getData, onChange) => {
  const formNames = columnIDs.map(getFormName)
  console.warn('FILTER STREAM CREATED', formNames)
  return formula.subscribe(formNames, formStates => {
    console.warn('GETTING FILTER STATE', formStates, columnIDs)

    const filterState = columnIDs.reduce((result, columnID, i) => {
      const formState = formStates[i]
      const getFilterValue = rowID => formState ? formState.getIn([ getFilterName(rowID), 'value' ], false) : false
      return { ...result, [columnID]: getFilterValue }
    }, {})
    console.warn('FILTER STREAM', filterState)

    onFilter(filterState)
  })
}

const getFormName = columnID => `filter-form-${columnID}`
const getFilterName = rowID => `filter_${rowID}`



const FilterForm = pure (
  { displayName: 'FilterForm'
  , propTypes:  { columnID: PropTypes.any
                , rowData: PropTypes.object.isRequired
                }
  , render() {
      const { rowData, columnID } = this.props
      if(!columnID)
        return null
      const form = formula(getFormName(this.props.columnID))
      return (
        <div>
          {rowData.entrySeq().map(([ rowID, context ], rowIndex) => {
            const cellDatum = context.getIn([ 'cellData', columnID ])
            return (
              <form.Field key={rowIndex} name={getFilterName(rowID)} type="checkbox"><Pre>{cellDatum}</Pre></form.Field>
            )
          })}
        </div>
      )
    }
  }
)

const Gridiron = pure (
  { displayName: 'Gridiron'
  , state: { forms: Immutable.Map() }
  , render() {
      const { container } = this.props

      return (
        <div>

          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={5}
              map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cellData: (rowID, rowDatum) => Immutable.Map({ accordion: Immutable.Map({ header: rowID, content: rowDatum }) })
                    }
                  }

              theme={carbon}>
              {pager => (
                <Box>



                  <Accordion
                      styles={styles}
                      theme={carbon}
                      cols={pager.cols}


                      data={pager.status.get('data', Immutable.Map())}


                      mapHeader={({ rowID, rowIndex, datum }) => {
                        return <h3>{datum}</h3>
                      }}
                      mapContent={({ rowID, rowIndex, datum }) => {
                        return (
                          <h4>content: <Pre>{{ rowID, rowIndex, datum }}</Pre></h4>
                        )
                      }}



                      header={
                        [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Accordion</h2>
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
          ))}


          {container(({ Controls, Box, isMaximized, id, actions }) => (
            <Pager
              rowsPerPage={5}
              filterStream={
                createFilterStream([ 'id', 'state' ])
              }

              map={ { rowData: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state)
                    , cellData: (rowID, rowDatum) => Immutable.Map({ id: rowID, state: rowDatum })
                    }
                  }

              /** EARLY PROPS ({ rowData }) -> WILL BYPASS UPDATES IF DEFINED HERE */
              mapEarlyProps={
                ({ rowData }) => {
                  const filterForm = <FilterForm rowData={rowData} />
                  return { filterForm }
                }
              }

              mapProps={({ earlyProps, status, actions }) => {
                //const filterForm = <FilterForm data={status.get('data')} />
                const { filterForm } = earlyProps
                return (
                  { mapColumn:
                      { local: columnID => ({ column: Column(columnID) })
                      , header: ({ local, columnID, columnIndex }) => {
                        console.info('HEADER', local, columnID, columnIndex)
                          const { column } = local
                          return (
                            <column.Header
                              actions={actions}
                              fields={{ checkbox: true
                                      //, radio: [ { yes: 'Yes', no: 'No' }, 'yes' ]
                                      , filter: true
                                      , sort: status.get('sort')
                                      }}
                              paneContent={cloneElement(filterForm, { columnID })}
                            >
                              {columnID}
                            </column.Header>
                          )
                        }
                      , footer: ({ local, columnID, columnIndex }) => {
                          const { column } = local
                          return (
                            <column.Footer />
                          )
                        }
                      }
                  , mapCell:
                      ({ columnLocal, rowLocal, rowIndex, columnIndex, rowID, columnID, datum }) => {
                        console.info('MAPPING CELLS', columnLocal)
                        const { column } = columnLocal
                        return (
                          <column.Cell rowID={rowID}>
                            <Pre>{{ rowIndex, columnIndex, rowID, columnID, datum }}</Pre>
                          </column.Cell>
                        )
                      }
                  }
                )
              }}


              sort={Immutable.fromJS(
                { cols: [ 'id', 'state' ]
                , keys: { id: datum => datum
                        , state: datum => Object.keys(datum).join('_')
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

                      mapColumn={pager.mapColumn}

                      mapRow={(
                        { local: rowID => {}
                        , header: ({ local, rowID, rowIndex, rowDatum }) => {
                            return <h3>{rowID}</h3>
                          }
                        , footer: ({ local, rowID, rowIndex, rowDatum }) => {
                            return <h4>footer: <Pre>{{ rowID, rowIndex }}</Pre></h4>
                          }
                        }
                      )}

                      mapCell={pager.mapCell}

                      mapDrill={parentId => <div>Sub grid for {parentID}</div>} //<ReduxGridDetail ids={parentId} />}
                      header={
                        [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Grid</h2>
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
          ))}
        </div>
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
