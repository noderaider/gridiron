import * as Core from '../Header'
import createPubSub from './createPubSub'
const should = require('chai').should()

const sortDirection = value => {
  switch(value) {
    case 'asc':
      return '-asc'
    case 'desc':
      return '-desc'
    default:
      return ''
  }
}

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



  const pubSub = createPubSub({ React })

  const desc =  { state: { checked: false }
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
                    const { children
                          , styles
                          , theme
                          , sort
                          , filter
                          , checkbox
                          , radio
                          } = this.props
                    const { checked } = this.state
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
                          {sort ? (
                            <button onClick={sort.handle}>
                              <i className={`fa fa-sort${sortDirection(sort.direction)}`} />
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
