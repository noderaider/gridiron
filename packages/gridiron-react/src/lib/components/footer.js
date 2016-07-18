import { Footer as Core } from 'gridiron-core'
const should = require('chai').should()

export default ({ React }) => {
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }
  const footerButtonStyle = { border: 0
                            , backgroundColor: 'transparent'
                            }

  const Footer = props => (
    <span style={wrapStyle} className={props.theme.footer}>
      {props.children}
    </span>
  )
  Footer.propTypes = Core.PropTypes(React)
  Footer.defaultProps = Core.DefaultProps(React)
  return Footer
}
