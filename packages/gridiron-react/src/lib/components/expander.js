import cn from 'classnames'

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
  return Expander
}
