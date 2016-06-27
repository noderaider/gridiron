import CellSizeAndPositionManager from './utils/CellSizeAndPositionManager'

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
export default function createExpandableCellRangeRenderer({ React, onResize, AutoSizer, Expander, expandRowManager, state }) {
  const { Component, PropTypes } = React
  class ExpandedArea extends Component {
    componentDidMount() {
      console.warn('EXPANDED CLIENT HEIGHT', this.container.childNodes[0].clientHeight)
    }
    render() {
      return (
        <div
          ref={x => this.container=x}
          {...this.props}
        />
      )
    }
  }

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


    let expandedOffset = 0

    const expandedIndices = expandRowManager.getExpandedIndices()

    const renderedCells = []

    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

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
            <Expander expanded={isExpanded} handleExpand={() => expandRowManager.onToggleExpand(rowIndex)}/>
          </div>
        )
        renderedCells.push(expander)
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

        renderedCells.push(child)
      }

      if(isExpanded) {
        const key=`${rowIndex}-expanded`
        const style = { /*height: expandRowManager.getHeight(rowIndex)
                      ,*/ left: horizontalOffsetAdjustment
                      , top: rowDatum.offset + rowDatum.size + verticalOffsetAdjustment + expandedOffset
                      , width: '100%'
                      }
        const content = expandRowManager.getContent(rowIndex, state)
        const expanded = (
          <AutoSizer key={key} onResize={
            (dimensions, eventArgs) => {
              console.warn('attempting to resize gridSizer to', dimensions)
              onResize(dimensions)
            }
          } traverseSource={x => x.childNodes[0]} direction="up">
            <ExpandedArea
              style={style}
              className={expandRowManager.getClassName(rowIndex)}
            >
              {expandRowManager.getContent(rowIndex, state)}
            </ExpandedArea>
          </AutoSizer>
        )
        renderedCells.push(expanded)
        //expandedOffset += height
      }
    }

    return renderedCells
  }


}
