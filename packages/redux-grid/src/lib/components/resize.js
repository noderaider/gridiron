import { Resize as Core } from 'redux-grid-core'
const should = require('chai').should()

const enabledButtonStyle =  { cursor: 'pointer'
                            }

export default ({ React }) => {
  const Resize = props => (
    <div>
      {props.isMaximized ? (
        <button style={enabledButtonStyle} onClick={props.onCompress}>
          <i className={'fa fa-compress'} />
        </button>
      ) : (
        <button style={enabledButtonStyle} onClick={props.onMaximize}>
          <i className={'fa fa-expand'} />
        </button>
      )}
    </div>
  )
  Resize.propTypes = Core.PropTypes(React)
  Resize.defaultProps = Core.DefaultProps(React)
  return Resize
}
