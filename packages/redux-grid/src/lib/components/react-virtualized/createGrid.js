import { createPropTypes, createConnect } from '../createGrid'
import createExpander from '../createExpander'
import createExpandableCellRangeRenderer from './internal/createExpandableCellRangeRenderer'
import classNames from 'classnames'
import util from 'util'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'


export default function createGrid({ getState, React, connect, ReactVirtualized, Immutable, ContentBox }) {
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const { Component, PropTypes, cloneElement } = React
  const { AutoSizer, FlexTable, FlexColumn, SortDirection, SortIndicator, Grid } = ReactVirtualized
  const Expander = createExpander({ React })

  class ReduxGrid extends Component {
    static propTypes = createPropTypes(React);
    static defaultProps = { maxHeight: 800
                          , styles: {}
                          }
    constructor(props) {
      super(props)
      this.state =  { disableHeader: false
                    , headerHeight: 30
                    //, height: 600
                    , hideIndexRow: false
                    , overscanRowCount: 10
                    , rowHeight: 40
                    , rowCount: 1000
                    , scrollToIndex: undefined
                    , sortBy: 'index'
                    , sortDirection: SortDirection.ASC
                    , useDynamicRowHeight: false
                    }
    }
    render() {
      const { state, mapCols, mapRows, maxHeight, styles } = this.props

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
      const colCount = colKeys.length
      const mapRow = ({ index, rows = mapRows(state) } = {}) => rows.size ? rows.get(index)
                                                                          : rows[index]
      const getRowCount = ({ rows = mapRows(state) } = {}) => rows.size || rows.length

      const rowPadding = 2
      const cellPadding = 4

      return (
        <ContentBox>
          <div style={{ display: 'flex', height: 800 }}>
            <div style={{ flex: '1 1 auto' }}>
              <AutoSizer detectedWidth={this.state.width} onResize={({ height, width }) => {
                console.info('RESIZED', height, width)
                this.setState({ height, width })
              }}>

                {dimensions => {
                  console.warn('INSIDE DIM', this.state.height, this.state.width)


                  return (
                    <Grid
                      ref={x => this.grid = x}
                      className={styles.BodyGrid}
                      width={this.state.width || dimensions.width}
                      height={this.state.height || dimensions.height}
                      columnCount={colCount}
                      rowCount={getRowCount({ rows })}
                      columnWidth={

                        ({ index }) => {
                          const width = this.state.width || dimensions.width
                          const height = this.state.height || dimensions.height
                          //const colWidths = getColWidths()
                          const fixedColKeys = colKeys.filter(x => {
                            const col = cols[x]
                            return col.width && typeof col.width === 'number'
                          })

                          const fixedWidth = fixedColKeys.reduce((sum, key) => sum += cols[key].width, 0)
                          const variableWidth = width - fixedWidth
                          const variableColCount = colKeys.length - fixedColKeys.length
                          console.debug(util.inspect({ fixedColKeys, width, height }))
                          const colWidths = colKeys.reduce((widthMap, key) => ({ ...widthMap, [key]: fixedColKeys.includes(key) ? cols[key].width : variableWidth / variableColCount }), {})


                          const colKey = colKeys[index]
                          const selectedCol = cols[colKey]

                          console.info({ index, width: colWidths[colKey], colKey, selectedCol })
                          return colWidths[colKey]

                          let colWidth = colWidths[index]
                          /** IF VARIABLE WIDTH */
                          if(!colWidth)
                            colWidth = variableWidth / variableColCount
                          return colWidth
                        }
                      }
                      rowHeight={
                        ({ index }) => {
                          return index === 0 ? 50 : 25
                        }
                      }

                      cellRangeRenderer={
                        ({ cellCache, cellRenderer, columnSizeAndPositionManager, columnStartIndex, columnStopIndex, horizontalOffsetAdjustment, isScrolling, rowSizeAndPositionManager, rowStartIndex, rowStopIndex, scrollLeft, scrollTop, verticalOffsetAdjustment } = {}) => {
                          const renderedRows = []
                          for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                            const renderedCells = []
                            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

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
                                          //, left: columnDatum.offset + horizontalOffsetAdjustment
                                          , width: columnDatum.size
                                          } }
                                >
                                  {renderedCell}
                                </div>
                              )
                              renderedCells.push(child)
                            }
                            const rowStyle =  { height: rowDatum.size
                                              }
                            renderedRows.push(<div key={`${rowIndex}-row`} id={`${rowIndex}-row`} className={styles.rowStyle} style={rowStyle}>{renderedCells}</div>)
                          }
                          return renderedRows
                        }
                      }


                      cellRenderer={
                        ({ columnIndex, rowIndex, isScrolling }) => {
                          if(rowIndex === 0) {
                            const currentCol = colKeys[columnIndex]
                            const selectedCol = cols[currentCol]
                            return <div className={styles.headerCell}>{selectedCol.render || selectedCol}</div>
                          }
                          const className = classNames(styles.cell, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow)
                          return <div className={className}>{rows[rowIndex][columnIndex]}</div>
                        }
                      }
                    />
                  )
                }}
              </AutoSizer>
            </div>
          </div>
        </ContentBox>
      )
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevState.width !== this.state.width || prevState.height !== this.state.height)
        this.grid.recomputeGridSize()
    }
  }
  return createConnect({ connect, getState })(ReduxGrid)
}
