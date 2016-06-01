import { createPropTypes, createConnect } from '../createGrid'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'

export default function createGrid({ React, connect, ReactVirtualized }) {
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const {Component, PropTypes} = React
  const {AutoSizer, FlexTable, FlexColumn, SortDirection, SortIndicator} = ReactVirtualized

  class Grid extends Component {
    static propTypes = createPropTypes(React);
    static defaultProps = { maxHeight: 800
                          , styles: {}
                          }
    constructor(props) {
      super(props)
      this.state = {
        disableHeader: false,
        headerHeight: 30,
        height: 270,
        hideIndexRow: false,
        overscanRowCount: 10,
        rowHeight: 40,
        rowCount: 1000,
        scrollToIndex: undefined,
        sortBy: 'index',
        sortDirection: SortDirection.ASC,
        useDynamicRowHeight: false
      }

      this._getRowHeight = this._getRowHeight.bind(this)
      this._headerRenderer = this._headerRenderer.bind(this)
      this._noRowsRenderer = this._noRowsRenderer.bind(this)
      this._onRowCountChange = this._onRowCountChange.bind(this)
      this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
      this._sort = this._sort.bind(this)
    }
    render() {
      const { state, selectColumns, selectRows, maxHeight } = this.props

      const { disableHeader
            , headerHeight
            , height
            , hideIndexRow
            , overscanRowCount
            , rowHeight
            , rowCount
            , scrollToIndex
            , sortBy
            , sortDirection
            , useDynamicRowHeight
            } = this.state

      //const { width } = this.state
      should.exist(selectColumns)
      should.exist(selectRows)
      selectColumns.should.be.a('function')
      selectRows.should.be.a('function')
      const columns = selectColumns(state)
      const rows = selectRows(state)
      should.exist(columns)
      should.exist(rows)
      columns.should.be.an('object')
      rows.should.be.instanceof(Array)
      const columnKeys = Object.keys(columns)

      const rowGetter = ({ index }) => this._getDatum(sortedList, index)

      return (
        <div ref={x => this.container=x}>

          <AutoSizer disableHeight>
            {({ width }) => (
              <FlexTable
                ref='Table'
                disableHeader={disableHeader}
                headerClassName="grid-header"
                headerHeight={headerHeight}
                height={height}
                noRowsRenderer={this._noRowsRenderer}
                overscanRowCount={overscanRowCount}
                rowClassName={::this._rowClassName}
                rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
                rowGetter={rowGetter}
                rowCount={rowCount}
                scrollToIndex={scrollToIndex}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                width={width}
              >
                {!hideIndexRow &&
                  <FlexColumn
                    label='Index'
                    cellDataGetter={
                      ({ columnData, dataKey, rowData }) => rowData.index
                    }
                    dataKey='index'
                    //disableSort={!this._isSortEnabled()}
                    width={60}
                  />
                }
                <FlexColumn
                  dataKey='name'
                  disableSort={!this._isSortEnabled()}
                  headerRenderer={this._headerRenderer}
                  width={90}
                />
                <FlexColumn
                  width={210}
                  disableSort
                  label='The description label is really long so that it will be truncated'
                  dataKey='random'
                  className="grid-col col-3"
                  cellRenderer={
                    ({ cellData, columnData, dataKey, rowData, rowIndex }) => cellData
                  }
                  flexGrow={1}
                />
              </FlexTable>
            )}
          </AutoSizer>
        </div>
      )
    }

    _getDatum (list, index) {
      return list.get(index % list.size)
    }

    _getRowHeight ({ index }) {
      const { list } = this.props

      return this._getDatum(list, index).size
    }

    _headerRenderer ({
      columnData,
      dataKey,
      disableSort,
      label,
      sortBy,
      sortDirection
    }) {
      return (
        <div>
          Full Name
          {sortBy === dataKey &&
            <SortIndicator sortDirection={sortDirection} />
          }
        </div>
      )
    }

    _isSortEnabled () {
      const { state, selectColumns, selectRows, maxHeight } = this.props
      const rows = selectRows(state)
      const { rowCount } = this.state

      return rowCount <= rows.length
    }

    _noRowsRenderer () {
      return (
        <div className="grid-norow">
          No rows
        </div>
      )
    }

    _onRowCountChange (event) {
      const rowCount = parseInt(event.target.value, 10) || 0

      this.setState({ rowCount })
    }

    _onScrollToRowChange (event) {
      const { rowCount } = this.state
      let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))
      if (isNaN(scrollToIndex))
        scrollToIndex = undefined
      this.setState({ scrollToIndex })
    }

    _rowClassName ({ index }) {
      if (index < 0) {
        return 'grid-header-row'
      } else {
        return index % 2 === 0 ? 'grid-even' : 'grid-odd'
      }
    }

    _sort ({ sortBy, sortDirection }) {
      this.setState({ sortBy, sortDirection })
    }

    _updateUseDynamicRowHeight (value) {
      this.setState({
        useDynamicRowHeight: value
      })
    }
  }
  return createConnect({ connect })(Grid)
}
