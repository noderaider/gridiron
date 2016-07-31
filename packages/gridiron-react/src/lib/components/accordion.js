import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
import column from './column/index'
import util from 'util'

export default function accordion (pure) {
  const { React
        , PropTypes
        , cloneElement
        , shallowCompare
        , Immutable
        , Pre
        , formula
        , defaults
        } = pure

  const Grid = grid(pure)
  const ZERO_MEASURES = [ null, '', 0, '0', '0px' ]

  return pure (
    { displayName: 'Accordion'
    , propTypes:  {
                  }
    , defaultProps: { ...defaults
                    }
    , init() {
        this.contents = {}
        this.toggleRow = rowID => {
          const node = this.contents[rowID]
          if(ZERO_MEASURES.includes(node.style.maxHeight))
            raf(() => this.expandRow(rowID))
          else if(this.collapseRow)
            raf(() => this.collapseRow(rowID))
        }
        this.expandRow = rowID => {
          if(this.collapseRow)
            this.collapseRow()
          this.collapseRow = () => {
            const node = this.contents[rowID]
            if(node)
              node.style.maxHeight = 0
          }
          const node = this.contents[rowID]
          node.style.maxHeight = `${node.scrollHeight}px`
        }
      }
    , render() {
        const { styles, theme, mapHeader, mapContent, data, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            data={data}
            mapCell={
              ({ rowIndex, columnIndex, rowID, columnID, datum }) => {
                return (
                  <div className={cn(styles.accordionRow, theme.accordionRow)}>
                    <div
                      onClick={() => this.toggleRow(rowID)}
                      className={cn(styles.accordionHeader, theme.accordionHeader)}
                    >
                      {mapHeader({ rowIndex, rowID, datum: datum.get('header') })}
                    </div>
                    <div
                      ref={x => this.contents[rowID] = x}
                      className={cn(styles.accordionContent, theme.accordionContent)}
                    >
                      {mapContent({ rowIndex, rowID, datum: datum.get('content') })}
                    </div>
                  </div>
                )
              }
            }
          />
        )
      }
    }
  )
}
