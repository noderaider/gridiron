import cn from 'classnames'
import solvent from 'solvent'

const should = require('chai').should()

function nextDirection(direction) {
  switch(direction) {
    case 'asc':
      return 'desc'
    case 'desc':
      return null
    default:
      return 'asc'
  }
}

export default function pager (pure) {
  const { React, PropTypes, cloneElement, connect, shallowCompare, Immutable, defaults } = pure

  const contentShape =  { FastBackward: PropTypes.any.isRequired
                        , StepBackward: PropTypes.any.isRequired
                        , StepForward: PropTypes.any.isRequired
                        , FastForward: PropTypes.any.isRequired
                        , PageStatus: PropTypes.any.isRequired
                        , RowStatus: PropTypes.any.isRequired
                        , RowCount: PropTypes.any.isRequired
                        , selectOption: PropTypes.func.isRequired
                        , rowsPerPageOption: PropTypes.func.isRequired
                        }

  const propTypes = { children: PropTypes.func.isRequired
                    , styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , sort: PropTypes.object
                    , createSortKeys: PropTypes.func.isRequired
                    , createSortKeyComparator: PropTypes.func.isRequired
                    , page: PropTypes.number.isRequired
                    , rowsPerPage: PropTypes.any.isRequired
                    , rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired
                    , typeSingular: PropTypes.string.isRequired
                    , typePlural: PropTypes.string.isRequired
                    , content: PropTypes.shape(contentShape).isRequired
                    }

  const defaultProps =  { styles: {}
                        , theme:  {}
                          /** CREATES SORT KEYS FOR A ROW */
                        , createSortKeys: (cellData, access) => {
                            const sort = access.sort
                            return sort.get('cols')
                              .filter(columnID => typeof sort.getIn([ 'direction', columnID ]) === 'string')
                              .map(columnID => {
                                const sortKey = sort.getIn([ 'keys', columnID ], null)
                                const cellDatum = cellData.get(columnID)
                                const currentKey = sortKey ? sortKey(cellDatum) : cellDatum
                                return typeof currentKey === 'string' ? currentKey : currentKey.toString()
                              })
                          }
                          /** COMPARES SORT KEYS OF TWO ROWS */
                        , createSortKeyComparator: access => {
                            const sort = access.sort
                            const multipliers = sort.get('direction') ? sort.get('cols').map(columnID => sort.getIn([ 'direction', columnID ]) === 'desc' ? -1 : 1) : []
                            return (sortKeysA, sortKeysB) => {
                              for(let colIndex = 0; colIndex < sortKeysA.size; colIndex++) {
                                let result = sortKeysA.get(colIndex).localeCompare(sortKeysB.get(colIndex)) * multipliers.get(colIndex)
                                if(result !== 0)
                                  return result
                              }
                              return 0
                            }
                          }
                        , page: 0
                        , rowsPerPage: 5
                        , rowsPerPageOptions: [ 1, 2, 3, 4, 5, 10, 25, 50, 100, 500, 1000, 'All' ]
                        , typeSingular: 'record'
                        , typePlural: 'records'
                        , content:  { FastBackward: ({ status, ...props }) => <i className={'fa fa-fast-backward'} />
                                    , StepBackward: ({ status, ...props }) => <i className={'fa fa-step-backward'} />
                                    , StepForward: ({ status, ...props }) => <i className={'fa fa-step-forward'} />
                                    , FastForward: ({ status, ...props }) => <i className={'fa fa-fast-forward'} />
                                    , PageStatus: ({ status, ...props }) => <span>Page {(status.get('page') + 1).toLocaleString()} of {status.get('pages')}</span>
                                    , RowStatus: ({ status, ...props }) => <span>Showing {props.typePlural} {(status.get('startIndex') + 1).toLocaleString()} through {status.get('lastIndex').toLocaleString()} ({status.get('totalRows').toLocaleString()} total)</span>
                                    , RowCount: ({ status, ...props }) => <span>{status.totalRows.toLocaleString()} {status.get('totalRows') === 1 ? props.typeSingular : props.typePlural}</span>
                                    , selectOption: ({ index, ...props }) => (index + 1).toLocaleString()
                                    , rowsPerPageOption: ({ index, ...props }) => typeof index === 'number' ? index.toLocaleString() : index
                                    }
                        , ...defaults
                        }


  /** PRE REDUX (CONFIG) */
  const PagerContext = pure (
    { displayName: 'PagerContext'
    , propTypes: propTypes
    , defaultProps: defaultProps
    , render() {
        const { map
              , rowsPerPageOptions
              , createSortKeys
              , createSortKeyComparator
              , ...childProps
              } = this.props
        return (
          <PagerDataFilter
            {...childProps}

            mapStateToRowData={state => {
              const rowData = map.rowData(state)
              if(!Immutable.Map.isMap(rowData)) {
                console.warn('redux-pager: map.rowData() should return an Immutable Map for best performance (converting...).')
                return Immutable.Map(rowData)
              }
              return rowData
            }}
            mapColumnData={rowData => {
              return rowData.map((rowDatum, rowID) => {
                return map.cellData(rowID, rowDatum)
              })
            }}
            /** CALLED BY FILTER STREAM */
            filterRowData={this.props.filterStream ? (rowData, filterState) => {
              if(filterState) {
                let anyFiltered = false
                let filtered = rowData.filter((rowDatum, rowID) => {
                  const value = Object.keys(filterState).some(columnID => {
                    return filterState[columnID](rowID) === true
                  })
                  console.info('FILTERING ROW DATA', filterState, rowDatum, rowID, value)

                  if(value)
                    anyFiltered = true
                  return value
                })
                //console.warn('FILTERED =>', filterState, filtered)
                return anyFiltered ? filtered : rowData
              }
              return rowData
            } : null}
            /** MAP CELL AND SORT DATA AND ADD TO DATA CONSTRUCT */

            mapData={(rowData, columnData, access) => {
              const rows = rowData.map((rowDatum, rowID) => {
                const cellData = columnData.get(rowID)
                const sortKeys = this.props.sort ? createSortKeys(cellData, access) : null
                return Immutable.Map({ rowDatum, cellData, sortKeys })
              })
              const columns = rows.first().get('cellData').keySeq()
              return Immutable.Map({ rows, columns })
            }}
            sortData={this.props.sort ? (data, access) => {
              const comparator = createSortKeyComparator(access)
              return data.set('rows', data.get('rows').sortBy((context, rowID) => context.get('sortKeys'), comparator))
            } : null}
            mapDataToStatus={(data, access) => {
              const sort = access.sort
              const page = access.page
              const rowsPerPage = access.rowsPerPage
              const rows = data.get('rows')

              if(typeof rowsPerPage !== 'number') {
                return  Immutable.Map({ data
                                      , startIndex: 0
                                      , lastIndex: rows.size
                                      , page
                                      , pages: 1
                                      , rowsPerPage
                                      , rowsPerPageOptions
                                      , totalRows: rows.size
                                      , sort
                                      })
              }

              const startIndex = page * rowsPerPage
              const endIndex = (page + 1) * rowsPerPage
              const pages = Math.ceil(rows.size / rowsPerPage)
              const rowSlice = rows.slice(startIndex, endIndex)
              const lastIndex = startIndex + (rowSlice.size || rowSlice.length)

              return  Immutable.Map({ data: data.set('rows', rowSlice)
                                    , page
                                    , pages
                                    , startIndex
                                    , lastIndex
                                    , rowsPerPage
                                    , rowsPerPageOptions
                                    , totalRows: rows.size
                                    , sort
                                    })
            }}
            mapStatusToActions={(status, access) => {
              return (
                { fastBackward: () => { access.page = 0 }
                , stepBackward: () => { access.page = access.page - 1 }
                , stepForward: () => { access.page = access.page + 1 }
                , fastForward: () => { access.page = access.page - 1 }
                , select: x => { access.page = x }
                , rowsPerPage: rowsPerPage => {
                    access.merge( { rowsPerPage
                                  , page: typeof rowsPerPage === 'number' ? Math.floor(status.get('startIndex') / status.get('rowsPerPage')) : 0
                                  } )
                  }
                , sort: id => {
                    const sort = access.sort
                    const _cols = sort.get('cols')
                    const index = _cols.indexOf(id)
                    if(index === -1)
                      throw new Error(`id ${id} is not a sortable column.`)
                    let lastDirection = sort.getIn([ 'direction', id ], null)
                    let newDirection = nextDirection(lastDirection)
                    let direction = sort.get('direction', Immutable.Map()).set(id, newDirection)
                    let cols = newDirection ? _cols.delete(index).unshift(id) : _cols.delete(index).push(id)
                    const newSort = sort.merge({ cols, direction })
                    access.merge({ sort: newSort })
                  }
                }
              )
            }}
          />
        )
      }
    }
  )

  const PagerDataFilter = connect(state => ({ state }))(pure (
    { displayName: 'PagerDataFilter'
    , propTypes:  { state: PropTypes.object.isRequired
                  , mapStateToRowData: PropTypes.func.isRequired
                  , mapColumnData: PropTypes.func.isRequired
                  , filterStream: PropTypes.func
                  , filterRowData: PropTypes.func
                  }
    , render() {
        const { mapStateToRowData
              , mapColumnData
              , mapEarlyProps
              , ...childProps
              } = this.props

        const rowData = mapStateToRowData(this.props.state)
        const columnData = mapColumnData(rowData)
        const earlyProps = mapEarlyProps ? mapEarlyProps({ rowData, columnData }) : null


        return (
          <PagerRowFilter
            {...childProps}
            earlyProps={earlyProps}
            rowData={rowData}
            columnData={columnData}
          />
        )
      }
    }
  ))

  const PagerRowFilter = pure (
    { displayName: 'PagerRowFilter'
    , propTypes:  { rowData: PropTypes.object.isRequired
                  , columnData: PropTypes.object.isRequired
                  , mapData: PropTypes.func.isRequired
                  , sortData: PropTypes.func
                  , mapDataToStatus: PropTypes.func.isRequired
                  , mapStatusToActions: PropTypes.func.isRequired
                  }
    , state:  { status: Immutable.Map()
              , filterState: null
              }
    , init() {
        const getProps = () => this.props
        const getStatus = status => this.state.status
        const setStatus = status => this.setState({ status })

        this.access = { get page() { return getStatus().get('page', getProps().page) }
                      , set page(value) { setStatus(getStatus().set('page', value)) }
                      , get rowsPerPage() { return getStatus().get('rowsPerPage', getProps().rowsPerPage) }
                      , get sort() { return getStatus().get('sort', getProps().sort) }
                      , getSortDirection: id => getStatus().getIn([ 'sort', 'direction', id ], null)
                      , merge: value => setStatus(this.state.status.merge(value))
                      }

      }
    , componentWillMount() {
        const { mapStateToRowData, mapColumnData, filterStream, filterRowData, Filter } = this.props
        if(filterStream)
          this.unsubscribe = filterStream(filterState => this.setState({ filterState }))
      }
    , componentWillUnmount() {
        if(this.unsubscribe)
          this.unsubscribe()
      }
    , render() {
        const { rowData
              , columnData
              , filterRowData
              , mapData
              , sortData
              , rowFilter
              , sortRows
              , mapDataToStatus
              , mapStatusToActions
              , mapLateProps
              , earlyProps
              , ...childProps
              } = this.props

        const { filterState } = this.state

        const filteredData = filterRowData && filterState ? filterRowData(rowData, filterState) : rowData

        const rawData = mapData(filteredData, columnData, this.access)
        const data = sortData ? sortData(rawData, this.access) : rawData
        const status = mapDataToStatus(data, this.access)
        const actions = mapStatusToActions(status, this.access)
        const lateProps = mapLateProps ? mapLateProps({ earlyProps, status, actions }) : null

        return (
          <Pager
            {...childProps}
            earlyProps={earlyProps}
            lateProps={lateProps}
            status={status}
            actions={actions}
          />
        )
      }
    }
  )


   const Pager = pure (
    { displayName: 'Pager'
    , defaultProps: defaults
    , render() {
        const { children, data, content, ...childProps } = this.props
        const { status, actions, styles, theme } = childProps

        return children({ ...childProps
                        , Controls: props => <PagerControls {...props} {...childProps} content={content} />
                        , Select: props => <PagerSelect {...props} {...childProps} content={content} />
                        , RowsPerPage: props => <PagerRowsPerPage {...props} {...childProps} content={content} />
                        , PageStatus: props => <PagerStatus {...props} {...childProps} styleName="pagerPageStatus" Content={content.PageStatus} />
                        , RowStatus: props => <PagerStatus {...props} {...childProps} styleName="pagerRowStatus" Content={content.RowStatus} />
                        , RowCount: props => <PagerStatus {...props} {...childProps} styleName="pagerRowCount" Content={content.RowCount} />
                        })
      }
    }
  )


  const PagerControls = pure (
    { displayName: 'PagerControls'
    , defaultProps: defaults
    , render() {
        const { children, status, actions, content, styles, theme } = this.props
        const buttonClass = cn(styles.pagerButton, theme.pagerButton)
        return (
          <span className={cn(styles.pagerControls, theme.pagerControls)}>
            <button onClick={actions.fastBackward} className={buttonClass} disabled={status.get('page') === 0}>
              <content.FastBackward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.stepBackward} className={buttonClass} disabled={status.get('page') === 0}>
              <content.StepBackward {...this.props} />
            </button>
            {' '}
            {children ? <span className={cn(styles.pagerControlsChildren, theme.pagerControlsChildren)}>{children}</span> : null}
            {' '}
            <button onClick={actions.stepForward} className={buttonClass} disabled={status.get('page') === status.get('pages') - 1}>
              <content.StepForward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.fastForward} className={buttonClass} disabled={status.get('page') === status.get('pages') - 1}>
              <content.FastForward {...this.props} />
            </button>
          </span>
        )
      }
    }
  )

  const PagerSelect = pure (
    { displayName: 'PagerSelect'
    , defaultProps: defaults
    , render() {
        const { status, actions, content, styles, theme } = this.props
        return typeof status.get('rowsPerPage') === 'number' && status.get('rowsPerPage') > 0 ? (
          <select
            value={status.get('page')}
            onChange={x =>  actions.select(parseInt(x.target.value))}
            className={cn(styles.pagerSelect, theme.pagerSelect)}
          >
            {Array.from(Array(status.get('pages')).keys()).map(x => <option key={x} value={x}>{content.selectOption({ ...this.props, index: x })}</option>)}
          </select>
        ) : <span>All</span>
      }
    }
  )

  const PagerRowsPerPage = pure (
    { displayName: 'PagerRowsPerPage'
    , defaultProps: defaults
    , render() {
        const { label, status, actions, content, styles, theme } = this.props
        return (
          <span className={cn(styles.pagerRowsPerPage, theme.pagerRowsPerPage)}>
            {label ? <label>{label}</label> : null}
            {' '}
            <select
              value={status.get('rowsPerPage')}
              onChange={x => {
                const { value } = x.target
                if(typeof value === 'string' && value.toLowerCase() === 'all')
                  actions.rowsPerPage(value)
                else
                  actions.rowsPerPage(parseInt(value))
              }}
              className={cn(styles.pagerSelect, theme.pagerSelect)}
            >
              {status.get('rowsPerPageOptions').map(x => <option key={x} value={x}>{content.rowsPerPageOption({ ...this.props, index: x })}</option>)}
            </select>
          </span>
        )
      }
    }
  )

  const PagerStatus = pure (
    { displayName: 'PagerStatus'
    , defaultProps: defaults
    , render() {
        const { styleName, Content, className, status, actions, content, styles, theme } = this.props
        return (
          <span className={cn(styles[styleName], theme[styleName])}>
            <Content {...this.props} />
          </span>
        )
      }
    }
  )
  return PagerContext
}
