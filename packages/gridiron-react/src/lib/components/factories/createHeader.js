import { Header as Core } from 'gridiron-core'
import cn from 'classnames'
import reactPubSub from 'react-pub-sub'
import pane from '../pane'

const should = require('chai').should()

export default function createHeader ({ React, formula }, defaults) {
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
  const Pane = pane({ React }, defaults)

  const SortIcon = ({ direction }) => {
    let sortClass = 'fa fa-sort'
    if(direction === 'asc' || direction === 'desc')
      sortClass += `-${direction}`
    return <i className={sortClass} />
  }


  const desc =
  { propTypes:  { theme: PropTypes.object.isRequired
                , styles: PropTypes.object.isRequired
                , status: PropTypes.object.isRequired
                , filter: PropTypes.object
                , checkbox: PropTypes.object
                , radio: PropTypes.object
                }
  , defaultProps: { ...defaults
                  , status: {}
                  }
  , init() {
      const { checked, sort } = this.props
      this.state =  { checked
                    , headerEnabled: false
                    }
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
  , render() {
      const { id
            , children
            , styles
            , theme
            , checkbox
            , radio
            , status
            , actions
            } = this.props

      const sort = status && status.sort ? status.sort : null
      const filter = status && status.filter ? status.filter[id] : null

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
                <button onClick={() => actions.sort(id)}>
                  <SortIcon direction={sort.direction && sort.direction[id]} />
                </button>
              ) : null}
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
            </span>
          </span>
          <Pane enabled={headerEnabled}>
            {filter ? filter.content : null}
          </Pane>
        </div>
      )
    }
  }
  return function header () {
    const { createPub, createSub } = pubSub({ stateNames: [ 'checked' ] })
    const Header = createPub(desc)
    return { Header, createCell: createSub }
  }
}
