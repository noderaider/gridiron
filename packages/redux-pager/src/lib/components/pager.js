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


  /** PRE REDUX (CONFIG) */
  const PagerContext = compose(
    { displayName: 'PagerContext'
    , propTypes: propTypes
    , defaultProps: defaultProps
    , shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
        const { map, mapRows, rowsPerPageOptions, ...childProps } = this.props
        return (
          <PagerFilter
            {...childProps}

            mapStateToData={state => {
              return map.data(state)
            }}
            mapDataToStatus={(data, access) => {
              const sort = access.sort
              const page = access.page
              const rowsPerPage = access.rowsPerPage
              const rows = mapRows(data, { sort, map })

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

              return  { rows: rowSlice
                      , page
                      , pages
                      , startIndex
                      , lastIndex
                      , rowsPerPage
                      , rowsPerPageOptions
                      , totalRows: rows.size || rows.length
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

  const PagerFilter = connect(state => ({ state }))(compose(
    { displayName: 'PagerFilter'
    , propTypes:  { state: PropTypes.object.isRequired
                  , filterStream: PropTypes.func.isRequired
                  , mapStateToData: PropTypes.func.isRequired
                  , mapDataToStatus: PropTypes.func.isRequired
                  , mapStatusToActions: PropTypes.func.isRequired
                  , mapCols: PropTypes.func.isRequired
                  }
    , state:  { data: null
              , status: Immutable.Map()
              , rows: []
              }
    , init() {
        const getProps = () => this.props
        const getStatus = status => this.state.status
        const setStatus = status => this.setState({ status })



        this.access = { get page() { return getStatus().get('page', getProps().page) }
                      , set page(value) { setStatus(getStatus().set('page', value)) }
                      , get rowsPerPage() { return getStatus().get('rowsPerPage', getProps().rowsPerPage) }
                      , set rowsPerPage(value) { setStatus(getStatus().set('rowsPerPage', value)) }
                      , get sort() { return getStatus().get('sort', getProps().sort) }
                      , set sort(value) { getStatus().set('sort', value) }
                      , getSortDirection: id => getStatus().getIn([ 'sort', 'direction', id ], null)
                      , merge: value => setStatus(this.state.status.merge(value))
                      }
      }
    , componentWillMount() {
        const { filters, mapStateToData, Filter } = this.props

        const getData = () => mapStateToData(this.props.state)

        this.filterContent = Object.keys(filters).reduce((rendered, id) => {
          return ({ ...rendered, [id]: <Filter id={id} data={getData()} /> })
        }, {})

        this.unsubscribes = Object.keys(filters).map(id => {
          return filters[id](() => getData(), data => this.setState({ data }))
        })

        this.setState({ data: getData() })
      }
    , componentWillUnmount() {
        this.unsubscribes.map(x => x())
      }
    , shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
        const { mapStateToData, mapDataToStatus, mapStatusToActions, mapCols, filterStream, ...childProps } = this.props
        const { data } = this.state
        const status = mapDataToStatus(data, this.access)
        const actions = mapStatusToActions(status, this.access)
        const cols = mapCols({ status, actions, filters: this.filterContent })

        return (
          <Pager
            {...childProps}
            status={status}
            actions={actions}
            cols={cols}
          />
        )
      }
    }
  ))


   const Pager = compose(
    { shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
        const { children, cols, rows, ...childProps } = this.props
        const { status, actions, content, styles, theme } = childProps
        should.exist(status.page, 'page should exist')
        status.page.should.be.a('number', 'page must be a number')


        return children({ status
                        , rows: status.rows
                        , cols
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


  const PagerControls = compose(
    { shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
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

  const PagerSelect = compose(
    { shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
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

  const PagerRowsPerPage = compose(
    { shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
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


  const PagerStatus = compose(
    { shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    , render() {
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
