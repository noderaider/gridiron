import classNames from 'classnames'
import solvent from 'solvent'
const should = require('chai').should()

export default function pager (deps = {}, defaults = {}) {
  const { React, connect } = solvent({ React: 'object', connect: 'function' })(deps)
  const { Component, PropTypes } = React

  const PagerComponents = pagerProps => {
    const { children, status, actions, content, styles, theme } = pagerProps
    should.exist(status.page, 'page should exist')
    status.page.should.be.a('number', 'page must be a number')
    return children({ status
                    , rows: status.rows
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

  return class Pager extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    constructor(props) {
      super(props)
      this.state =  { page: 0
                    , rowsPerPage: props.rowsPerPage
                    }
    }
    render() {
      const { mapRows, rowsPerPageOptions } = this.props
      const { page, rowsPerPage } = this.state

      const mapStatus = state => {
        const rows = mapRows(state)

        if(typeof rowsPerPage !== 'number') {
          return  { rows
                  , startIndex: 0
                  , lastIndex: rows.length
                  , page
                  , pages: 1
                  , rowsPerPage
                  , rowsPerPageOptions
                  , totalRows: rows.size || rows.length
                  }
        }

        const startIndex = page * rowsPerPage
        const endIndex = (page + 1) * rowsPerPage
        const pages = Math.ceil(rows.length / rowsPerPage)
        const rowSlice = rows.slice(startIndex, endIndex)
        const lastIndex = startIndex + rowSlice.length

        return  { rows: rowSlice
                , page
                , pages
                , startIndex
                , lastIndex
                , rowsPerPage
                , rowsPerPageOptions
                , totalRows: rows.size || rows.length
                }
      }

      const mapStateToProps = state => {
        const status = mapStatus(state)


        const actions = { fastBackward: () => this.setState({ page: 0 })
                        , stepBackward: () => this.setState({ page: page - 1 })
                        , stepForward: () => this.setState({ page: page + 1 })
                        , fastForward: () => this.setState({ page: status.pages - 1 })
                        , select: x => this.setState({ page: x })
                        , rowsPerPage: x => this.setState({ rowsPerPage: x, page: typeof x === 'number' ? Math.floor(status.startIndex / x) : 0 })
                        }

        return  { actions
                , status
                }
      }
      const ConnectedPager = connect(mapStateToProps)(PagerComponents)
      return <ConnectedPager {...this.props} />
    }
  }
}
