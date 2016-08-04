import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
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
    { displayName: 'chart'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , data: PropTypes.object.isRequired
                  , transitionDurationMS: PropTypes.number
                  }
    , defaultProps: { ...defaults
                    }
    , init() {
        this.contents = {}
      }
    , render() {
        const { styles, theme, mapDatum, data, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            data={data}
            templates={
              { Container: ({ children, ...props }) => (
                  <div className={cn(styles.graphContainer, theme.graphContainer)} {...props}>
                    {children}
                  </div>
                )
              , Body: ({ documentIndex, children, ...props }) => (
                  <svg className={cn(styles.graph, theme.graph)}>
                    {children}
                  </svg>
                )
              , Document: ({ documentIndex, children, ...props }) => (
                  children
                )
              }
            }
            mapDocument={
              ({ documentIndex, documentID, datum }) => (
                cloneElement(mapDatum({ documentIndex, documentID, datum }), { className: cn(styles.graphDatum, theme.graphDatum) })
              )
            }
          />
        )
      }
    }
  )
}
