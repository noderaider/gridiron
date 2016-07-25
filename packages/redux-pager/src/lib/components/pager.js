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

  const PagerComponents = pagerProps => {
    const { children, status, cols, actions, content, styles, theme } = pagerProps
    should.exist(status.page, 'page should exist')
    status.page.should.be.a('number', 'page must be a number')

    return children({ status
                    , rows: status.rows
                    , cols
                    , actions
                    , Controls: props => (
                        <span className={classNames(styles.controls)}>
                          <button onClick={actions.fastBackward} className={classNames(styles.control)} disabled={status.page === 0}>
                            <content.FastBackward {...pagerProps} {...props} />
                          </button>
                          {' '}
                          <button onClick={actions.stepBackward} className={classNames(styles.control)} disabled={status.page === 0}>
                            <content.StepBackward {...pagerProps} {...props} />
                          </button>
                          {' '}
                          {props.children ? <span className={classNames(styles.controlsChildren)}>{props.children}</span> : null}
                          {' '}
                          <button onClick={actions.stepForward} className={classNames(styles.control)} disabled={status.page === status.pages - 1}>
                            <content.StepForward {...pagerProps} {...props} />
                          </button>
                          {' '}
                          <button onClick={actions.fastForward} className={classNames(styles.control)} disabled={status.page === status.pages - 1}>
                            <content.FastForward {...pagerProps} {...props} />
                          </button>
                        </span>
                      )
                    , Select: props => {
                        return typeof status.rowsPerPage === 'number' && status.rowsPerPage > 0 ? (
                          <select
                            value={status.page}
                            onChange={x =>  actions.select(parseInt(x.target.value))}
                            className={classNames(styles.select, theme.select)}
                          >
                            {Array.from(Array(status.pages).keys()).map(x => <option key={x} value={x}>{content.selectOption({ ...pagerProps, ...props, index: x })}</option>)}
                          </select>
                        ) : <span>All</span>
                      }
                    , RowsPerPage: props => {
                        return (
                          <span>
                            {props.label ? <label>{props.label}</label> : null}
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
                              {status.rowsPerPageOptions.map(x => <option key={x} value={x}>{content.rowsPerPageOption({ ...pagerProps, ...props, index: x })}</option>)}
                            </select>
                          </span>
                        )
                      }
                    , PageStatus: props => <span className={classNames(styles.pageStatus)}><content.PageStatus {...pagerProps} {...props} /></span>
                    , RowStatus: props => <span className={classNames(styles.rowStatus)}><content.RowStatus {...pagerProps} {...props} /></span>
                    , RowCount: props => <span className={classNames(styles.rowCount)}><content.RowCount {...pagerProps} {...props} /></span>
                    })
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
                    , page: PropTypes.number.isRequired
                    , rowsPerPage: PropTypes.any.isRequired
                    , rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired
                    , mapRows: PropTypes.func.isRequired
                    , mapCellData: PropTypes.func.isRequired
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
                        , mapCellData: (rowID, rowData) => rowData
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

  return compose(
    { displayName: 'Pager'
    , propTypes: propTypes
    , defaultProps: defaultProps
    , state: { status: Immutable.Map() }
    , init() {
        const getProps = () => this.props
        const getStatus = status => this.state.status
        const setStatus = status => this.setState({ status })


        const access =  { get page() { return getStatus().get('page', getProps().page) }
                        , set page(value) { setStatus(getStatus().set('page', value)) }
                        , get rowsPerPage() { return getStatus().get('rowsPerPage', getProps().rowsPerPage) }
                        , set rowsPerPage(value) { setStatus(getStatus().set('rowsPerPage', value)) }
                        , get sort() { return getStatus().get('sort', getProps().sort) }
                        , set sort(value) { getStatus().set('sort', value) }
                        , getSortDirection: id => getStatus().getIn([ 'sort', 'direction', id ], null)
                        , merge: value => setStatus(this.state.status.merge(value))
                        }

        const mapStatus = state => {
          const { map, mapRows, rowsPerPageOptions, Filter } = this.props
          const sort = access.sort
          const page = access.page
          const rowsPerPage = access.rowsPerPage
          const data = map.data(state)
          //const filtered = map.rowData(data)
          //const filtered = this.state.filter ? this.state.filter(data) : data
          //console.info('FILTERED DATA', filtered)
          const filtered = this.state.filter ? this.state.filter(data) : data
          const rows = mapRows(filtered, { sort, map })


          if(typeof rowsPerPage !== 'number') {
            return  { rows
                    , startIndex: 0
                    , lastIndex: rows.size || rows.length
                    , page
                    , pages: 1
                    , rowsPerPage
                    , rowsPerPageOptions
                    , totalRows: rows.size || rows.length
                    , sort
                    }
          }

          const startIndex = page * rowsPerPage
          const endIndex = (page + 1) * rowsPerPage
          const pages = Math.ceil((rows.size || rows.length) / rowsPerPage)
          const rowSlice = rows.slice(startIndex, endIndex)
          const lastIndex = startIndex + (rowSlice.size || rowSlice.length)

          const filter = ({ id }) => <Filter id={id} data={data} onChange={x => this.setState({ filter: x })} />

          return  { rows: rowSlice
                  , page
                  , pages
                  , startIndex
                  , lastIndex
                  , rowsPerPage
                  , rowsPerPageOptions
                  , totalRows: rows.size || rows.length
                  , sort
                  , filter
                  }
        }

        this.mapStateToProps = state => {
          const status = mapStatus(state)
          const actions = { fastBackward: () => { access.page = 0 }
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


          const cols = this.props.mapCols({ status, actions })
          return  { actions
                  , status
                  , cols
                  }
        }
      }
    , shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
        const ReduxPager = connect(this.mapStateToProps)(PagerComponents)
        return <ReduxPager {...this.props} />
      }
    }
  )
}
