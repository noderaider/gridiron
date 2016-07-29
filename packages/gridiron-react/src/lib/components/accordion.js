import cn from 'classnames'
import grid from './grid'
import column from './column'

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
  const Column = column(pure)

  const AccordionRow = pure (
    { displayName: 'AccordionRow'
    , defaultProps: { ...defaults
                    }
    , render() {
        const { styles, theme, children, ...childProps } = this.props
        return (
          <div className={cn(styles.accordionRow, theme.accordionRow)} {...childProps}>
            {children}
          </div>
        )
      }
    }
  )

  const AccordionHeader = pure (
    { displayName: 'AccordionHeader'
    , defaultProps: { ...defaults
                    }
    , render() {
        const { styles, theme, children, ...childProps } = this.props
        return (
          <div className={cn(styles.accordionHeader, theme.accordionHeader)} {...childProps}>
            {children}
          </div>
        )
      }
    }
  )


  const AccordionChild = pure (
    { displayName: 'AccordionChild'
    , defaultProps: { ...defaults
                    }
    , render() {
        const { styles, theme, children, ...childProps } = this.props
        return (
          <div className={cn(styles.accordionChild, theme.accordionChild)} {...childProps}>
            <Pre>{{ children, childProps }}</Pre>
          </div>
        )
      }
    }
  )


  function accordionRow (header, child) {
    const rowDatum = Immutable.Map({ header, child })
    const cellData = Immutable.Map({ 'accordion': header })
    return Immutable.Map({ rowDatum, cellData })
  }


  return pure (
    { displayName: 'Accordion'
    , propTypes:  { children: PropTypes.any.isRequired
                  }
    , defaultProps: { ...defaults
                    }
    , state:  { data: Immutable.Map({ rows: Immutable.Map(), columns: Immutable.List([ 'accordion' ]) })
              }
    , init() {
        this._setData = () => {
          const { children } = this.props
          const { data } = this.state
          const accordionRows = children(accordionRow)
          const accordionMap = accordionRows.reduce((result, row, i) => {
            return { ...result, [i]: row }
          })
          const rows = Immutable.OrderedMap(accordionMap)
          this.setState({ data: data.set('rows', rows) })
        }
      }
    , componentWillMount() {
        this._setData()
      }
    , componentWillReceiveProps() {
        this._setData()
      }
    , render() {
        const { styles, theme, ...gridProps } = this.props
        const { data } = this.state
        return (
          <Grid
            data={data}
            mapColumn={
              { local: ({ colID }) => ({ column: Column(colID) })
              , header: ({ local, ...props }) => {
                  const { column } = local
                  return <column.Header {...props}>HEADER</column.Header>
                }
              , footer: ({ local, ...props }) => {
                  const { column } = local
                  return <column.Footer {...props}>FOOTER</column.Footer>
                }
              }
            }
            mapCell={
              ({ columnLocal, rowIndex, columnIndex, rowID, columnID, datum }) => {
                const { column } = columnLocal
                console.warn('MAPCELL', datum)
                return (
                  <column.Cell rowID={rowID}>
                    <AccordionHeader>{datum.header}</AccordionHeader>
                    <AccordionChild>{datum.child}</AccordionChild>
                  </column.Cell>
                )
              }
            }
            {...gridProps}
          />
        )
      }
    }
  )
}
