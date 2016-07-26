import reactStamp from 'react-stamp'
import classNames from 'classnames'
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

export default function pager (deps = {}, defaults = {}) {
  const { React, connect, shallowCompare, Immutable } = solvent({ React: 'object', connect: 'function', shallowCompare: 'function', Immutable: 'object' })(deps)
  const { Component, PropTypes } = React
  const { compose } = reactStamp(React)

  function composePure(...desc) {
    return compose(
      { shouldComponentUpdate(nextProps, nextState) {
          return shallowCompare(this, nextProps, nextState)
        }
      }
      , ...desc
    )
  }


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
                    , sort: PropTypes.object.isRequired
                    , createSortKeys: PropTypes.func.isRequired
                    , createSortKeyComparator: PropTypes.func.isRequired
                    , page: PropTypes.number.isRequired
                    , rowsPerPage: PropTypes.any.isRequired
                    , rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired
                    , mapRows: PropTypes.func.isRequired
                    , typeSingular: PropTypes.string.isRequired
                    , typePlural: PropTypes.string.isRequired
                    , content: PropTypes.shape(contentShape).isRequired
                    }

  const defaultProps =  { styles: { controls: 'pagerControls'
                                  , controlsChildren: 'pagerControlsChildren'
                                  , control: 'pagerControl'
                                  , select: 'pagerSelect'
                                  }
                        , theme:  { select: 'pagerSelect' }
                        /** TODO: MAKE THIS DEFAULT AN ARRAY (COLUMN SORTS) */
                        , sort: Immutable.Map({ cols: Immutable.List([ 'id', 'key' ])
                                              , keys: Immutable.Map({ id: data => data })
                                              , direction: Immutable.Map({ id: 'asc', key: 'desc' })
                                              })
                          /** CREATES SORT KEYS FOR A ROW */
                        , createSortKeys: (cellData, sort) => {
                            return sort.get('cols')
                              .filter(colID => typeof sort.getIn([ 'direction', colID ]) === 'string')
                              .map(colID => {
                                const sortKey = sort.getIn([ 'keys', colID ], null)
                                const cellDatum = cellData[colID]
                                const currentKey = sortKey ? sortKey(cellDatum) : cellDatum
                                return typeof currentKey === 'string' ? currentKey : currentKey.toString()
                              })
                          }
                          /** COMPARES SORT KEYS OF TWO ROWS */
                        , createSortKeyComparator: sort => {
                            const multipliers = sort.get('direction') ? sort.get('cols').map(colID => sort.getIn([ 'direction', colID ]) === 'desc' ? -1 : 1) : []
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
                                    , PageStatus: ({ status, ...props }) => <span>Page {(status.page + 1).toLocaleString()} of {status.pages}</span>
                                    , RowStatus: ({ status, ...props }) => <span>Showing {props.typePlural} {(status.startIndex + 1).toLocaleString()} through {status.lastIndex.toLocaleString()} ({status.totalRows.toLocaleString()} total)</span>
                                    , RowCount: ({ status, ...props }) => <span>{status.totalRows.toLocaleString()} {status.totalRows === 1 ? props.typeSingular : props.typePlural}</span>
                                    , selectOption: ({ index, ...props }) => (index + 1).toLocaleString()
                                    , rowsPerPageOption: ({ index, ...props }) => typeof index === 'number' ? index.toLocaleString() : index
                                    }
                        , ...defaults
                        }


  /** PRE REDUX (CONFIG) */
  const PagerContext = composePure(
    { displayName: 'PagerContext'
    , propTypes: propTypes
    , defaultProps: defaultProps
    , render() {
        const { map
              , mapRows
              , rowsPerPageOptions
              , createSortKeys
              , createSortKeyComparator
              , ...childProps
              } = this.props
        return (
          <PagerDataFilter
            {...childProps}

            mapStateToData={state => {
              const data = map.data(state)
              if(!Immutable.Map.isMap(data)) {
                console.warn('redux-pager: map.data() should return an Immutable Map for best performance (converting...).')
                return Immutable.Map(data)
              }
              return data
            }}
            filterData={(data, filterState) => {
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
            }}
            mapDataToRows={(data, access) => {
              throw new Error('OBSOLETE')
              const sort = access.sort
              const page = access.page
              const rowsPerPage = access.rowsPerPage
              const rows = map.rowData(data)
              console.warn('MAPPING ROWS =>', rows)
              if(!Immutable.List.isList(rows)) {
                console.warn('redux-pager: map.rowData() should return an Immutable List for best performance (converting...).')
                return Immutable.List(rows)
              }
              return rows
              //return mapRows(data, { sort, map })
            }}
            filterRows={(rows, filterState, access) => {
              throw new Error('OBSOLETE')
              return rows
            }}
            mapCellContext={(data, access) => {
              const cellContext = data.map((rowDatum, rowID) => {
                const cellData = map.cellData(rowID, rowDatum)
                const sortKeys = createSortKeys(cellData, access.sort)
                const cellContext = Immutable.Map({ cellData, sortKeys })
                return cellContext
              })
              return cellContext
            }}
            sortRows={(data, cellContext, access) => {
              const comparator = createSortKeyComparator(access.sort)
              return data.sortBy((rowDatum, rowID) => {
                const sortKeys = cellContext.getIn([ rowID, 'sortKeys' ])
                console.warn('SORT KEYS =>', sortKeys)
                return sortKeys
              }, comparator)
            }}
            mapRowsToStatus={(data, access) => {
              const sort = access.sort
              const page = access.page
              const rowsPerPage = access.rowsPerPage

              if(typeof rowsPerPage !== 'number') {
                return  { rows: data
                        , startIndex: 0
                        , lastIndex: data.size || data.length
                        , page
                        , pages: 1
                        , rowsPerPage
                        , rowsPerPageOptions
                        , totalRows: data.size || data.length
                        , sort
                        }
              }

              const startIndex = page * rowsPerPage
              const endIndex = (page + 1) * rowsPerPage
              const pages = Math.ceil((data.size || data.length) / rowsPerPage)
              const rowSlice = data.slice(startIndex, endIndex)
              const lastIndex = startIndex + (rowSlice.size || rowSlice.length)

              return  { rows: rowSlice
                      , page
                      , pages
                      , startIndex
                      , lastIndex
                      , rowsPerPage
                      , rowsPerPageOptions
                      , totalRows: data.size || data.length
                      , sort
                      }
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
                                  , page: typeof rowsPerPage === 'number' ? Math.floor(status.startIndex / rowsPerPage) : 0
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
                    let direction = sort.get('direction', new Immutable.Map()).set(id, newDirection)
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

  const PagerDataFilter = connect(state => ({ state }))(composePure(
    { displayName: 'PagerDataFilter'
    , propTypes:  { state: PropTypes.object.isRequired
                  , mapStateToData: PropTypes.func.isRequired
                  , filterStream: PropTypes.func.isRequired
                  , filterData: PropTypes.func.isRequired
                  }
    , defaultProps: { filterData: (data, filterState) => data
                    }
    , state:  { data: null
              , status: Immutable.Map()
              , rows: []
              }

    , componentWillMount() {
        const { filters, mapStateToData, filterStream, filterData, Filter } = this.props

        const getData = () => mapStateToData(this.props.state)
        const onFilter = filterState => {
          const data = filterData(getData(), filterState)
          this.setState({ data })
        }

        this.filterContent = Object.keys(filters).reduce((rendered, id) => {
          return ({ ...rendered, [id]: <Filter id={id} data={getData()} /> })
        }, {})

        this.unsubscribe = filterStream(onFilter)
        this.setState({ data: getData() })
      }
    , componentWillUnmount() {
        this.unsubscribe()
      }
    , render() {
        const { data
              , mapStateToData
              , filterData
              , ...childProps
              } = this.props

        console.warn('DATA FILTER RENDER =>', this.state.data)

        return (
          <PagerRowFilter
            {...childProps}
            data={this.state.data}
            filterContent={this.filterContent}
          />
        )
      }
    }
  ))

  const PagerRowFilter = composePure(
    { displayName: 'PagerRowFilter'
    , propTypes:  { data: PropTypes.object.isRequired
                  , filterRows: PropTypes.func.isRequired
                  , sortRows: PropTypes.func.isRequired
                  , mapRowsToStatus: PropTypes.func.isRequired
                  , mapStatusToActions: PropTypes.func.isRequired
                  , mapCols: PropTypes.func.isRequired
                  }
                  /*
    , defaultProps: { filterRows: (rows, filterState, access) => rows
                    , sortRows: (rows, access) => rows
                    }
                    */
    , state:  { status: Immutable.Map()
              , data: null
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
        this.getRows = data => {
          const { mapDataToRows, filterRows, filterState, mapCellContext, sortRows } = this.props
          //const filteredRows = filterRows(mapDataToRows(data, this.access), filterState, this.access)
          //const cellContext = mapCellContext(filteredRows, this.access)
          const cellContext = mapCellContext(data, this.access)
          //const sortedRows = sortRows(filteredRows, cellContext, this.access)
          console.info('CELL CONTEXT MAPPED', cellContext.toJS())
          const sortedRows = sortRows(data, cellContext, this.access)
          console.info('SORTED ROWS => ', sortedRows)
          return sortedRows
        }
      }
    , componentWillMount() {
      this.setState({ data: this.getRows(this.props.data) })
    }
    , componentWillReceiveProps(nextProps) {
      this.setState({ data: this.getRows(nextProps.data) })
    }
    , render() {
        const { rows
              , data
              , mapDataToRows
              , rowFilter
              , mapRowsToStatus
              , mapStatusToActions
              , mapCols
              , ...childProps
              } = this.props

        const status = mapRowsToStatus(this.state.data, this.access)
        const actions = mapStatusToActions(status, this.access)
        const cols = mapCols({ status, actions, filters: this.props.filterContent })

        console.info('PAGER ROWS =>', { rows: this.state.data.toJS(), status })

        return (
          <Pager
            {...childProps}
            status={status}
            actions={actions}
            data={this.state.data}
            cols={cols}
          />
        )
      }
    }
  )


   const Pager = composePure(
    { render() {
        const { children, cols, data, ...childProps } = this.props
        const { status, actions, content, styles, theme } = childProps
        should.exist(status.page, 'page should exist')
        status.page.should.be.a('number', 'page must be a number')


        return children({ status
                        , cols
                        , data
                        , actions
                        , Controls: props => <PagerControls {...props} {...childProps} />
                        , Select: props => <PagerSelect {...props} {...childProps} />
                        , RowsPerPage: props => <PagerRowsPerPage {...props} {...childProps} />
                        , PageStatus: props => <PagerStatus {...props} {...childProps} styleName="pageStatus" Content={content.PageStatus} />
                        , RowStatus: props => <PagerStatus {...props} {...childProps} styleName="rowStatus" Content={content.RowStatus} />
                        , RowCount: props => <PagerStatus {...props} {...childProps} styleName="rowCount" Content={content.RowCount} />
                        })
      }
    }
  )


  const PagerControls = composePure(
    { render() {
        const { children, status, actions, content, styles, theme } = this.props
        return (
          <span className={classNames(styles.controls)}>
            <button onClick={actions.fastBackward} className={classNames(styles.control)} disabled={status.page === 0}>
              <content.FastBackward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.stepBackward} className={classNames(styles.control)} disabled={status.page === 0}>
              <content.StepBackward {...this.props} />
            </button>
            {' '}
            {children ? <span className={classNames(styles.controlsChildren)}>{children}</span> : null}
            {' '}
            <button onClick={actions.stepForward} className={classNames(styles.control)} disabled={status.page === status.pages - 1}>
              <content.StepForward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.fastForward} className={classNames(styles.control)} disabled={status.page === status.pages - 1}>
              <content.FastForward {...this.props} />
            </button>
          </span>
        )
      }
    }
  )

  const PagerSelect = composePure(
    { render() {
        const { status, actions, content, styles, theme } = this.props
        return typeof status.rowsPerPage === 'number' && status.rowsPerPage > 0 ? (
          <select
            value={status.page}
            onChange={x =>  actions.select(parseInt(x.target.value))}
            className={classNames(styles.select, theme.select)}
          >
            {Array.from(Array(status.pages).keys()).map(x => <option key={x} value={x}>{content.selectOption({ ...this.props, index: x })}</option>)}
          </select>
        ) : <span>All</span>
      }
    }
  )

  const PagerRowsPerPage = composePure(
    { render() {
        const { label, status, actions, content, styles, theme } = this.props
        return (
          <span>
            {label ? <label>{label}</label> : null}
            {' '}
            <select
              value={status.rowsPerPage}
              onChange={x => {
                const { value } = x.target
                if(typeof value === 'string' && value.toLowerCase() === 'all')
                  actions.rowsPerPage(value)
                else
                  actions.rowsPerPage(parseInt(value))
              }}
              className={classNames(styles.select, theme.select)}
            >
              {status.rowsPerPageOptions.map(x => <option key={x} value={x}>{content.rowsPerPageOption({ ...this.props, index: x })}</option>)}
            </select>
          </span>
        )
      }
    }
  )


  const PagerStatus = composePure(
    { render() {
        const { styleName, Content, className, status, actions, content, styles, theme } = this.props
        return (
          <span className={classNames(styles[styleName], theme[styleName])}>
            <Content {...this.props} />
          </span>
        )
      }
    }
  )

  return PagerContext

}
