import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import { contextTypes } from 'lib/context'
import FA, { faSizeOptions } from 'app/elements/visual/FA'
//import 'styles/bootstrap-core'

export const panelPropTypes = { children: PropTypes.any.isRequired
                              , title: PropTypes.string.isRequired
                              , message: PropTypes.string
                              /** BASE 16 NAME (CONTEXT) OR RESOLVES TO NORMAL COLOR STYLE */
                              , accent: PropTypes.string
                              , iconName: PropTypes.string.isRequired
                              , iconLoadingName: PropTypes.oneOf(['same', 'spinner', 'circle-o-notch', 'refresh', 'cog', 'spinner'])
                              , iconSpinnerName: PropTypes.oneOf(['spin', 'pulse'])
                              , iconSize: PropTypes.oneOf(faSizeOptions)
                              , isLoading: PropTypes.bool.isRequired
                              , isTransparent: PropTypes.bool.isRequired
                              , containerStyle: PropTypes.object.isRequired
                              , headerStyle: PropTypes.object.isRequired
                              , contentStyle: PropTypes.object.isRequired
                              , errorContainerStyle: PropTypes.object.isRequired
                              , errorStyle: PropTypes.object.isRequired
                              , errors: PropTypes.object
                              , maxErrors: PropTypes.number.isRequired
                              , gridProps: PropTypes.object
                              }

export const panelDefaultProps =  { iconName: 'circle-o-notch'
                                  , iconLoadingName: 'same'
                                  , iconSize: 'lg'
                                  , isLoading: false
                                  , isTransparent: false
                                  , containerStyle: { margin: 20 }
                                  , headerStyle: { }
                                  , contentStyle: { clear: 'both' }
                                  , errorContainerStyle: { textAlign: 'center' }
                                  , errorStyle: { backgroundColor: 'rgb(220, 20, 20)'
                                                , border: '1px solid rgb(50, 50, 50)'
                                                , color: '#fff'
                                                , padding: '5px 15px'
                                                , borderRadius: 5
                                                }
                                  , maxErrors: 1
                                  }


export default class CorePanel extends Component {
  static propTypes = panelPropTypes;
  static defaultProps = panelDefaultProps;
  static contextTypes = contextTypes;
  render() {
    const { children
          , title
          , message
          , iconName
          , iconLoadingName
          , iconSize
          , isLoading
          , isTransparent
          , containerStyle
          , headerStyle
          , contentStyle
          , errorContainerStyle
          , errorStyle
          , accent
          , errors
          , maxErrors
          } = this.props

    const { theme: { palette, color, style } } = this.context
    const gridProps = this.props.gridProps || this.context.gridProps

    const accentColor = accent ? palette[accent] : color.accent

    const titleStyle = { paddingTop:0, paddingBottom:0, marginTop:10, ...style.bold }
    const iconStyle = { marginTop:10 }

    let mainStyle = style.panel
    if(isTransparent) {
      mainStyle.backgroundColor = 'transparent'
      mainStyle.borderColor = 'transparent'
    }

    return (
      <Row style={{ width: '100%' }}>
        <Col {...gridProps}>
          <Row style={mainStyle}>
            <Col className="panel-container" style={containerStyle}>
              <div style={headerStyle}>
                <h2 className="pull-left" style={titleStyle}>{title}</h2>
                <div className="pull-right" style={iconStyle}>
                  <FA name={iconName} loadingName={iconLoadingName} size={iconSize} color={accentColor} isLoading={isLoading} />
                </div>
              </div>
              {message ? <div style={{ clear: 'both', margin: 10, fontSize: '1.2em' }}>{message}</div> : null}
              <div style={contentStyle}>
                {children}
              </div>
             {errors && errors.size > 0 ? (
                <div style={errorContainerStyle}>
                  {errors.takeLast(maxErrors).map((error, i) => <div key={i} style={errorStyle}>{error.message}</div>)}
                </div>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
