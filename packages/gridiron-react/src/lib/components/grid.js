import cn from 'classnames'
import raf from 'raf'

export default function grid (pure) {
  const { React
        , PropTypes
        , cloneElement
        , shallowCompare
        , Immutable
        , Pre
        , formula
        , defaults
        } = pure
  const { styles = {}, theme = {} } = defaults

  /** Entire grid designed in templates to invert the control here. */
  const templatesShape =
    { Container: PropTypes.func
    , Header: PropTypes.func
    , Footer: PropTypes.func
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
    { Container: ({ children, ...props }) => (
        <div className={cn(styles.grid, theme.grid)} {...props}>
          {children}
        </div>
      )
    , Header: ({ children, ...props }) => (
        <div className={cn(styles.gridHeader, theme.gridHeader)}>
          {children}
        </div>
      )
    , Footer: ({ children, ...props }) => (
        <div className={cn(styles.gridFooter, theme.gridFooter)}>
          {children}
        </div>
      )
    , ColumnHeader: ({ children, ...props }) => (
        <div className={cn(styles.columnHeader, theme.columnHeader)}>
          {children}
        </div>
      )
    , ColumnFooter: ({ children, ...props }) => (
        <div className={cn(styles.columnFooter, theme.columnFooter)}>
          {children}
        </div>
      )
    , Row: ({ rowIndex, children, ...props }) => {
        const moduloStyle = typeof rowIndex === 'number' ? (rowIndex % 2 === 0 ? 'even' : 'odd') : null
        return (
          <div className={cn(styles.row, theme.row, styles[moduloStyle], theme[moduloStyle])}>
            {children}
          </div>
        )
      }
    , RowHeader: ({ children, ...props }) => (
        <div className={cn(styles.rowHeader, theme.rowHeader)}>
          <span className={cn(styles.rowHeaderContent, theme.rowHeaderContent)}>
            {children}
          </span>
        </div>
      )
    , RowBody: ({ children, ...props }) => (
        <div className={cn(styles.rowBody, theme.rowBody)}>
          {children}
        </div>
      )
    , RowFooter: ({ children, ...props }) => (
        <div className={cn(styles.rowFooter, theme.rowFooter)}>
          <span className={cn(styles.rowFooterContent, theme.rowFooterContent)}>
            {children}
          </span>
        </div>
      )
    , Cell: ({ children, ...props }) => (
        <div className={cn(styles.cell, theme.cell)}>
          {children}
        </div>
      )
    , NoContent: props => <div {...props} />
    }

  /** Renders a flexbox based grid with Immutable data. */
  return pure (
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


                  , data: PropTypes.object.isRequired
                  , mapColumn: PropTypes.object
                  , mapRow: PropTypes.object
                  , mapCell: PropTypes.func.isRequired
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
                    , mapRow: {}
                    , mapColumn:  {}
                    , mapCell: props => <Pre>{props}</Pre>
                    , styles: {}
                    , theme: {}
                    , ...defaults
                    }
    , state: { locals: null }
    , init() {
        this._updateLocals = () => {
          const { data, mapColumn, mapRow } = this.props
          const columns = data.get('columns')
          const rows = data.get('rows')
          const column = mapColumn.local ? columns.reduce((map, columnID) => map.set(columnID, mapColumn.local(columnID)), Immutable.Map()) : Immutable.Map()
          const row = mapRow.local ? rows.keySeq().reduce((map, rowID) => {
            return map.set(rowID, mapRow.local(rowID))
          }, Immutable.Map()) : Immutable.Map()
          const locals =  Immutable.Map({ column, row })
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
              , mapRow
              , mapCell

              , styles
              , theme
              } = this.props

        const { locals } = this.state
        const templates = { ...defaultTemplates, ...this.props.templates }
        const rows = data.get('rows')
        const columns = data.get('columns')


        const gridColumns = columns.map((columnID, columnIndex) => {
          const local = locals.getIn([ 'column', columnID ])
          const header = mapColumn.header ? (
            <templates.ColumnHeader key={columnIndex} columnIndex={columnIndex}>
              {mapColumn.header({ local, columnID, columnIndex })}
            </templates.ColumnHeader>
          ) : null

          const footer = mapColumn.footer ? (
            <templates.ColumnFooter key={columnIndex} columnIndex={columnIndex}>
              {mapColumn.footer({ local, columnID, columnIndex })}
            </templates.ColumnFooter>
          ) : null
          return { header, footer }
        })

/*
        const gridColumns = locals.get('column').entrySeq().map(([ columnID, local ]) => {
          const props = { columnID, local }
          const header = mapColumn.header(props)
          const footer = mapColumn.footer(props)
          return { header, footer }
        })
        */

        const getColumnLocal = columnID => locals.getIn([ 'column', columnID ])

        return (
          <templates.Container
            ref={x => this.container = x}
            style={style}
            aria-label={this.props['aria-label']}
            role='grid'
            tabIndex={tabIndex}
          >
            {this.props.header ? <templates.Header>{this.props.header}</templates.Header> : null}
            {mapColumn.header ? (
              <templates.Row key="row-headers" isHeader={true}>
                {gridColumns.map(columns => columns.header)}
              </templates.Row>
            ) : null}

            {rows.entrySeq().map(
              ([ rowID, rowContext ], rowIndex) => {
                const local = locals.getIn([ 'row', rowID ])
                const rowDatum = rowContext.get('rowDatum')
                const cellData = rowContext.get('cellData')
                return (
                  <templates.Row key={rowIndex} rowIndex={rowIndex}>
                    {mapRow.header ? (
                      <templates.RowHeader>
                        {mapRow.header({ local, rowID, rowIndex, rowDatum })}
                      </templates.RowHeader>
                    ) : null}
                    <templates.RowBody>
                      {columns.map((columnID, columnIndex) => {
                        const datum = cellData.get(columnID)
                        const columnLocal = getColumnLocal(columnID)
                        return (
                          <templates.Cell key={columnIndex} rowIndex={rowIndex} columnIndex={columnIndex}>
                            {mapCell({ columnLocal, rowLocal: local, rowIndex, columnIndex, rowID, columnID, datum })}
                          </templates.Cell>
                        )
                      })}
                    </templates.RowBody>
                    {mapRow.footer ? (
                      <templates.RowFooter>
                        {mapRow.footer({ local, rowID, rowIndex, rowDatum })}
                      </templates.RowFooter>
                    ) : null}
                  </templates.Row>
                )
              }
            )}
            {mapColumn.footer ? (
              <templates.Row key="row-footers" isFooter={true}>
                {gridColumns.map(columns => columns.footer)}
              </templates.Row>
            ) : null}

            {this.props.footer ? <templates.Footer>{this.props.footer}</templates.Footer> : null}
          </templates.Container>
        )
      }

    }
  )
}
