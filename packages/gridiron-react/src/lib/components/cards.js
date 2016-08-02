import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
import column from './column/index'
import util from 'util'

export default function cards (pure) {
  const { React
        , PropTypes
        , cloneElement
        , shallowCompare
        , Immutable
        , Pre
        , formula
        , defaults
        } = pure

  const toggleHeight = 50

  const Grid = grid(pure)
  const ZERO_MEASURES = [ null, '', 0, '0', '0px', `${50}px` ]

  return pure (
    { displayName: 'Cards'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , mapHeader: PropTypes.func.isRequired
                  , mapContent: PropTypes.func.isRequired
                  , data: PropTypes.object.isRequired
                  , transitionDurationMS: PropTypes.number
                  }
    , defaultProps: { ...defaults
                    }
    , init() {
        this.contents = {}
      }
    , render() {
        const { styles, theme, mapHeader, mapContent, data, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            data={data}
            templates={
              { Container: ({ children, ...props }) => (
                  <div className={cn(styles.cards, theme.cards)} {...props}>
                    {children}
                  </div>
                )
              , Body: ({ rowIndex, children, ...props }) => (
                  <div className={cn(styles.cardsBody, theme.cardsBody)}>
                    {children}
                  </div>
                )
              , Row: ({ rowIndex, children, ...props }) => (
                  <div className={cn(styles.cardsRow, theme.cardsRow)}>
                    {children}
                  </div>
                )
              }
            }
            mapCell={
              ({ rowIndex, columnIndex, rowID, columnID, datum }) => (
                <div className={cn(styles.card, theme.card)}>
                  <div
                    //onClick={() => this.toggleRow(rowID)}
                    className={cn(styles.cardHeader, theme.cardHeader)}
                  >
                    {mapHeader({ rowIndex, rowID, datum: datum.get('header') })}
                  </div>
                  <div
                    ref={x => this.contents[rowID] = x}
                    className={cn(styles.cardContent, theme.cardContent)}
                  >
                    {mapContent({ rowIndex, rowID, datum: datum.get('content') })}
                  </div>
                </div>
              )
            }
          />
        )
      }
    }
  )
}
