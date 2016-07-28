import cn from 'classnames'
import stamp from '../utils/stamp'
import pane from '../pane'

export default function column(deps, defaults) {
  const { React, shallowCompare, formula, Pre } = deps
  const { Component, PropTypes } = React

  const Pane = pane(deps, defaults)
  const { composePure } = stamp(deps, defaults)

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
    const form = formula(`column-${columnID}`)

    const HEADER_CHECKBOX = 'HEADER_CHECKBOX'
    const HEADER_RADIO = 'HEADER_RADIO'



    const Header = composePure (
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
      , state: { headerEnabled: false, checked: false }
      , init() {
          const { sort } = this.props

          this.onReceiveSub = ({ state } = {}) => {
            if(state && state.checked === false)
              this.setLocalState({ checked: false })
          }
        }
      , _handleChecked (e) {
          this.setState({ checked: e.target.checked })
        }
      , render() {
          const { id
                , children
                , styles
                , theme
                , checkbox
                , radio
                , status
                , actions
                , filter
                } = this.props

          const sort = status.sort ? status.sort : null

          const { checked
                , headerEnabled
                } = this.state


          const className = cn( styles.headerContainer
                              , theme.headerContainer
                              , headerEnabled ? styles.headerEnabled : styles.headerDisabled
                              , headerEnabled ? theme.headerEnabled : theme.headerDisabled
                              )
          return (
            <div className={className}>
              <span style={wrapStyle} className={cn(styles.header, theme.header)}>
                <span style={leftStyle}>
                  <span style={leftControlStyle}>
                    {checkbox ? (
                      <headerForm.Field name={HEADER_CHECKBOX} type="checkbox" {...checkbox} />
                    ) : null}
                  </span>
                  <span style={childrenStyle}>{children}</span>
                </span>
                <span>

                  {filter ? (
                    <button
                      className={cn(styles.filterButton, theme.filterButton)}
                      onClick={() => this.setState({ headerEnabled: !headerEnabled })}
                    >
                      <i className={`fa fa-filter${''}`} />
                    </button>
                  ) : null}
                  {radio ? (
                    <span>
                      {radio.values.map(({ value, checked = false }, i) => (
                        <input key={i} type="radio" name={radio.name} value={value} checked={checked} />
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
              <Pane enabled={headerEnabled}>
                {filter ? filter : null}
              </Pane>
            </div>
          )
        }
      }
    )


    const Cell = composePure (
      { displayName: 'Cell'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , rowID: PropTypes.any.isRequired
                    , colID: PropTypes.any.isRequired
                    }
      , state: { checked: false }
      , init() {
          this.getName = type => {
            const { rowID, colID } = this.props

            return `R${rowID}_C${colID}_${type.toUpperCase()}`
          }
        }
      , render() {
          const { rowID, colID, checkbox, styles, theme, ...props } = this.props
          //const { pub, sub } = this.state
          //const checkboxValue = this.latest([ 'state', 'checked' ], false)

          return (
              <div className={cn(styles.cell, theme.cell)}>
                <form.Field
                  name={this.getName('checkbox')}
                  type="checkbox"
                  subscribeTo={
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
                  //checked={checkboxValue}
                  /*
                  onChange={({ target }) => {
                    const newState = { checked: target.checked }
                    this.sendPub({ state: newState })
                    this.setSubState(newState)
                  }}
                  */
                />
                <Pre>{props}</Pre>
              </div>
          )
        }
      }
    )

    const Footer = composePure (
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
