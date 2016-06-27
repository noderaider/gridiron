import { CoreGrid as Core } from 'redux-grid-core'
import solvent from 'solvent'
import expander from '../expander'
import createExpandableCellRangeRenderer from './internal/createExpandableCellRangeRenderer'
import classNames from 'classnames'
import util from 'util'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'

const resolver = solvent( { React: 'object'
                          , connect: 'function'
                          , ReactVirtualized: 'object'
                          , Immutable: 'object'
                          } )
export default function coreGrid (deps) {
  const { React, connect, ReactVirtualized, Immutable } = resolver(deps)
  const { getState } = deps
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const { Component, PropTypes, cloneElement } = React
  const { AutoSizer, FlexTable, FlexColumn, SortDirection, SortIndicator, Grid } = ReactVirtualized
  const Expander = expander({ React })

  class CoreGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);

    constructor(props) {
      super(props)
      this.state =  {}
    }
    render() {
      const { state, mapCols, mapRows, maxHeight, style, styles, theme, gridStyle, maxWidth } = this.props

      should.exist(mapCols)
      should.exist(mapRows)
      mapCols.should.be.a('function')
      mapRows.should.be.a('function')
      const cols = mapCols(state)
      const rows = mapRows(state)
      const spannedRows = rows.reduce((spanned, x, i) => {
        if(x.span === true)
          return [ ...spanned, i ]
        return spanned
      }, [])
      should.exist(cols)
      should.exist(rows)
      cols.should.be.instanceof(Array)
      rows.should.be.instanceof(Array)
      const colCount = cols.length
      const getRowCount = ({ rows = mapRows(state) } = {}) => (rows.size || rows.length) + 2 // 2 more than index for header and footer

      const resolveColWidth = (calculated, { minWidth, maxWidth } = {}) => {
        //console.debug('RESOLVE COL WIDTH', calculated, minWidth, maxWidth)
        if(minWidth && calculated < minWidth) {
          console.debug('OVERRIDING CALCULATED WIDTH FOR MIN', calculated, minWidth)
          return minWidth
        }
        if(maxWidth && calculated > maxWidth) {
          console.debug('OVERRIDING CALCULATED WIDTH FOR MAX', calculated, maxWidth)
          return maxWidth
        }
        return calculated
      }

      const gridClass = classNames(styles.BodyGrid, theme.BodyGrid)

      const wrapperClass = classNames(this.props.isSubGrid === true ? styles.subgrid : null)
      return (
        <div className={styles.Grid__wrap} style={{ ...style, display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>
            <AutoSizer style={{ width: '100%', height: '100%' }} onResize={({ height, width }) => {
              console.info('RESIZED', height, width)
              this.setState({ height, width })
            }}>

              {dimensions => {
                const width = this.state.width || dimensions.width
                console.info('AUTODIMENSIONS =>', dimensions)
                const height = this.state.height || dimensions.height || 100
                const fixedCols = cols.filter(x => x.width && typeof x.width === 'number')

                const fixedWidth = fixedCols.reduce((sum, x) => sum += x.width, 0)
                const variableWidth = width - fixedWidth
                const variableColCount = cols.length - fixedCols.length
                const colWidths = cols.reduce((widthMap, x) => ({ ...widthMap, [x.id]: resolveColWidth(x.width ? x.width : variableWidth / variableColCount, x) }), {})
                const rowCount = getRowCount({ rows })
                return (
                  <Grid
                    ref={x => this.grid = x}
                    className={gridClass}
                    style={gridStyle}
                    width={this.props.maxWidth || this.state.width || dimensions.width}
                    height={this.state.height || dimensions.height || 100}
                    columnCount={colCount}
                    rowCount={rowCount}
                    columnWidth={

                      ({ index }) => {
                        const col = cols[index]
                        return colWidths[col.id]
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
                        const width = this.state.width || dimensions.width

                        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                          const renderedCells = []
                          let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

                          if(spannedRows.includes(rowIndex - 1)) {
                            const key = `${rowIndex}-span`
                            const child = (
                              <div
                                key={key}
                                className={classNames(styles.Grid__span, 'drill')}
                                style={ { width
                                        } }
                              >
                                {rows[rowIndex - 1].render()}
                              </div>
                            )
                            renderedCells.push(child)
                          } else {
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

                              if (renderedCell === null || renderedCell === false)
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
                          }
                          const rowStyle =  { //height: rowDatum.size
                                            }
                          renderedRows.push(<div key={`${rowIndex}-row`} id={`${rowIndex}-row`} className={styles.rowStyle} style={rowStyle}>{renderedCells}</div>)
                        }
                        return renderedRows
                      }
                    }

                    cellRenderer={
                      ({ columnIndex, rowIndex, isScrolling }) => {
                        const col = cols[columnIndex]
                        if(rowIndex === 0) {
                          const headerClass = classNames(styles.headerCell, col.className)
                          return <div className={headerClass}>{col.header({ rows })}</div>
                        } else if(rowIndex === rowCount - 1) {
                          const footerClass = classNames(styles.footerCell, col.className)
                          return <div className={footerClass}>{col.footer ? col.footer({ rows }) : null}</div>
                        } else {
                          const cellClass = classNames(styles.cell, col.className, rowIndex % 2 === 0 ? theme.evenRow : theme.oddRow)
                          return <div className={cellClass}>{rows[rowIndex - 1].render()[columnIndex]}</div>
                        }
                      }
                    }
                  />
                )
              }}
            </AutoSizer>
          </div>
        </div>
      )
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevState.width !== this.state.width || prevState.height !== this.state.height)
        this.grid.recomputeGridSize()
    }
  }
  return Core.Connect({ connect, getState })(CoreGrid)
}
