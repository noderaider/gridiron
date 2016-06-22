import { createPropTypes, createConnect } from '../createGrid'
import createExpander from '../createExpander'
import createExpandableCellRangeRenderer from './internal/createExpandableCellRangeRenderer'
import classNames from 'classnames'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'


export default function createGrid({ getState, React, connect, ReactVirtualized, Immutable, ContentBox }) {
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const {Component, PropTypes, cloneElement} = React
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
        height: 600,
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
      const { state, mapCols, mapRows, maxHeight, styles, expandRowManager } = this.props

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


      should.exist(mapCols)
      should.exist(mapRows)
      mapCols.should.be.a('function')
      mapRows.should.be.a('function')
      const cols = mapCols(state)
      const rows = mapRows(state)
      should.exist(cols)
      should.exist(rows)
      cols.should.be.an('object')
      rows.should.be.instanceof(Array)
      const colKeys = Object.keys(cols)
      const mapRow = ({ index, rows = mapRows(state) } = {}) => rows.size ? rows.get(index)
                                                                          : rows[index]
      const getRowCount = ({ rows = mapRows(state) } = {}) => rows.size || rows.length

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
                    ({ index }) => width / colKeys.length
                  }
                  rowHeight={
                    ({ index }) => index === 0 ? 50 : 19
                  }
                  columnCount={colKeys.length}
                  rowCount={getRowCount({ rows })}

                  cellRangeRenderer={
                    ({ cellCache, cellRenderer, columnSizeAndPositionManager, columnStartIndex, columnStopIndex, horizontalOffsetAdjustment, isScrolling, rowSizeAndPositionManager, rowStartIndex, rowStopIndex, scrollLeft, scrollTop, verticalOffsetAdjustment } = {}) => {
                      const expandedIndices = expandRowManager.getExpandedIndices()
                      const renderedRows = []
                      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                        const renderedCells = []
                        let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

                        let isExpandable = expandRowManager.isExpandable(rowIndex)
                        let isExpanded = expandedIndices.includes(rowIndex)

                        let expanderOffset = 0

                        /** STATIC HEIGHT ELEMENT */
                        if(!isExpandable) {
                          const expanderKey = `${rowIndex}-noexpander`
                          renderedCells.push(<div key={expanderKey} />)
                        } else {
                          const expanderKey = `${rowIndex}-expander`
                          expanderOffset = expandRowManager.getExpanderWidth(rowIndex)
                          let expander = (
                            <div
                              key={expanderKey}
                              style={ { height: rowDatum.size
                                      , left: horizontalOffsetAdjustment
                                      , width: expanderOffset
                                      } }
                              className={expandRowManager.getExpanderClassName(rowIndex)}
                            >
                              <Expander expanded={isExpanded} handleExpand={() => expandRowManager.onToggleExpand(rowIndex)}/>
                            </div>
                          )
                          renderedCells.push(expander)
                        }

                        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                          let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)

                          let key = `${rowIndex}-${columnIndex}`
                          let renderedCell

                          // Avoid re-creating cells while scrolling.
                          // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
                          // If a scroll is in progress- cache and reuse cells.
                          // This cache will be thrown away once scrolling completes.
                          if (isScrolling) {
                            if (!cellCache[key]) {
                              cellCache[key] = cellRenderer({ columnIndex
                                                            , isScrolling
                                                            , rowIndex
                                                            })
                            }
                            renderedCell = cellCache[key]
                          // If the user is no longer scrolling, don't cache cells.
                          // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
                          } else {
                            renderedCell = cellRenderer({ columnIndex
                                                        , isScrolling
                                                        , rowIndex
                                                        })
                          }

                          if (renderedCell == null || renderedCell === false)
                            continue


                          /** STATIC HEIGHT ELEMENT */
                          let child = (
                            <div
                              key={key}
                              className='Grid__cell'
                              style={ { height: rowDatum.size
                                      , left: isExpandable && columnIndex === 0 ? columnDatum.offset + horizontalOffsetAdjustment + expanderOffset : columnDatum.offset + horizontalOffsetAdjustment
                                      , width: isExpandable && columnIndex === 0 ? columnDatum.size - expanderOffset : columnDatum.size
                                      } }
                            >
                              {renderedCell}
                            </div>
                          )

                          renderedCells.push(child)
                        }


                        const rowStyle =  { height: rowDatum.size
                                          //, clear: 'both'
                                          }

                        renderedRows.push(<div key={`${rowIndex}-row`} id={`${rowIndex}-row`} className={expandRowManager.rowStyle} style={rowStyle}>{renderedCells}</div>)

                        if(isExpanded) {
                          let key=`${rowIndex}-expanded`
                          let expanded = cloneElement(expandRowManager.getContent(rowIndex, state), { key, id:key, className: 'drill' })
                          renderedRows.push(expanded)
                        }
                      }
                      return renderedRows
                    }
                  }

                  cellRenderer={
                    ({ columnIndex, rowIndex, isScrolling }) => {
                      if(rowIndex === 0) {
                        return <div className={styles.headerCell}>{cols[colKeys[columnIndex]]}</div>
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
  return createConnect({ connect, getState })(ReduxGrid)
}
