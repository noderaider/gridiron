import React, { Component, PropTypes } from 'react'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'
import { toggleVisibility } from 'lib/redux/actions/visual'
import Label from 'app/elements/forms/controls/Label'

const getLabelID = componentID => `label_${componentID}`
const getTooltipID = componentID => `tooltip_${componentID}`

class Micro extends Component {
  componentDidMount() {
    const { componentID, actionType, tooltip } = this.props
    const Clipboard = require('clipboard')

    if(actionType === 'clipboard' && typeof tooltip !== 'undefined') {
      this.clipboard = new Clipboard(`#${getLabelID(componentID)}`)
      const caption = 'Click to copy'
      this.caption.innerHTML = caption
      this.clipboard.on('success', e => {
        this.caption.innerHTML = 'Copied to clipboard!'
        setTimeout(() => this.caption.innerHTML = caption, 3000)
      })
      this.clipboard.on('error', e => {
        this.caption.innerHTML = 'Error copying to clipboard!'
        setTimeout(() => this.caption.innerHTML = caption, 3000)
      })
    }
  }
  componentWillUnmount() {
    const { tooltip } = this.props
    if(actionType === 'clipboard' && typeof tooltip !== 'undefined')
      this.clipboard.destroy()
  }
  render() {
    const { dispatch, visibility, componentID, children, actionType, actionData, onAction, tooltip, iconName, bsStyle } = this.props
    const tooltipID = getTooltipID(componentID)
    const isToggled = visibility.getIn([componentID, 'value'], false)

    const microStyle =  { display: 'inline-block'
                        , fontStyle: isToggled ? 'italic' : 'normal'
                        }
    const captionStyle = { fontSize: '0.8em', color: '#888' }
    const data = actionType === 'clipboard' ? (typeof actionData === 'string' ? actionData : JSON.stringify(actionData, null, 2))
                                            : null
    return (typeof tooltip !== 'undefined') ? (
      <div style={microStyle}>
        <Label
            id={getLabelID(componentID)}
            data-tip
            data-for={tooltipID}
            data-clipboard-text={data}
            iconName={iconName}
            bsStyle={bsStyle}
            onClick={e => {
              if(actionType === 'toggleComponent')
                dispatch(toggleVisibility(componentID))
            }}>
          {children}
        </Label>

        <ReactTooltip id={tooltipID}>
          {tooltip || `componentID: ${componentID}`}
          <span ref={x => this.caption=x} style={captionStyle} />
        </ReactTooltip>
      </div>
    ) : (
      <div style={microStyle}>
        <Label
            id={getLabelID(componentID)}
            iconName={iconName}
            bsStyle={bsStyle}
            onClick={e => {
              if(actionType === 'toggleComponent')
                dispatch(toggleVisibility(componentID))
            }}>
          {children}
        </Label>
      </div>
    )
  }
}
Micro.propTypes = { componentID: PropTypes.string.isRequired
                  , actionType: PropTypes.oneOf(['toggleComponent', 'clipboard'])
                  , actionData: PropTypes.any
                  , onAction: PropTypes.func
                  , children: PropTypes.any.isRequired
                  , tooltip: PropTypes.any.isRequired
                  , iconName: PropTypes.string
                  , bsStyle: PropTypes.string
                  }
Micro.defaultProps =  { actionType: 'toggleComponent'
                      }

const mapStateToProps = (state, ownProps) => {
  const { visual } = state
  return  { ...ownProps
          , visibility: visual.visibility
          }
}
export default connect(mapStateToProps)(Micro)
