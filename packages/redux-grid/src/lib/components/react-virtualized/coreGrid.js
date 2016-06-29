import { CoreGrid as Core } from 'redux-grid-core'
import solvent from 'solvent'
import expander from '../expander'
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
  const { Component, PropTypes, cloneElement } = React
  const { getState } = deps
  should.exist(React)
  should.exist(connect)
  should.exist(ReactVirtualized)
  const { AutoSizer, FlexTable, FlexColumn, SortDirection, SortIndicator, Grid } = ReactVirtualized
  const Expander = expander({ React })

  class CoreGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);

    constructor(props) {
      super(props)
      this.state =  {}
    }
    /*
    componentDidMount() {
      this.recomputeID = setInterval(() => {
        console.info('RECALCULATING GRID SIZE')
        this.grid.recomputeGridSize()
      }, 4000)
    }
    componentWillUnmount() {
      clearInterval(this.recomputeID)
    }
    */
    render() {
      const { state, mapCols, mapRows, maxHeight, style, styles, theme, gridStyle, maxWidth, header, footer, isMaximized, pager } = this.props

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
      const getRowCount = ({ rows = mapRows(state) } = {}) => (rows.size || rows.length) // 2 more than index for header and footer

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


      const containerClass = classNames(styles.container, theme.container, isMaximized ? styles.maximized : styles.compressed)
      const innerContainerClass = classNames(styles.innerContainer, theme.innerContainer)
      const gridClass = classNames(styles.BodyGrid, theme.BodyGrid)
      return (
        <div className={containerClass} style={style}>
          <div className={innerContainerClass}>
            <AutoSizer onResize={({ height, width }) => {
              console.info('RESIZED', height, width)
              this.setState({ height, width })
            }}>

              {dimensions => {
                const width = this.state.width || dimensions.width
                console.info('AUTODIMENSIONS =>', dimensions)
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
                    rowHeight={
                      ({ index }) => {
                        return index === 0 ? 50 : 25
                      }
                    }

                    cellRangeRenderer={
                      ({ cellCache, cellRenderer, columnSizeAndPositionManager, columnStartIndex, columnStopIndex, horizontalOffsetAdjustment, isScrolling, rowSizeAndPositionManager, rowStartIndex, rowStopIndex, scrollLeft, scrollTop, verticalOffsetAdjustment } = {}) => {
                        const renderedRows = []
                        const width = this.state.width || dimensions.width

                        /** GRID ROW HEADER */
                        if(header)
                          renderedRows.push(<div key="grid-header" className={classNames(styles.headerGrid, theme.headerGrid)}>{typeof header === 'function' ? header() : header}</div>)

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
                            console.info('EXPANDED', rowIndex)
                            const key = `${rowIndex}-span`
                            const child = (
                              <div
                                key={key}
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
                              if (true === false) { //isScrolling) {
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
                          //renderedRows.push(<div key={`${rowIndex}-row`} id={`${rowIndex}-row`} className={styles.rowStyle}>{renderedCells}</div>)
                          const cellClass = i => classNames(styles.cell, theme.cell, cols[i].className, rowIndex % 2 === 0 ? theme.evenRow : theme.oddRow)
                          renderedRows.push(gridRow(rowIndex, renderedCells, { rowClass: styles.rowStyle, cellClass }))
                        }

                        renderedRows.push(gridRow('col-footers', cols.map(x => x.footer ? x.footer({ rows, theme }) : null), { rowClass: styles.rowStyle, cellClass: i => classNames(styles.footerCell, theme.footerCell, cols[i].className) }))

                        if(footer)
                          renderedRows.push(<div key="grid-footer" className={classNames(styles.footerGrid, theme.footerGrid)}>{typeof footer === 'function' ? footer() : footer}</div>)
                        return renderedRows
                      }
                    }

                    cellRenderer={
                      ({ columnIndex, rowIndex, isScrolling }) => {
                        const col = cols[columnIndex]
                        return rows[rowIndex].render()[columnIndex]
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
      if(prevState.width !== this.state.width || prevState.height !== this.state.height || prevProps.isMaximized !== this.props.isMaximized) {
        console.info('RECALCULATING GRID SIZE')
        this.grid.recomputeGridSize()
      }
    }
  }
  return Core.Connect({ connect, getState })(CoreGrid)
}
