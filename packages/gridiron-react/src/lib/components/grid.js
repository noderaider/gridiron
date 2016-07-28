import solvent from 'solvent'
import reactStamp from 'react-stamp'
import cn from 'classnames'
import raf from 'raf'

export default function grid (deps, defaults) {
  const { React
        , shallowCompare
        , Immutable
        , Pre
        , formula
        } = solvent({ React: 'object'
                    , shallowCompare: 'function'
                    , Immutable: 'object'
                    , Pre: 'function'
                    })(deps)
  const { PropTypes, cloneElement } = React
  const { styles = {}, theme = {} } = defaults
  const { compose } = reactStamp(React)

  /** Entire grid designed in templates to invert the control here. */
  const templatesShape =
    { GridHeader: PropTypes.func
    , GridFooter: PropTypes.func
    , ColumnHeader: PropTypes.func
    , ColumnFooter: PropTypes.func
    , Row: PropTypes.func
    , RowHeader: PropTypes.func
    , RowBody: PropTypes.func
    , RowFooter: PropTypes.func
    , Cell: PropTypes.func
    , CellHeader: PropTypes.func
    , CellFooter: PropTypes.func
    }

  const defaultTemplates =
    { GridHeader: props => <div className={cn(styles.gridHeader, theme.gridHeader)} {...props} />
    , GridFooter: props => <div className={cn(styles.gridFooter, theme.gridFooter)} {...props} />
    , ColumnHeader: ({ children, ...props }) => <div className={cn(styles.columnHeader, theme.columnHeader)}>{cloneElement(children, props)}</div>
    , ColumnFooter: ({ children, ...props }) => <div className={cn(styles.columnFooter, theme.columnFooter)}>{cloneElement(children, props)}</div>
    , Row: ({ context, rowID, children, ...props }) => (
        <div className={cn(styles.row, theme.row)}>
          {children}
        </div>
      )
    , RowBody: ({ context, rowID, children, ...props }) => (
        <div className={cn(styles.row, theme.row)}>
          {children}
        </div>
      )
    , Cell: ({ children, ...props }) => (
        <div className={cn(styles.cell, theme.cell)}>
          {cloneElement(children, props)}
        </div>
      )
    //, Cell: ({ context, rowID, colID, cellDatum, ...props }) => <div {...props} />
    , NoContent: props => <div {...props} />
    }

  /** Renders a flexbox based grid with Immutable data. */
  return compose(
    { displayName: 'Grid'
    , propTypes:  { 'aria-label': PropTypes.string

                  /** Optional inline style */
                  , style: PropTypes.object

                  /** Optional custom CSS class name to attach to root Grid element. */
                  , className: PropTypes.string

                  /** Optional custom CSS class for individual cells */
                  , cellClassName: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ])

                  /** Optional custom styles for individual cells */
                  , cellStyle: PropTypes.oneOfType([ PropTypes.object, PropTypes.func ])

                  /**
                   * Controls scroll-to-cell behavior of the Grid.
                   * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
                   * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
                   */
                  , scrollToAlignment: PropTypes.oneOf([ 'auto', 'end', 'start', 'center' ]).isRequired

                  /** Column index to ensure visible (by forcefully scrolling if necessary) */
                  , scrollToColumn: PropTypes.number

                  /** Row index to ensure visible (by forcefully scrolling if necessary) */
                  , scrollToRow: PropTypes.number


                  /** Tab index for focus */
                  , tabIndex: PropTypes.number

                  /** Optionally constrain grid to maximum height, otherwise expands to fill container (if enough rows rendered). */
                  , maxHeight: PropTypes.number

                  /** Optionally constrain grid to maximum width, otherwise uses containers width. */
                  , maxWidth: PropTypes.number

                  /**
                   * Optional: Either a fixed row height (number) or a function that returns the height of a row given its index.
                   * Should implement the following interface: ({ index: number }): number
                   */
                  , rowHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ])

                  /**
                   * Optional: Either a fixed column width (number) or a function that returns the width of a column given its index.
                   * Should implement the following interface: (index: number): number
                   */
                  , columnWidth: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ])


                  , templates: PropTypes.shape(templatesShape)
                  , styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  }

    , defaultProps: { 'aria-label': 'grid'
                    , style: {}
                    , cellStyle: {}
                    , scrollToAlignment: 'auto'
                    , tabIndex: 0

                    , templates: {}
                    , styles: {}
                    , theme: {}
                    , ...defaults
                    }
    , state: { locals: null }
    , init() {
        this._updateLocals = () => {
          const { data, mapColumn } = this.props
          const locals = data.get('columns').reduce((map, colID) => map.set(colID, mapColumn.local({ colID })), Immutable.Map())
          console.warn('SETTING LOCALS', locals)
          this.setState({ locals })
        }
      }
    , componentWillMount() {
        this._updateLocals()
      }
    , componentWillReceiveProps(nextProps) {
        if(this.props.data !== nextProps.data)
          this._updateLocals()
      }
    , render () {
        const { className
              , style
              , cellClassName
              , cellStyle
              , maxHeight
              , maxWidth
              , tabIndex

              , data
              , mapColumn

              , styles
              , theme
              } = this.props

        const { locals } = this.state


        const templates = { ...defaultTemplates, ...this.props.templates }

        const rows = data.get('rows')

/*
                                  context.get('cellData').entrySeq().map(([ colID, cellDatum ]) => {
                            const cellProps = { cellDatum, colID }
                            return <templates.Cell key={colID}>{mapColumn.cell({ local: locals.get(colID), ...rowProps, ...cellProps })}</templates.Cell>
                          })
                          */

        const gridColumns = locals.entrySeq().map(([ colID, local ]) => {
          console.info('ITERATING LOCALS =>', local, colID)
          return (
            { header: () => mapColumn.header({ colID, local })
            , cell: rowProps => mapColumn.cell({ colID, local, styles, theme, ...rowProps })
            , footer: mapColumn.footer({ colID, local })
            }
          )
        })


        return (
          <div
            ref={x => this.container = x}
            className={cn(styles.grid, theme.grid)}
            style={style}
            aria-label={this.props['aria-label']}
            role='grid'
            tabIndex={tabIndex}
          >
            <templates.GridHeader />
              <templates.Row key="row-headers" isHeader={true}>
                {gridColumns.map((x, i) => {
                  return <templates.ColumnHeader key={i}>{x.header()}</templates.ColumnHeader>
                })}
              </templates.Row>
              {rows.entrySeq().map(
                ([ rowID, context ]) => {
                  const rowProps = { context, rowID }
                  console.info('PASSING ROWPROPS => ', rowProps)
                  return (
                    <templates.Row key={rowID} {...rowProps}>
                      {templates.RowHeader ? (
                        <templates.RowHeader key="row-header" {...rowProps} />
                      ) : null}
                      <templates.RowBody key="row-body" {...rowProps}>
                        {gridColumns.map((x, i) => {
                          return <templates.Cell key={i}>{x.cell(rowProps)}</templates.Cell>
                        })}
                      </templates.RowBody>
                      {templates.RowFooter? (
                        <templates.RowFooter key="row-footer" {...rowProps} />
                      ) : null}
                    </templates.Row>
                  )
                }
              )}
              <templates.Row key="row-footers" isFooter={true}>
                {gridColumns.map((x, i) => <templates.ColumnFooter key={i}>{x.footer}</templates.ColumnFooter>)}
              </templates.Row>
            <templates.GridFooter />
          </div>
        )
      }


/*
                              {(
                          context.get('cellData').entrySeq().map(([ colID, cellDatum ]) => {
                            const cellProps = { cellDatum, colID }
                            return <templates.Cell key={colID}>{mapColumn.cell({ local: locals.get(colID), ...rowProps, ...cellProps })}</templates.Cell>
                          })
                        )}
                        */

            /* gridBody.size > 0 ? gridBody : */
    , shouldComponentUpdate (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    }
  )
}
