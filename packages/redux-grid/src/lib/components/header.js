const should = require('chai').should()

export default ({ React }) => {
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }
  const headerButtonStyle = { border: 0
                            , backgroundColor: 'transparent'
                            }

  return props => (
    <span style={wrapStyle} className={props.theme.header}>
      <span>{props.children}</span>
      <span>
        {props.hasSort ? (
          <button style={headerButtonStyle} onClick={props.handleSort}>
            <i className={`fa fa-sort-${(props.asc ? 'asc' : 'desc')}`} />
          </button>
        ) : null}
        {props.hasFilter ? (
          <button style={headerButtonStyle} onClick={props.handleFilter}>
            <i className={`fa fa-filter${''}`} />
          </button>
        ) : null}
      </span>
    </span>
  )
}
