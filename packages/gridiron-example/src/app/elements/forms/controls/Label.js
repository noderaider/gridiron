import React, { Component, PropTypes } from 'react'
import FA from 'app/elements/visual/FA'

export default class Label extends Component {
  static propTypes =  { iconName: PropTypes.string
                      , color: PropTypes.string
                      , bsStyle: PropTypes.string
                      , children: PropTypes.any.isRequired
                      };
  render() {
    const { color, onClick, children, iconName, bsStyle, ...buttonProps } = this.props

    const labelStyle =  { lineHeight: '1.2em'
                        , fontSize: '0.7rem'
                        , paddingLeft: 3
                        , paddingRight: 3
                        , margin: '0 0.2em'
                        , color
                        , borderColor: color
                        , borderWidth: 1
                        , borderStyle: 'groove'
                        , backgroundColor: 'transparent'
                        , borderRadius: 3
                        , cursor: onClick ? 'pointer' : 'default'
                        }
    return (
      <button {...buttonProps} style={labelStyle}>
        {iconName ? <FA name={iconName} color={color} /> : null}
        {' '}
        <span>{children}</span>
      </button>
    )
  }
}



