const should = require('chai').should()

export default ({ React }) => {
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }
  const expanderButtonStyle = { border: 0
                              , backgroundColor: 'transparent'
                              }

  return props => (
    <div style={wrapStyle}>
      <span>
        <button style={expanderButtonStyle} onClick={props.handleExpand}>
          <i className={`fa fa-${(props.expanded ? 'minus' : 'plus')}-square`} />
        </button>
      </span>
      <span>{props.children}</span>
    </div>
  )
}
