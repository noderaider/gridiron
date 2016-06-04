import { createPropTypes, createConnect } from '../createGrid'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'

export default function createGrid({ React, connect, ReactVirtualized, Immutable, ContentBox }) {
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
    }
    render() {
      const { state, selectColumns, selectRows, maxHeight, styles } = this.props
      //const { list } = state

      const { disableHeader
            , headerHeight
            , height
            , hideIndexRow
            , overscanRowCount
            , rowHeight
            //, rowCount
            , scrollToIndex
            , sortBy
            , sortDirection
            , useDynamicRowHeight
            } = this.state

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


      const array = rows.map(row => row.reduce((item, value, i) => ({ ...item, [columnKeys[i]]: value })))
      const rowCount = array.length

/*
      for (var i = 0; i < 100; i++) {
        array.push({
          index: i,
          name: `Name ${i}`,
          random: `user-${i}@treasure-data.com`
        })
      }

*/
/*
      const list = Immutable.fromJS(array)

      const sortedList = this._isSortEnabled()
        ? list
          .sortBy(item => item[sortBy])
          .update(list =>
            sortDirection === SortDirection.DESC
              ? list.reverse()
              : list
          )
        : list
        */


      const rowGetter = ({ index }) => {
        if(index < array.length)
          return array[index]
        return columnKeys.reduce((row, key) => ({ ...row, [key]: 'empty' }))
        //return { index } //, name: 'no name', random: 'no random'}
        //this._getDatum(array, index)
      }

      return (
         <ContentBox>
         <div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <FlexTable
                ref='Table'
                headerHeight={headerHeight}
                height={height}
                noRowsRenderer={this._noRowsRenderer}
                overscanRowCount={overscanRowCount}
                rowClassName={this._rowClassName}
                rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
                rowGetter={rowGetter}
                rowCount={rowCount}
                scrollToIndex={scrollToIndex}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                width={width}
              >
                {/*!hideIndexRow &&*/}
                {/*
                  <FlexColumn
                    label='Index'
                    cellDataGetter={
                      ({ columnData, dataKey, rowData }) => rowData ? rowData.index : -1
                    }
                    dataKey='index'
                    disableSort={!this._isSortEnabled()}
                    width={60}
                  />
                <FlexColumn
                  dataKey='name'
                  disableSort={!this._isSortEnabled()}
                  headerRenderer={this._headerRenderer}
                  width={210}
                />
              */}
              {columnKeys.map((key, i) => {
                return (
                  <FlexColumn
                    key={i}
                    width={50}
                    disableSort
                    headerRenderer={() => columns[key]}
                    dataKey={key}
                    className={styles.headerColumn}
                    cellRenderer={
                      ({ cellData, columnData, dataKey, rowData, rowIndex }) => cellData
                      //(...args) => <pre><code>{JSON.stringify(args)}</code></pre>
                    }
                  />
                )
              })}

              </FlexTable>
            )}
          </AutoSizer>
          </div>
          </ContentBox>
      )
    }

    _getDatum = (list, index) => {
      //return list.get(index % list.size)
      console.warn('selecting index', index)
      if(index < list.length)
        return list[index]
      return {id: 'some', something: 'randomnesss'}
    };

    _getRowHeight = ({ index }) => {
      const { list } = this.props
      //return 20
      //return this._getDatum(list, index).size
    };

    _headerRenderer = (...args) => <pre><code>{JSON.stringify(args)}</code></pre>;

/*
    _headerRenderer = ({
      columnData,
      dataKey,
      disableSort,
      label,
      sortBy,
      sortDirection
    }) => {
      return (
        <div>
          Full Name
          {sortBy === dataKey &&
            <SortIndicator sortDirection={sortDirection} />
          }
        </div>
      )
    };
*/
    _isSortEnabled = () => {
      /*
      const { state, selectColumns, selectRows, maxHeight } = this.props
      const rows = selectRows(state)
      const { rowCount } = this.state

      return rowCount <= rows.length
      */
      return false
    };

    _noRowsRenderer = () => {
      const { styles } = this.props
      return (
        <div className={styles.noRows}>
          No rows
        </div>
      )
    };

    _onRowCountChange = event => {
      const rowCount = parseInt(event.target.value, 10) || 0

      this.setState({ rowCount })
    };

    _onScrollToRowChange = event => {
      const { rowCount } = this.state
      let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))
      if (isNaN(scrollToIndex))
        scrollToIndex = undefined
      this.setState({ scrollToIndex })
    };

    _rowClassName = ({ index }) => {
      const { styles } = this.props
      if (index < 0) {
        return styles.headerRow
      } else {
        return index % 2 === 0 ? styles.evenRow : styles.oddRow
      }
    };

    _sort = ({ sortBy, sortDirection }) => {
      this.setState({ sortBy, sortDirection })
    };

    _updateUseDynamicRowHeight = value => {
      this.setState({
        useDynamicRowHeight: value
      })
    };
  }
  return createConnect({ connect })(Grid)
}
