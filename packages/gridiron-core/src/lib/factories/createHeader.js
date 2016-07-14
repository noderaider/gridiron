import * as Core from '../Header'
import reactPubSub from 'react-pub-sub'
const should = require('chai').should()


export default function createHeader ({ React }) {
  const { Component, PropTypes } = React
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

  const pubSub = reactPubSub({ React })

  const SortIcon = ({ direction }) => {
    let sortClass = 'fa fa-sort'
    if(direction === 'asc' || direction === 'desc')
      sortClass += `-${direction}`

    return <i className={sortClass} />
  }


  const desc =  { init() {
                    const { checked, sort } = this.props
                    this.state = { checked }
                  }
                , _handleSort (e) {
                    this.props.actions.sort(this.props.id)
                  }
                , _handleChecked (e) {
                    this.setState({ checked: e.target.checked })
                  }
                , reset({ props, state }, cb) {
                    if(state && state.checked === false) {
                      this.setState({ checked: false }, cb)
                    } else
                      cb()
                  }
                , propTypes: Core.PropTypes(React)
                , defaultProps: Core.DefaultProps(React)
                , render() {
                    const { id
                          , children
                          , styles
                          , theme
                          , filter
                          , checkbox
                          , radio
                          , status
                          , actions
                          } = this.props

                    const sort = status && status.sort ? status.sort : null


                    const { checked
                          } = this.state
                    return (
                      <span style={wrapStyle} className={theme.header}>
                        <span style={leftStyle}>
                          <span style={leftControlStyle}>
                            {checkbox ? checkbox.label ? (
                                <label><input type="checkbox" id={checkbox.id} onChange={::this._handleChecked} value={checkbox.value} checked={checked} /> {checkbox.label}</label>
                              ) : (
                                <input type="checkbox" id={checkbox.id} onChange={::this._handleChecked} value={checkbox.value} checked={checked} />
                              ) : null}
                          </span>
                          <span style={childrenStyle}>{children}</span>
                        </span>
                        <span>
                          {id && sort && sort.cols && sort.cols.includes(id) ? (
                            <button onClick={::this._handleSort}>
                              <SortIcon direction={sort.direction && sort.direction[id]} />
                            </button>
                          ) : null}
                          {filter ? (
                            <button onClick={filter.handle}>
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
                        </span>
                      </span>
                    )
                  }
                }
  return function header () {
    const { createPub, createSub } = pubSub({ stateNames: [ 'checked' ] })
    const Header = createPub(desc)
    return { Header, createSub }
  }
}
