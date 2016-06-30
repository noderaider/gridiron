import classNames from 'classnames'
import solvent from 'solvent'

export default function pager (deps = {}, defaults = {}) {
  const { React, connect } = solvent({ React: 'object', connect: 'function' }, defaults = {})(deps)
  const { Component, PropTypes } = React

  const PagerComponents = props => {
    const { children, state, rows, page, pages, maxRecords, startIndex, lastIndex, styles, theme, pageFirst, pageBack, pageForward, pageLast, selectPage } = props
    return children({ state
                    , rows
                    , Buttons: props => (
                        <span>
                          <button onClick={pageFirst} disabled={page === 0}>
                            <i className={'fa fa-fast-backward'} />
                          </button>
                          {' '}
                          <button onClick={pageBack} disabled={page === 0}>
                            <i className={'fa fa-step-backward'} />
                          </button>
                          {' '}
                          {props.children ? props.children : null}
                          {' '}
                          <button onClick={pageForward} disabled={page === pages - 1}>
                            <i className={'fa fa-step-forward'} />
                          </button>
                          {' '}
                          <button onClick={pageLast} disabled={page === pages - 1}>
                            <i className={'fa fa-fast-forward'} />
                          </button>
                        </span>
                      )
                    , PageSelect: props => {
                        const options = Array.from(Array(this.pages).keys()).map(x => ({ value: x, label: x + 1 }))
                        return (
                          <span>
                            <label>
                              Page:
                            </label>
                            <select value={page + 1} onChange={x =>  selectPage(x.target.value - 1)}>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                            </select>
                          </span>
                        )
                      }
                    , PageStatus: props => (
                        <span>Page {page + 1} of {pages}</span>
                      )
                    , RowStatus: props => (
                        <span>Showing rows {startIndex + 1} through {lastIndex}</span>
                      )
                    })
  }

  return class Pager extends Component {
    static propTypes =  { children: PropTypes.func.isRequired
                        , styles: PropTypes.object.isRequired
                        , maxRecords: PropTypes.number.isRequired
                        , mapRows: PropTypes.func.isRequired
                        };
    static defaultProps = { styles: { pagerControls: 'pagerControls'
                                    }
                          , maxRecords: 5
                          , ...defaults
                          };
    constructor(props) {
      super(props)
      this.state =  { page: 0
                    , pages: 1
                    }
    }
    render() {
      const { maxRecords, mapRows } = this.props
      const { page } = this.state

      const mapStateToProps = state => {
        const rows = mapRows(state)
        const startIndex = page * maxRecords
        const endIndex = (page + 1) * maxRecords
        const pages = Math.ceil(rows.length / maxRecords)
        const rowSlice = rows.slice(startIndex, endIndex)
        const lastIndex = startIndex + rowSlice.length

        console.warn('DATA', page, maxRecords, rowSlice, rows)

        const pageFirst = () => this.setState({ page: 0 })
        const pageBack = () => this.setState({ page: page - 1 })
        const pageForward = () => this.setState({ page: page + 1 })
        const pageLast = () => this.setState({ page: pages - 1 })
        const selectPage = x => this.setState({ page: x })

        return  { state: this.state
                , rows: rowSlice
                , page
                , pages
                , startIndex
                , lastIndex
                , pageFirst
                , pageBack
                , pageForward
                , pageLast
                , selectPage
                }
      }
      const mapDispatchToProps = dispatch => {
        return {}
      }
      const ConnectedPager = connect(mapStateToProps, mapDispatchToProps)(PagerComponents)
      return <ConnectedPager {...this.props} />
    }
  }
}
