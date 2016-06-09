import { createPropTypes, createConnect } from '../createGrid'
import createExpander from '../createExpander'
import createExpandableCellRangeRenderer from './internal/createExpandableCellRangeRenderer'
import createAutoSizer from 'react-autosizer'
import classNames from 'classnames'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'


export default function createGrid({ React, connect, ReactVirtualized, Immutable, ContentBox }) {
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
    set width(value) {
      console.warn(`setting ReduxGrid width to ${value}`)
      this.setState({ width: value })
    }
    set height(value) {
      console.warn(`setting ReduxGrid height to ${value}`)
      this.setState({ height: value })
    }
    constructor(props) {
      super(props)
      this.state =  { disableHeader: false
                    , headerHeight: 30
                    , height: props.height || 900
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
    /*
    componentDidMount() {
      this.measureID = setInterval(this._measure, pollingFrequency)
    }
    componentWillUnmount() {
      clearInterval(this.measureID)
    }
    _measure = () => {
    };
    */
    render() {
      const { state, selectColumns, selectRows, maxHeight, styles, expandRowManager } = this.props
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

      const cellRangeRenderer = createExpandableCellRangeRenderer({ React, ReactCSSTransitionGroup, Expander, expandRowManager, state })

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
          <div style={{height: 800}}>
            <AutoSizer direction="down">
              {({ width, height }, gridSizer) => {
                const onResize = dimensions => {
                  if(gridSizer) {
                    console.warn('gridsizer updated', dimensions)
                    gridSizer.dimensions = dimensions
                  }
                  rowHeight={({ index }) => index === 0 ? 50 : 19}
                  columnCount={columnKeys.length}
                  rowCount={rowCount}

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
                              cellCache[key] = cellRenderer({
                                columnIndex,
                                isScrolling,
                                rowIndex
                              })
                            }
                            renderedCell = cellCache[key]
                          // If the user is no longer scrolling, don't cache cells.
                          // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
                          } else {
                            renderedCell = cellRenderer({
                              columnIndex,
                              isScrolling,
                              rowIndex
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

                        renderedRows.push(<div key={`${rowIndex}-row`} id={`${rowIndex}-row`} className={expandRowManager.rowStyle} data-row-height={rowDatum.size} style={rowStyle}>{renderedCells}</div>)

                        if(isExpanded) {
                          let key=`${rowIndex}-expanded`
                          //let height=expandRowManager.getHeight(rowIndex)
                          let expanded = cloneElement(expandRowManager.getContent(rowIndex, state), { key, id:key, className: 'drill' })
                          //let expandedTransition = <SlideRow key={`${key}-transition`}>{expanded}</SlideRow>
                          renderedRows.push(expanded)
                        }
                      }
                      return renderedRows
                    }
                  }

                  cellRenderer={
                    ({ columnIndex, rowIndex, isScrolling }) => {
                      if(rowIndex === 0) {
                        return <div className={styles.headerCell}>{columns[columnKeys[columnIndex]]}</div>
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
                )
              }
              }
            </AutoSizer>
          </div>
        </ContentBox>
      )
    }
  }
  class SlideRow extends Component {
    render() {
      const { children } = this.props
      return (
        <ReactCSSTransitionGroup
          transitionName="rowSlide"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {children}
        </ReactCSSTransitionGroup>
      )
    }
  }
  return createConnect({ connect })(ReduxGrid)
}
