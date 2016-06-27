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
    <span style={wrapStyle} className={props.theme.footer}>
      <span>{props.children}</span>
    </span>
  )
}
