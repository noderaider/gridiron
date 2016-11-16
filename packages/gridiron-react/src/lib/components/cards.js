import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
import column from './column/column'
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
        const { styles, theme, className, mapHeader, mapContent, data, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            data={data}
            className={cn(styles.cards, theme.cards, className)}
            templates={
              { Document: pure.profile (
                  { displayName: 'CardsDocument'
                  , render ({ documentIndex, children, ...props }) {
                      return (
                        <div className={cn(styles.cardsDocument, theme.cardsDocument)}>
                          {children}
                        </div>
                      )
                    }
                  }
                )
              }
            }
            mapDocument={
              ({ documentIndex, documentID, datum }) => (
                <div className={cn(styles.card, theme.card)}>
                  <div
                    //onClick={() => this.toggleDocument(documentID)}
                    className={cn(styles.cardHeader, theme.cardHeader)}
                  >
                    {mapHeader({ documentIndex, documentID, datum: datum.get('header') })}
                  </div>
                  <div
                    ref={x => this.contents[documentID] = x}
                    className={cn(styles.cardContent, theme.cardContent)}
                  >
                    {mapContent({ documentIndex, documentID, datum: datum.get('content') })}
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
