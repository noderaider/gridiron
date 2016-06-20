import React, { Component, PropTypes } from 'react'
import FA from 'app/elements/visual/FA'
import { contextTypes } from 'lib/context'

export default class Label extends Component {
  static propTypes =  { iconName: PropTypes.string
                      , color: PropTypes.string
                      , bsStyle: PropTypes.string
                      , children: PropTypes.any.isRequired
                      };
  static contextTypes = contextTypes;
  render() {
    const { theme } = this.context
    const { style, brand } = theme
    const { iconName, color, bsStyle, onClick, children } = this.props

    const resolvedColor = color || bsStyle ? theme.color.primary : style.label.color
    const resolvedBorderColor = bsStyle ? theme.color.secondary : style.label.color
    const labelStyle =  { ...style.label
                        , lineHeight: 1.5
                        , paddingLeft: 3
                        , paddingRight: 3
                        , margin: 1
                        , color: resolvedColor
                        , borderColor: resolvedBorderColor
                        , backgroundColor: brand[bsStyle || 'default']
                        , cursor: onClick ? 'pointer' : 'default'
                        }
    return (
      <button {...this.props} style={labelStyle}>
        {iconName ? <FA name={iconName} color={resolvedColor} /> : null}
        {' '}
        <span>{children}</span>
      </button>
    )
  }
}



