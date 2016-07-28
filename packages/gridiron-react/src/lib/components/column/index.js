import cn from 'classnames'
import pane from '../pane'

export default function column(pure) {
  const { React, PropTypes, shallowCompare, formula, Pre, defaults } = pure
  const Pane = pane(pure)

  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }

  const leftStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flex: 1
                    , alignItems: 'center'
                    }
  const leftControlStyle =  { display: 'flex'
                            , marginRight: 5
                            }
  const childrenStyle = { display: 'flex'
                        }


  const SortIcon = ({ direction }) => {
    let sortClass = 'fa fa-sort'
    if(direction === 'asc' || direction === 'desc')
      sortClass += `-${direction}`
    return <i className={sortClass} />
  }

  return function Column(columnID) {
    /** TODO: WRAP IN CONTEXT MAYBE TO KEEP SEPARATE FROM OTHER GRIDS */
    const headerForm = formula(`column-header-${columnID}`)
    const cellForm = formula(`column-cell-${columnID}`)
    const footerForm = formula(`column-footer-${columnID}`)

    const HEADER_CHECKBOX = 'HEADER_CHECKBOX'
    const HEADER_RADIO = 'HEADER_RADIO'


    const getCellName = ({ type, rowID, colID }) => `R-${rowID}_C-${colID}_T-${type.toUpperCase()}`

    const Header = pure (
      { displayName: 'Header'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , status: PropTypes.object.isRequired
                    , checkbox: PropTypes.object
                    , radio: PropTypes.object
                    }
      , defaultProps: { ...defaults
                      , status: {}
                      }
      //, state: { headerEnabled: false, checked: false }
      , state: { paneEnabled: false }
      , init() {
          const { sort } = this.props

          this.onReceiveSub = ({ state } = {}) => {
            if(state && state.checked === false)
              this.setLocalState({ checked: false })
          }
        }
      , render() {
          const { id
                , children
                , styles
                , theme
                //, checkbox
                //, radio
                //, status
                , actions
                //, filter
                , fields
                } = this.props

          const { checkbox, radio, sort, filter } = fields
          //const sort = status.sort ? status.sort : null

          const { paneEnabled } = this.state

/*
          const { checked
                , headerEnabled
                } = this.state
                */

          const paneClassName = paneEnabled ? 'paneEnabled' : 'paneDisabled'

          const className = cn( styles.headerContainer
                              , theme.headerContainer
                              , styles[paneClassName]
                              , theme[paneClassName]
                              )
          return (
            <div className={className}>
              <span style={wrapStyle} className={cn(styles.header, theme.header)}>
                <span style={leftStyle}>
                  <span style={leftControlStyle}>
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
                          console.info('SHOULD UPDATE FROM FORM =>', currentValue, subscribed)
                          return currentValue === true
                        })}
                      />
                    ) : null}
                  </span>
                  <span style={childrenStyle}>{children}</span>
                </span>
                <span>

                  {filter ? (
                    <button
                      className={cn(styles.filterButton, theme.filterButton)}
                      onClick={() => this.setState({ paneEnabled: !paneEnabled })}
                    >
                      <i className={`fa fa-filter${''}`} />
                    </button>
                  ) : null}
                  {radio ? (
                    <span>
                      {Object.entries(radio[0]).map(([ name, text ], i) => (
                        <input key={i} type="radio" name={name} value={text} />
                      ))}
                    </span>
                  ) : null}
                  {id && sort && sort.get('cols', []).includes(id) ? (
                    <button onClick={() => actions.sort(id)}>
                      <SortIcon direction={sort.getIn([ 'direction', id ])} />
                    </button>
                  ) : null}
                </span>
              </span>
              <Pane enabled={paneEnabled}>
                {filter ? filter : null}
              </Pane>
            </div>
          )
        }
      }
    )


    const Cell = pure (
      { displayName: 'Cell'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , rowID: PropTypes.any.isRequired
                    , colID: PropTypes.any.isRequired
                    }
      , state: { checked: false }
      , init() {
          this.getName = type => getCellName({ type, ...this.props })
        }
      , render() {
          const { rowID, colID, checkbox, styles, theme, children, ...props } = this.props
          //const { pub, sub } = this.state
          //const checkboxValue = this.latest([ 'state', 'checked' ], false)



          return (
              <div className={cn(styles.cell, theme.cell)}>
                <cellForm.Field
                  name={this.getName('checkbox')}
                  type="checkbox"
                  subscribeInput={[ headerForm.formName, HEADER_CHECKBOX ]}
                  shouldUpdate={({ currentValue, subscribed, subscriptionType }) => {
                    console.info('SHOULD UPDATE', currentValue, subscribed, subscriptionType)
                    /*
                    if(subscriptionType === 'input' && subscribed === true)
                      return true
                    */
                    return true
                  }}
                  /*
                    { formName: headerForm.formName
                    , name: HEADER_CHECKBOX
                    , shouldUpdate: (subscribedValue, value) => {
                        console.warn('COLUMN UPDATE OCCURRED', subscribedValue, value)
                        if(subscribedValue === true)
                          return true
                        return false
                      }
                    }
                  }
                  */
                  //checked={checkboxValue}
                  /*
                  onChange={({ target }) => {
                    const newState = { checked: target.checked }
                    this.sendPub({ state: newState })
                    this.setSubState(newState)
                  }}
                  */
                />
                {children}
              </div>
          )
        }
      }
    )

    const Footer = pure (
      { displayName: 'Footer'
      , render() {
          const { children, ...props } = this.props
          return (
            <div className="footer">
              {children ? cloneElement(children, props) : null}
            </div>
          )
        }
      }
    )

    return { Header, Cell, Footer }
  }
}
