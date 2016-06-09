import CellSizeAndPositionManager from './utils/CellSizeAndPositionManager'
import ReactHeight from 'react-height'
let childHeightMap = new Map()

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
export default function createExpandableCellRangeRenderer({ grid, React, AutoSizer, Expander, expandRowManager, state }) {
  const { Component, PropTypes } = React
  class ExpandableArea extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
    /*
    shouldComponentUpdate(nextProps, nextState) {
      return false
    }
    */
    /*
    componentWillUnmount() {
      if(this.height) {
        console.warn('EXPANDED AREA UNMOUNTING, REDUCING HEIGHT FROM GRID')
        grid.reduceHeight(this.height)
      }
    }
    */
    render() {
      const { children } = this.props
      return children
    }
  }

  return new Promise((resolve, reject) => {

/*
    return ({ cellCache
            , cellRenderer
            , columnSizeAndPositionManager
            , columnStartIndex
            , columnStopIndex
            , horizontalOffsetAdjustment
            , isScrolling
            , rowSizeAndPositionManager
            , rowStartIndex
            , rowStopIndex
            , scrollLeft
            , scrollTop
            , verticalOffsetAdjustment
            } = {}) => {
              */

      let rowPromises = []

      let expandedOffset = 0

      const expandedIndices = expandRowManager.getExpandedIndices()

      const renderedCells = []

      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)
        const renderedRowCells = []

        let isExpandable = expandRowManager.isExpandable(rowIndex)
        let isExpanded = expandedIndices.includes(rowIndex)

        let expanderOffset = 0
        if(isExpandable) {
          const expanderKey = `${rowIndex}-expander`
          expanderOffset = expandRowManager.getExpanderWidth(rowIndex)
          let expander = (
            <div
              key={expanderKey}
              style={ { height: rowDatum.size
                      , left: horizontalOffsetAdjustment
                      , top: rowDatum.offset + verticalOffsetAdjustment + expandedOffset
                      , width: expanderOffset
                      } }
              className={expandRowManager.getExpanderClassName(rowIndex)}
            >
              <Expander
                expanded={isExpanded}
                handleExpand={
                  () => {
                    grid.height+=100
                    expandRowManager.onToggleExpand(rowIndex)
                  }
                }
              />
            </div>
          )
          renderedRowCells.push(expander)
        } else {
          const expanderKey = `${rowIndex}-noexpander`
          renderedCells.push(<div key={expanderKey} />)
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

          const style = { height: rowDatum.size
                        , left: isExpandable && columnIndex === 0 ? columnDatum.offset + horizontalOffsetAdjustment + expanderOffset : columnDatum.offset + horizontalOffsetAdjustment
                        , top: rowDatum.offset + verticalOffsetAdjustment + expandedOffset
                        , width: isExpandable && columnIndex === 0 ? columnDatum.size - expanderOffset : columnDatum.size
                        }
          const child = (
            <div
              key={key}
              className='Grid__cell'
              style={style}
            >
              {renderedCell}
            </div>
          )

          renderedRowCells.push(child)
        }


        if(isExpandable) {
          const key=`${rowIndex}-expanded`
          /*
          const content = (
            <div>
              {renderedRowCells}
              {isExpanded ? expandRowManager.getContent(index, state): null}
            </div>
          )
          */
          const content = renderedRowCells
          rowPromises.push(expandRowManager.getHeight(content))

/*
          expandRowManager.getHeight(content).then(height => {
            const style = { height
                          , left: horizontalOffsetAdjustment
                          , top: rowDatum.offset + rowDatum.size + verticalOffsetAdjustment + expandedOffset
                          , width: '100%'
                          }
            const expanded = (
                <ExpandableArea
                  key={key}
                  style={style}
                  className={expandRowManager.getClassName(rowIndex)}
                >
                  {content}
                </ExpandableArea>
            )
            renderedCells.push(expanded)
            //expandedOffset += height
          })
          */
        } else {
          rowPromises.push(expandRowManager.getHeight(content))
        }
      }

      Promise.all(rowPromises).then(rows => {
        resolve(( { cellCache
                  , cellRenderer
                  , columnSizeAndPositionManager
                  , columnStartIndex
                  , columnStopIndex
                  , horizontalOffsetAdjustment
                  , isScrolling
                  , rowSizeAndPositionManager
                  , rowStartIndex
                  , rowStopIndex
                  , scrollLeft
                  , scrollTop
                  , verticalOffsetAdjustment
                  } = {}) => rows.map(x => x.content))
      })

  })
}
