import Promise from 'bluebird'
import classNames from 'classnames'
import solvent from 'solvent'

export default function container (deps = {}, defaults = {}) {
  const { React, ReactDOM, ReactGateway, shallowCompare } = solvent({ React: 'object', ReactDOM: 'object', ReactGateway: 'object', shallowCompare: 'function' })(deps)
  const { Component, PropTypes, cloneElement } = React
  const { Gateway, GatewayDest, GatewayProvider } = ReactGateway


  const contentShape =  { maximize: PropTypes.any.isRequired
                        , restore: PropTypes.any.isRequired
                        }

  const propTypes = { /*children: PropTypes.any.isRequired
                    ,*/ style: PropTypes.object.isRequired
                    , className: PropTypes.string.isRequired
                    , styles: PropTypes.object.isRequired
                    , containerStyle: PropTypes.object.isRequired
                    , backgroundStyle: PropTypes.object.isRequired
                    , content: PropTypes.shape(contentShape).isRequired
                    , maximizeDelay: PropTypes.number.isRequired
                    , restoreDelay: PropTypes.number.isRequired
                    }
  const defaultProps =  { styles: { maximize: 'maximize'
                                  , restore: 'restore'
                                  , maximizeContent: 'maximizeContent'
                                  }
                        , style: {}
                        , className: ''
                        , containerStyle: { position: 'absolute'
                                          , display: 'flex'
                                          , flex: '1 0 auto'
                                          , flexDirection: 'column'
                                          , top: 0
                                          , left: 0
                                          , right: 0
                                          , margin: 0
                                          , padding: 0
                                          , minHeight: '100vh'
                                          , color: '#fff'
                                          //, zIndex: 10
                                          }
                        , backgroundStyle:  { position: 'fixed'
                                            , display: 'flex'
                                            , flexGrow: '1 0 100vh'
                                            , backgroundColor: 'rgba(0, 0, 0, 0.7)'
                                            , top: 0
                                            , left: 0
                                            , right: 0
                                            , bottom: 0
                                            }
                        , content:  { maximize: <i className={'fa fa-expand'} />
                                    , restore: <i className={'fa fa-compress'} />
                                    }
                        , maximizeDelay: 200
                        , restoreDelay: 200
                        , zIndexMin: 100
                        , ...defaults
                        }
  const Controls = ({ isMaximized, actions }) => (
    <button onClick={() => isMaximized ? actions.restore() : actions.maximize()}>
      <i className={`fa fa-${isMaximized ? 'compress' : 'expand'}`} />
    </button>
  )


  class Box extends Component {
    static propTypes =  propTypes;
    static defaultProps = defaultProps;
    render() {
      const { id, isMaximized, children, content, style, className, containerStyle, backgroundStyle, styles, actions } = this.props
      const gatewayName = `${id}-page`

      const testStyle = { color: '#fff', width: 600, height: 600, position: 'relative', border: '1px dotted green', bottom: 20, right: 20  }

      const maximizeName = `maximize-${id}`

      const boxStyle = {} // position: 'absolute' }

      return (
        <div>
          <GatewayDest name={gatewayName} />
          <Gateway into={isMaximized ? maximizeName : gatewayName}>
            <div style={boxStyle}>{children}</div>
          </Gateway>
        </div>
      )
    }
  }

  class Container extends Component {
    constructor(props) {
      super(props)
      this.state =  { isMaximized: false
                    , lastScroll: { x: 0, y: 0 }
                    }
    }
    componentDidUpdate(prevProps, prevState) {
      const { isMaximized } = this.state
      if(prevState.isMaximized !== isMaximized) {
        if(isMaximized) {
          this.setState({ lastScroll: { x: window.scrollX, y: window.scrollY } })
          window.scrollTo(0, 0)
        } else {
          const { lastScroll } = this.state
          window.scrollTo(lastScroll.x, lastScroll.y)
          this.setState({ lastScroll: { x: 0, y: 0 } })
        }
      }
    }
    render() {
      const { id } = this.props
      const { isMaximized } = this.state

      const controlProps =  { ...this.state
                            , id
                            , actions: { maximize: this.maximize, restore: this.restore }
                            }

      return  this.props.children({ Controls: props => <Controls {...controlProps} />
                                  , Box: props => <Box {...props} {...controlProps} />
                                  , ...controlProps
                                  })
    }
    maximize = () => {
      this.props.maximize(this.props.id)
        .then(() => this.setState({ isMaximized: true }))
    };
    restore = () => {
      this.props.restore(this.props.id)
        .then(() => this.setState({ isMaximized: false }))
    };
  }
  return Container
}
