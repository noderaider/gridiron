import cn from 'classnames'
import raf from 'raf'

export default function grid (pure) {
  const { React
        , PropTypes
        , cloneElement
        , shallowCompare
        , createFragment
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
    , Document: PropTypes.func
    , DocumentHeader: PropTypes.func
    , DocumentBody: PropTypes.func
    , DocumentFooter: PropTypes.func
    , Cell: PropTypes.func
    , CellHeader: PropTypes.func
    , CellFooter: PropTypes.func
    }

  const selectStyles = (styleNames, classNames) => cn(...(Array.isArray(styleNames) ? styleNames : [ styleNames ]).map(
      styleName => [ styles[styleName], theme[styleName] ]
    ), classNames ? (Array.isArray(classNames) ? classNames : [ classNames ]) : null)

  const defaultTemplates =
    { Container: ({ children, className, ...props }) => (
        <div className={selectStyles('grid', className)} {...props}>
          {children}
        </div>
      )
    , Header: ({ children, ...props }) => (
        <div className={selectStyles('gridHeader')}>
          {children}
        </div>
      )
    , Body: ({ children, ...props }) => (
        <div className={selectStyles('body')}>
          {children}
        </div>
      )
    , Footer: ({ children, ...props }) => (
        <div className={selectStyles('gridFooter')}>
          {children}
        </div>
      )
    , ColumnHeader: ({ children, ...props }) => (
        children
      /*
        <div className={selectStyles('columnHeader')}>
          {children}
        </div>
        */
      )
    , ColumnFooter: ({ children, ...props }) => (
        children
      /*
        <div className={selectStyles('columnFooter')}>
          {children}
        </div>
        */
      )
    , Document: ({ documentIndex, children, isHeader, isFooter, className, ...props }) => {
        const moduloStyle = typeof documentIndex === 'number' && documentIndex >= 0 ? (documentIndex % 2 === 0 ? 'even' : 'odd') : null
        return (
          <div className={selectStyles([ 'document', moduloStyle ], className)}>
            {children}
          </div>
        )
      }
    , DocumentHeader: ({ children, ...props }) => (
        <div className={selectStyles('documentHeader')}>
          <span className={selectStyles('documentHeaderContent')}>
            {children}
          </span>
        </div>
      )
    , DocumentBody: ({ children, ...props }) => (
        <div className={selectStyles('documentBody')}>
          {children}
        </div>
      )
    , DocumentFooter: ({ children, ...props }) => (
        <div className={selectStyles('documentFooter')}>
          <span className={selectStyles('documentFooterContent')}>
            {children}
          </span>
        </div>
      )
    , Cell: ({ children, ...props }) => (
        children
      /*
        <div className={selectStyles('cell')}>
          {children}
        </div>
        */
      )
    , Fill: ({ children = null, ...props }) => <div className={cn(selectStyles('fill'))} {...props}>{children}</div>
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

                  /** Document index to ensure visible (by forcefully scrolling if necessary) */
                  , scrollToDocument: PropTypes.number


                  /** Tab index for focus */
                  , tabIndex: PropTypes.number

                  /** Optionally constrain grid to maximum height, otherwise expands to fill container (if enough documents rendered). */
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
                  , mapDocument: PropTypes.oneOfType([ PropTypes.func, PropTypes.object ])
                  , mapColumn: PropTypes.object
                  , mapCell: PropTypes.func
                  , templates: PropTypes.shape(templatesShape)
                  , styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , mergeLocal: PropTypes.func.isRequired
                  , useContentHeight: PropTypes.bool.isRequired
                  }

    , defaultProps: { 'aria-label': 'grid'
                    , className: ''
                    , style: {}
                    , cellStyle: {}
                    , scrollToAlignment: 'auto'
                    , tabIndex: 0

                    , templates: {}
                    , mapDocument: {}
                    , mapColumn:  {}
                    , mergeLocal: ({ documentLocal, columnLocal }) => Object.assign({}, documentLocal, columnLocal)
                    , useContentHeight: false
                    , ...defaults
                    }
    , state:  { documentLocal: null
              , columnLocal: null
              }
    , init() {
        this._updateLocals = () => {
          const { data, mapColumn, mapDocument } = this.props
          const columns = data.get('columns')
          const documents = data.get('documents')
          const columnLocal = columns && mapColumn.local ? columns.reduce((map, columnID) => map.set(columnID, mapColumn.local(columnID)), Immutable.Map()) : null
          const documentLocal = mapDocument.local ? documents.keySeq().reduce((map, documentID) => {
            return map.set(documentID, mapDocument.local(documentID))
          }, Immutable.Map()) : null
          this.setState({ columnLocal, documentLocal })
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
              , mapDocument
              , mapCell
              , mergeLocal
              , useContentHeight

              , styles
              , theme
              } = this.props

        const templates = { ...defaultTemplates, ...this.props.templates }
        const documents = data.get('documents')

        const isPrimitive = typeof mapDocument === 'function'

        const columns = isPrimitive ? null : data.get('columns')

        const rendered = (
          { columnHeader: mapColumn.header ? <templates.ColumnHeader columnIndex={-1} /> : null
          , columnFooter: mapColumn.footer ? <templates.ColumnFooter columnIndex={-1} /> : null
          , document: <templates.Document documentIndex={-1} />
          , documentHeader: !isPrimitive && mapDocument && mapDocument.header ? <templates.DocumentHeader documentIndex={-1} /> : null
          , documentFooter: !isPrimitive && mapDocument && mapDocument.footer ? <templates.DocumentFooter documentIndex={-1} /> : null
          , documentBody: !isPrimitive && columns ? <templates.DocumentBody documentIndex={-1} /> : null
          , cell: !isPrimitive && columns ? <templates.Cell documentIndex={-1} columnIndex={-1} /> : null
          }
        )

        const gridColumns = isPrimitive ? null : columns.map((columnID, columnIndex) => {
          const local = this.state.columnLocal && this.state.columnLocal.get(columnID)
          const { columnHeader, columnFooter } = rendered
          const header = columnHeader ? cloneElement(columnHeader, (
            { key: columnIndex
            , columnIndex
            , children: mapColumn.header({ local, columnID, columnIndex })
            }
          )) : null
          const footer = columnFooter ? cloneElement(columnFooter, (
            { key: columnIndex
            , columnIndex
            , children: mapColumn.footer({ local, columnID, columnIndex })
            }
          )) : null
          return { header, footer }
        })

        /** TODO: MAKE 1 INSTANCE and clone with locals and data, test perf */
        const renderDocument = ({ documentID, documentIndex, context }) => {
          const datum = context.get('datum')
          const cells = isPrimitive ? null : context.get('cells')
          const documentLocal = isPrimitive ? null : this.state.documentLocal && this.state.documentLocal.get(documentID)


          const children = isPrimitive ? (
            mapDocument({ documentID
                        , documentIndex
                        , datum
                        })
          ) : createFragment(
            { header: rendered.documentHeader ? (
                cloneElement(rendered.documentHeader, { documentIndex
                                                      , children: mapDocument.header( { local: documentLocal
                                                                                      , documentID
                                                                                      , documentIndex
                                                                                      , datum
                                                                                      })
                                                      })
              ) : null
            , body: cloneElement(rendered.documentBody, { documentIndex
                                                        , children: (
                  columns.map((columnID, columnIndex) => (
                    cloneElement(rendered.cell, { key: columnIndex
                                                , documentIndex
                                                , columnIndex
                                                , children: (
                                                    mapCell(
                                                      { documentIndex
                                                      , documentID
                                                      , columnIndex
                                                      , columnID
                                                      , local: mergeLocal(
                                                          { documentLocal
                                                          , columnLocal: this.state.columnLocal && this.state.columnLocal.get(columnID)
                                                          }
                                                        )
                                                      , datum: cells.get(columnID)
                                                      }
                                                    )
                                                  )
                                              }
                      )
                    )
                  )
                )
              })
            , footer: rendered.documentFooter ? (
                cloneElement(rendered.documentFooter, { documentIndex
                                                      , children: mapDocument.footer( { local: documentLocal
                                                                                      , documentID
                                                                                      , documentIndex
                                                                                      , datum
                                                                                      })
                                                      })
              ) : null
            }
          )

          return cloneElement(rendered.document,
            { key: documentIndex
            , documentIndex
            , children
            , className: isPrimitive ? selectStyles('primitive') : selectStyles('sectional')
            }
          )
        }

        return (
          <templates.Container
            ref={x => this.container = x}
            style={style}
            className={cn(className, selectStyles(useContentHeight ? 'fixedHeight' : 'variableHeight'))}
            aria-label={this.props['aria-label']}
            role='grid'
            tabIndex={tabIndex}
          >
            {this.props.header ? <templates.Header>{this.props.header}</templates.Header> : null}
            {gridColumns && mapColumn.header ? (
              cloneElement(rendered.document, { isHeader: true
                                              , children: gridColumns.map(columns => columns.header)
                                              })
            ) : null}

            <templates.Body key="grid-body">
              {documents.entrySeq().map(
                ([ documentID, context ], documentIndex) => renderDocument({ documentID, documentIndex, context })
              )}
              <templates.Fill />
            </templates.Body>

            {gridColumns && mapColumn.footer ? (
              cloneElement(rendered.document, { isFooter: true
                                              , children: gridColumns.map(columns => columns.footer)
                                              })
            ) : null}

            {this.props.footer ? <templates.Footer>{this.props.footer}</templates.Footer> : null}
          </templates.Container>
        )
      }
    }
  )
}
