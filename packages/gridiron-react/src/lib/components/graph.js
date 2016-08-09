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
                  , minX: PropTypes.number.isRequired
                  , minY: PropTypes.number.isRequired
                  , maxX: PropTypes.number.isRequired
                  , maxY: PropTypes.number.isRequired
                  , preserveAspectRatio: PropTypes.string.isRequired
                  }
    , defaultProps: { ...defaults
                    , minX: -100
                    , minY: -100
                    , maxX: 100
                    , maxY: 100
                    , preserveAspectRatio: 'xMidYMid meet'
                    }
    , init() {
        this.contents = {}
      }
    , render() {
        const { styles
              , theme
              , mapDatum
              , data
              , minX
              , minY
              , maxX
              , maxY
              , preserveAspectRatio
              , ...gridProps
              } = this.props
        const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
        return (
          <Grid
            {...gridProps}
            data={data}
            templates={
              { Body: ({ documentIndex, children, ...props }) => (
                  <svg
                    className={cn(styles.graph, theme.graph)}
                    viewBox={viewBox}
                    preserveAspectRatio={preserveAspectRatio}
                  >
                    <g className={cn(styles.graphTransform, theme.graphTransform)}>
                      {children}
                    </g>
                  </svg>
                )
              , Document: ({ documentIndex, children, ...props }) => (
                  children
                )
              }
            }
            mapDocument={
              ({ documentIndex, documentID, datum }) => (
                mapDatum({ documentIndex, documentID, datum })
              )
            }
          />
        )
      }
    }
  )
}
