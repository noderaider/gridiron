import { CoreGrid as Core } from 'gridiron-core'
import reactStamp from 'react-stamp'
import solvent from 'solvent'
import expander from './expander'
import classNames from 'classnames'
import util from 'util'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'

const resolver = solvent( { React: 'object'
                          , connect: 'function'
                          , AutoSizer: 'function'
                          , Grid: 'function'
                          , Immutable: 'object'
                          } )
export default function coreGrid (deps, defaults = {}) {
  const { React, connect, AutoSizer, Grid, Immutable } = resolver(deps)
  const { compose } = reactStamp(React)
  const { getState } = defaults
  should.exist(React)
  should.exist(connect)
  const Expander = expander({ React })

  const wideStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flex: '1 0 auto'
                    , justifyContent: 'space-between'
                    , alignItems: 'center'
                    , margin: 'auto'
                    , padding: 5
                    }

  const CoreGrid = compose(
    { propTypes: Core.PropTypes(React)
    , defaultProps: Core.DefaultProps(React)
    , state: {}
    , render() {
        const { cols, rows, maxHeight, style, styles, theme, gridStyle, maxWidth, header, footer, pager } = this.props
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
        const getRowCount = ({ rows = rows /*= mapRows(state)*/ } = {}) => (rows.size || rows.length) // 2 more than index for header and footer

        const resolveColWidth = (calculated, { minWidth, maxWidth } = {}) => {
          //console.debug('RESOLVE COL WIDTH', calculated, minWidth, maxWidth)
          if(minWidth && calculated < minWidth) {
            //console.debug('OVERRIDING CALCULATED WIDTH FOR MIN', calculated, minWidth)
            return minWidth
          }
          if(maxWidth && calculated > maxWidth) {
            //console.debug('OVERRIDING CALCULATED WIDTH FOR MAX', calculated, maxWidth)
            return maxWidth
          }
          return calculated
        }


        const containerClass = classNames(styles.container, theme.container)
        const innerContainerClass = classNames(styles.innerContainer, theme.innerContainer)
        const gridClass = classNames(styles.BodyGrid, theme.BodyGrid)

        const renderGrid = ({ preHeader, postHeader } = {}) => (
          <div className={containerClass} style={style}>
            <div className={innerContainerClass}>
              <AutoSizer onResize={({ height, width }) => {
                this.setState({ height, width })
              }}>

                {dimensions => {
                  const width = this.state.width || dimensions.width
                  const height = this.state.height || dimensions.height || 100
                  let fixedWidthIndices = []
                  const fixedCols = cols.filter((x, i) => {
                    const isFixed = x.width && typeof x.width === 'number'
                    if(isFixed) fixedWidthIndices.push(i)
                    return isFixed
                  })

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
                      rowHeight={1}

                      cellRangeRenderer={
                        ({ cellCache, cellRenderer, columnSizeAndPositionManager, columnStartIndex, columnStopIndex, horizontalOffsetAdjustment, isScrolling, rowSizeAndPositionManager, rowStartIndex, rowStopIndex, scrollLeft, scrollTop, verticalOffsetAdjustment } = {}) => {
                          const renderedRows = []
                          const width = this.state.width || dimensions.width

                          /** GRID ROW HEADER */
                          if(header)
                            renderedRows.push(
                              <div key="grid-header" className={classNames(styles.headerGrid, theme.headerGrid)}>
                                {preHeader ? preHeader : null}
                                {typeof header === 'function' ? header() : header}
                                {postHeader ? postHeader : null}
                              </div>
                            )

                          const gridRow = (rowKey, cells, { rowClass = 'Grid__row', rowStyle = {}, cellClass = 'Grid__cell', cellStyle = {} }) => {
                            should.exist(rowKey, 'rowKey is required')
                            return (
                              <div key={rowKey} id={`${rowKey}-row`} className={styles.rowStyle} style={rowStyle}>
                                {cells.map((x, i) => {
                                  let computedStyle = typeof cellStyle === 'function' ? cellStyle(i) : cellStyle
                                  if(fixedWidthIndices.includes(i)) {
                                    const datum = columnSizeAndPositionManager.getSizeAndPositionOfCell(i)
                                    computedStyle = { ...computedStyle, flex: `0 1 ${datum.size}px` }
                                  }
                                  return (
                                    <div
                                      key={`${rowKey}-${i}`}
                                      className={typeof cellClass === 'function' ? cellClass(i) : cellClass}
                                      style={computedStyle}
                                    >
                                      <span className={classNames(styles.innerCell, theme.innerCell)}>{x}</span>
                                    </div>
                                )
                                })
                              }
                              </div>
                            )
                          }

                          /** COLUMN HEADERS */
                          renderedRows.push(gridRow('col-headers', cols.map(x => x.header({ rows, theme })), { rowClass: styles.rowStyle, cellClass: i => classNames(styles.headerCell, theme.headerCell, cols[i].className) }))

                          for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                            const renderedCells = []

                            if(spannedRows.includes(rowIndex)) {
                              const key = `${rowIndex}-span`
                              const child = (
                                <div
                                  key={key}
                                  //style={wideStyle}
                                  className={classNames(styles.Grid__span, theme.expanded, 'drill')}
                                >
                                  {rows[rowIndex].render()}
                                </div>
                              )
                              renderedRows.push(child)
                            } else {
                              for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                                let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)

                                let key = `${rowIndex}-${columnIndex}`
                                let renderedCell

                                // Avoid re-creating cells while scrolling.
                                // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
                                // If a scroll is in progress- cache and reuse cells.
                                // This cache will be thrown away once scrolling completes.
                                if (false) { //isScrolling) {
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
                                renderedCells.push(renderedCell)
                              }
                            }
                            const cellClass = i => classNames(styles.cell, theme.cell, cols[i].className, rowIndex % 2 === 0 ? theme.evenRow : theme.oddRow)
                            renderedRows.push(gridRow(rowIndex, renderedCells, { rowClass: styles.rowStyle, cellClass }))
                          }

                          renderedRows.push(gridRow('col-footers', cols.map(x => x.footer ? x.footer({ rows, theme }) : null), { rowClass: styles.rowStyle, cellClass: i => classNames(styles.footerCell, theme.footerCell, cols[i].className) }))

                          if(footer) {
                            renderedRows.push(
                              <div key="grid-footer" style={wideStyle} className={classNames(styles.footerGrid, theme.footerGrid)}>
                                {typeof footer === 'function' ? footer() : footer}
                              </div>)
                          }
                          return renderedRows
                        }
                      }

                      cellRenderer={
                        ({ columnIndex, rowIndex, isScrolling }) => {
                          const col = cols[columnIndex]
                          const row = rows[rowIndex]
                          const datum = row.cellData[col.id]
                          const Cell = row.cells[columnIndex]
                          return <Cell datum={datum} />
                        }
                      }
                    />
                  )
                }}
              </AutoSizer>
            </div>
          </div>
        )
        return renderGrid()
      }
    , componentDidUpdate(prevProps, prevState) {
        if(prevState.width !== this.state.width || prevState.height !== this.state.height) {
          this.grid.recomputeGridSize()
        }
      }
    }
  )
  return CoreGrid
  //return Core.Connect({ connect }, { getState })(CoreGrid)
}
