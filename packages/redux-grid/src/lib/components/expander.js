import { Expander as Core } from 'redux-grid-core'
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
                              , cursor: 'pointer'
                              }

  const Expander = props => (
    <span style={wrapStyle}>
      {props.visible ? (
        <span>
          <button style={expanderButtonStyle} onClick={props.handleExpand}>
            <i className={`fa fa-${(props.expanded ? 'minus' : 'plus')}-square`} />
          </button>
        </span>
      ) : null}
    </span>
  )
  Expander.propTypes = Core.PropTypes(React)
  Expander.defaultProps = Core.DefaultProps(React)
  return Expander
}
