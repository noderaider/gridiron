import Promise from 'bluebird'
import classNames from 'classnames'
import solvent from 'solvent'

export default function maximize (deps = {}, defaults = {}) {
  const { React, ReactDOM, ReactGateway, shallowCompare, CSSPropertyOperations } = solvent({ React: 'object', ReactDOM: 'object', ReactGateway: 'object', shallowCompare: 'function', CSSPropertyOperations: 'function' })(deps)
  const { Component, PropTypes, cloneElement } = React
  const { Gateway, GatewayDest, GatewayProvider } = ReactGateway


  const Controls = props => {
    const { isMaximized, content, actions } = props

    return isMaximized() ? (
      <button onClick={() => {
          actions.restore()
        }}>
        {content.restore}
      </button>
    ) : (
      <button onClick={() => {
          actions.maximize()
        }}>
        {content.maximize}
      </button>
    )
  }


  const contentShape =  { maximize: PropTypes.any.isRequired
                        , restore: PropTypes.any.isRequired
                        }
  const propTypes = { children: PropTypes.func.isRequired
                    , style: PropTypes.object.isRequired
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

  return class Maximize extends Component {
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    constructor(props) {
      super(props)
      this.state =  { maximized: []
                    , containers: []
                    , isMaximized: false
                    , containerClass: null
                    , containerStyle: null
                    , lastScroll: { x: 0, y: 0 }
                    }
      this.containers = []
    }
    componentDidMount() {
      this.parentNode = this.gateway.parentNode
    }
    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
    /*
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
    */
    render() {
      const { children, backgroundStyle, style, className, styles } = this.props
      const { isMaximized, containerClass, containerStyle, maximized } = this.state

      const container = () => {
        const id = this.containers.length
        this.containers.push(id)
        console.warn(`creating container with ID: ${id}`)
        return props => {
          const gatewayName = `${id}-page`
          const isMaximized = () => maximized.includes(id)
          const actions = { maximize: () => this.setState({ maximized: maximized.concat(id) })
                          , restore: () => this.setState({ maximized: maximized.slice(0, -1) })
                          }
          const controls = (
            <Controls
              isMaximized={isMaximized}
              actions={actions}
              content={this.props.content}
            />
          )

          return (
            <div>
              ID WITH {id}
              <GatewayDest name={gatewayName} />
              <Gateway into={maximized.includes(id) ? 'maximize' : gatewayName}>
                {props.children({ controls })}
              </Gateway>
            </div>
          )
        }
      }

      return (
        <GatewayProvider ref={x => this.gateway=x}>
          <div>
            <div style={{ border: '1px dashed yellow' }}>
              {children({ container })}
            </div>
            <div
                style={{ ...this.props.containerStyle, ...this.props.style, border: '1px dashed red',  display: maximized.length > 0 ? 'block' : 'none' }}
                className={classNames(this.props.styles.maximize, this.props.className)}>
                <div
                  style={this.props.backgroundStyle}
                  //onClick={actions.restore}
                />
                <GatewayDest name="maximize" />
            </div>
          </div>
        </GatewayProvider>
      )
    }
  }
}
