import { Pager as Core } from 'redux-grid-core'
import classNames from 'classnames'
const should = require('chai').should()


export default ({ React, Select }) => {
  const { Component } = React

  return class Pager extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);
    constructor(props) {
      super(props)
      this.state = { page: 0, pages: 1 }
    }
    render() {
      const { children, maxRecords, styles, theme } = this.props
      const { page, pages } = this.state
      return children({ state: this.state
                      , mapRows: state => {
                          //const { page } = this.state
                          const rows = this.props.mapRows(state)
                          const startIndex = page * maxRecords
                          const endIndex = (page + 1) * maxRecords
                          this.pages = Math.ceil(rows.length / maxRecords)
                          const rowSlice = rows.slice(startIndex, endIndex)
                          this.startIndex = startIndex
                          this.lastIndex = startIndex + rowSlice.length
                          return rowSlice
                        }
                      , Buttons: props => (
                          <span>
                            <button onClick={() => this.setState({ page: 0 })} disabled={page === 0}>
                              <i className={'fa fa-fast-backward'} />
                            </button>
                            {' '}
                            <button onClick={() => this.setState({ page: page - 1 })} disabled={page === 0}>
                              <i className={'fa fa-step-backward'} />
                            </button>
                            {props.children ? props.children : ' '}
                            <button onClick={() => this.setState({ page: page + 1 })} disabled={page === this.pages - 1}>
                              <i className={'fa fa-step-forward'} />
                            </button>
                            {' '}
                            <button onClick={() => this.setState({ page: this.pages - 1 })} disabled={page === this.pages - 1}>
                              <i className={'fa fa-fast-forward'} />
                            </button>
                          </span>
                        )
                      , PageSelect: props => {
                          const options = Array.from(Array(this.pages).keys()).map(x => ({ value: x, label: x + 1 }))
                          //[ { value: 1, label: 'One' }
                                          //, { value: 2, label: 'Two' }
                                          //]
                          return <Select className={classNames(styles.select, theme.select)} options={options} onChange={({ value }) => {
                            console.info('select page', value)
                            this.setState({ page: value })
                          }} />
                        }
                      , PageStatus: props => (
                          <span>Page {page + 1} of {this.pages}</span>
                        )
                      , RowStatus: props => (
                          <span>Showing rows {this.startIndex + 1} through {this.lastIndex}</span>
                        )
                      })
    }
  }
}
