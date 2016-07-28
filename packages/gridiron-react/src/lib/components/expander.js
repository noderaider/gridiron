import cn from 'classnames'
import { Expander as Core } from 'gridiron-core'
const should = require('chai').should()

export default function expander (pure) {
  const { React, defaults } = pure
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-around'
                    }
  const expanderButtonStyle = { border: 0
                              , backgroundColor: 'transparent'
                              , cursor: 'pointer'
                              }

  const Expander = props => (
    <span style={wrapStyle}>
      {props.visible ? (
        <span>
          <button style={expanderButtonStyle} onClick={props.handleExpand}>
            <i className={cn(`fa fa-${(props.expanded ? 'minus' : 'plus')}-square`, props.theme.expander)} />
          </button>
        </span>
      ) : null}
    </span>
  )
  Expander.propTypes = Core.PropTypes(React)
  Expander.defaultProps = Core.DefaultProps(React)
  return Expander
}
