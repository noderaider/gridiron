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
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , mapHeader: PropTypes.func.isRequired
                  , mapContent: PropTypes.func.isRequired
                  , data: PropTypes.object.isRequired
                  , expandedRowID: PropTypes.any
                  , transitionDurationMS: PropTypes.number
                  }
    , defaultProps: { ...defaults
                    }
    , init() {
        this.contents = {}
        this.expanded = []
        this.toggleRow = rowID => {
          const node = this.contents[rowID]
          if(ZERO_MEASURES.includes(node.style.maxHeight))
            raf(() => this.expandRow(rowID))
          else
            raf(() => this.collapseRows())
        }
        this.collapseRows = () => {
          const failed = []
          for(const node of Object.values(this.contents)) {
            if(node)
              node.style.maxHeight = 0
          }
        }
        this.expandRow = rowID => {
          this.collapseRows()
          const node = this.contents[rowID]
          node.style.maxHeight = `${node.scrollHeight}px`
          this.expanded.push(rowID)
        }
      }
    , componentDidMount() {
        const { expandedRowID } = this.props
        if(typeof expandedRowID !== 'undefined')
          this.expandRow(expandedRowID)
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
