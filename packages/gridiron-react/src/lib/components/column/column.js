import cn from 'classnames'
import pane from '../pane'

export default function column(pure) {
  const { React, PropTypes, cloneElement, formula, Pre, defaults } = pure
  const Pane = pane(pure)

  const SortIcon = ({ direction }) => {
    let sortClass = 'fa fa-sort'
    if(direction === 'asc' || direction === 'desc')
      sortClass += `-${direction}`
    return <i className={sortClass} />
  }

  return function Column(columnID, columnProps = {}, calculatedProps = {}) {
    /** TODO: WRAP IN CONTEXT MAYBE TO KEEP SEPARATE FROM OTHER GRIDS */
    const headerForm = formula(`column-header-${columnID}`)
    const cellForm = formula(`column-cell-${columnID}`)
    const footerForm = formula(`column-footer-${columnID}`)

    const HEADER_CHECKBOX = 'HEADER_CHECKBOX'
    const HEADER_RADIO = 'HEADER_RADIO'


    const getCellName = ({ type, documentID }) => `R-${documentID}_C-${columnID}_T-${type.toUpperCase()}`

    const Header = pure (
      { displayName: 'Column.Header'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , style: PropTypes.object.isRequired
                    , className: PropTypes.string
                    , fields: PropTypes.object.isRequired
                    }
      , defaultProps: { style: {}
                      , fields: {}
                      , ...defaults
                      , ...columnProps
                      }
      , state: { paneVisible: false }
      , render() {
          const { children
                , styles
                , theme
                , actions
                , fields
                , paneContent
                } = this.props

          const { checkbox, radio, sort, filter } = fields
          const { paneVisible } = this.state
          const paneClassName = paneVisible ? 'paneVisible' : 'paneHidden'
          const className = cn( styles.headerContainer
                              , theme.headerContainer
                              , styles[paneClassName]
                              , theme[paneClassName]
                              , this.props.className
                              )
          return (
            <div className={className} style={this.props.style}>
              <span className={cn(styles.header, theme.header)}>
                <span className={cn(styles.headerLeft, theme.headerLeft)}>
                  {checkbox ? (
                    <headerForm.Field
                      name={HEADER_CHECKBOX}
                      type="checkbox"
                      {...checkbox}
                      subscribeForm={ { target: cellForm.formName
                                      , selectValue: inputs => false
                                      }
                                    }
                      shouldUpdate={(({ currentValue, subscribed, subscriptionType, from }) => {
                        return currentValue === true
                      })}
                    />
                  ) : null}
                  <span className={cn(styles.headerContent, theme.headerContent)}>{children}</span>
                </span>
                <span>
                  {filter ? (
                    <button
                      className={cn(styles.filterButton, theme.filterButton)}
                      onClick={() => this.setState({ paneVisible: !paneVisible })}
                    >
                      <i className={`fa fa-filter${''}`} />
                    </button>
                  ) : null}
                  {radio ? (
                    <span>
                      {Object.entries(radio[0]).map(([ name, text ], i) => (
                        <input key={i} type="radio" name={name} value={text} checked={i === radio[1]} />
                      ))}
                    </span>
                  ) : null}
                  {sort && sort.get('cols', []).includes(columnID) ? (
                    <button onClick={() => actions.sort(columnID)}>
                      <SortIcon direction={sort.getIn([ 'direction', columnID ])} />
                    </button>
                  ) : null}
                </span>
              </span>
              {paneContent ? (
                <Pane enabled={paneVisible}>
                  {paneContent}
                </Pane>
              ) : null}
            </div>
          )
        }
      }
    )


    const Cell = pure (
      { displayName: 'Column.Cell'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , style: PropTypes.object.isRequired
                    , className: PropTypes.string.isRequired
                    , documentID: PropTypes.any.isRequired
                    }
      , defaultProps: { style: {}
                      , className: ''
                      , ...defaults
                      , ...columnProps
                      }
      , init() {
          this.getName = type => getCellName({ type, ...this.props })
        }
      , render() {
          const { documentID, checkbox, styles, theme, className, style, children, ...props } = this.props
          return (
            <div className={cn(styles.cellContent, theme.cellContent, className)} style={style}>
              {checkbox ? (
                <cellForm.Field
                  name={this.getName('checkbox')}
                  type="checkbox"
                  subscribeInput={[ headerForm.formName, HEADER_CHECKBOX ]}
                  shouldUpdate={({ currentValue, subscribed, subscriptionType }) => {
                    return true
                  }}>
                  {children}
                </cellForm.Field>
              ) : children}
            </div>
          )
        }
      }
    )

    const Footer = pure (
      { displayName: 'Column.Footer'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , style: PropTypes.object.isRequired
                    , className: PropTypes.string.isRequired
                    }
      , defaultProps: { style: {}
                      , className: ''
                      , ...defaults
                      , ...columnProps
                      }
      , render() {
          const { style, className, children, ...props } = this.props
          return <div className={className} style={style}>{children}</div>
        }
      }
    )

    return { Header, Cell, Footer }
  }
}
