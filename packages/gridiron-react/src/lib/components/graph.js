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
            singleCellLayout={true}
            templates={
              { Container: ({ children, ...props }) => (
                  <div className={cn(styles.graphContainer, theme.graphContainer)} {...props}>
                    {children}
                  </div>
                )
              , Body: ({ rowIndex, children, ...props }) => (
                  <svg className={cn(styles.graph, theme.graph)}>
                    {children}
                  </svg>
                )
              , Row: ({ rowIndex, children, ...props }) => (
                  cloneElement(children)
                )
              , RowBody: ({ rowIndex, children, ...props }) => (
                  cloneElement(children)
                )
              , Cell: ({ rowIndex, children, ...props }) => (
                  children
                )
              }
            }
            mapCell={
              ({ rowIndex, columnIndex, rowID, columnID, datum }) => (
                cloneElement(mapDatum({ rowIndex, rowID, datum }), { className: cn(styles.graphDatum, theme.graphDatum) })
              )
            }
          />
        )
      }
    }
  )
}
