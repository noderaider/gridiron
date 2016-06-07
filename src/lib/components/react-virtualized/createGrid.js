import { createPropTypes, createConnect } from '../createGrid'
import createExpander from '../createExpander'
import createExpandableCellRangeRenderer from './internal/createExpandableCellRangeRenderer'
import classNames from 'classnames'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'


export default function createGrid({ React, connect, ReactVirtualized, Immutable, ContentBox }) {
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const {Component, PropTypes} = React
  const {AutoSizer, FlexTable, FlexColumn, SortDirection, SortIndicator, Grid} = ReactVirtualized
  const Expander = createExpander({ React })




  class ReduxGrid extends Component {
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
      const { state, selectColumns, selectRows, maxHeight, styles, expandedRowManager } = this.props
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

      const cellRangeRenderer = createExpandableCellRangeRenderer({ React, Expander, expandedRowManager, state })

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

      const selectRow = ({ index, rows = selectRows(state) } = {}) => {
        return rows.size ? rows.get(index) : rows[index]
      }

      const selectRowCount = ({ rows = selectRows(state) } = {}) => {
        return rows.size || rows.length
      }

      const rowGetter = ({ index }) => {
        const row = selectRow({ index, rows })
        if(Array.isArray(row))
          return row.reduce((item, value, i) => ({ ...item, [columnKeys[i]]: value }), {})
        console.warn('ARRAY IS NOT ROW, EXPANDED')
        return row

      }
      const rowCount = selectRowCount({ rows })
      const controlsWidth = 25

      return (
        <ContentBox>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => (
                <Grid
                  className={styles.BodyGrid}
                  width={width}
                  height={height}
                  columnWidth={
                    ({ index }) => {
                      return width / columnKeys.length
                      /*
                      if(index === 0)
                        return controlsWidth
                      return (width - controlsWidth) / (columnKeys.length - 1)
                      */
                    }
                  }
                  rowHeight={({ index }) => index === 0 ? 50 : 25}
                  columnCount={columnKeys.length}
                  rowCount={rowCount}
                  cellRangeRenderer={cellRangeRenderer}
                  cellRenderer={
                    ({ columnIndex, rowIndex, isScrolling }) => {
                      if(rowIndex === 0) {
                        return <div className={styles.headerCell}>{columns[columnKeys[columnIndex]]}</div>
                      }
                      return <div className={rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow}>{rows[rowIndex][columnIndex]}</div>
                    }
                  }
                />
              )}
            </AutoSizer>
          </div>
        </ContentBox>
      )
    }
  }
  return createConnect({ connect })(ReduxGrid)
}
