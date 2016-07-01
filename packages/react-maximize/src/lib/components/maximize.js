import classNames from 'classnames'
import solvent from 'solvent'

export default function maximize (deps = {}, defaults = {}) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes, cloneElement } = React

  return class Maximize extends Component {
    static propTypes =  { children: PropTypes.func.isRequired
                        , style: PropTypes.object.isRequired
                        , className: PropTypes.string.isRequired
                        , styles: PropTypes.object.isRequired
                        , containerStyle: PropTypes.object.isRequired
                        , backgroundStyle: PropTypes.object.isRequired
                        , maximizeContent: PropTypes.object.isRequired
                        , restoreContent: PropTypes.object.isRequired
                        , maximizeDelay: PropTypes.number.isRequired
                        , restoreDelay: PropTypes.number.isRequired
                        };
    static defaultProps = { styles: { maximize: 'maximize'
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
                          , maximizeContent: <i className={'fa fa-expand'} />
                          , restoreContent: <i className={'fa fa-compress'} />
                          , maximizeDelay: 200
                          , restoreDelay: 200
                          , zIndexMin: 100
                          , ...defaults
                          };
    constructor(props) {
      super(props)
      this.containers = new Map()
      this.state =  { isMaximized: false
                    , containerClass: null
                    , containerStyle: null
                    , lastScroll: { x: 0, y: 0 }
                    , maximized: []
                    }
    }
    componentDidMount() {
      this.parentNode = this.container.parentNode
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
    renderBlah() {
      const { children, backgroundStyle, style, className, styles } = this.props
      const { isMaximized, containerClass, containerStyle } = this.state

      return (
        <div
          ref={x => this.container = x}
          className={classNames(className, containerClass)}
          style={{ style, ...containerStyle }}
        >
          <div
            style={isMaximized ? backgroundStyle : { display: 'none' }}
            onClick={() => isMaximized ? this.restore() : null}
          />
          {this.renderChildren()}
        </div>
      )
    }
    maximize = (id) => {
      const { styles, containerStyle, maximizeDelay } = this.props
      document.body.appendChild(this.container)
      this.setState({ isMaximized: true, containerClass: styles.maximize, containerStyle })
      setTimeout(() => this.setState({ containerClass: null }), maximizeDelay)
    };
    restore = (id) => {
      const { styles, restoreDelay } = this.props
      this.setState({ containerClass: styles.restore })
      setTimeout(() => {
        this.parentNode.appendChild(this.container)
        this.setState({ isMaximized: false, containerClass: null, containerStyle: null })
      }, restoreDelay)
    };
    render() {
      const { children, maximizeContent, restoreContent, styles } = this.props
      const { isMaximized } = this.state

      const childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' }
      const Container = props => {
        const id = this.containers.size
        const getState = () => this.containers.get(id)
        const isMaximized = () => this.state.maximized.includes(id)
        const maximize = () => this.setState({ maximized: this.state.maximized.concat(id) })
        const restore = () => this.setState({ maximized: this.state.maximized.slice(0, -1) })
        const actions = { maximize, restore, isMaximized }

        const Controls = props => isMaximized() ? (
          <button onClick={actions.restore}>
            {restoreContent}
          </button>
        ) : (
          <button onClick={actions.maximize}>
            {maximizeContent}
          </button>
        )

        const child = props.children({ Controls })
        this.containers.set(id, { actions, child })
        return !isMaximized() || props.maximized ? child : null
      }
      /*
      Container.propTypes = { id: PropTypes.number.isRequired
                            , mirror: PropTypes.bool.isRequired
                            }
      Container.defaultProps =  { mirror: false
                                }

*/
      const containerStyle =  { border: '2px solid black'
                              , display: 'flex'
                              , flexDirection: 'column'
                              , margin: 0
                              , padding: 0
                              }

      const content = children({  })

      return (
        <div ref={x => this.container=x}>
          <div key="root" style={{ border: '1px dashed yellow' }}>
            {Content}
          </div>
          {this.state.maximized.length > 0 ? this.state.maximized.map(id => {
            const { actions, child } = this.containers.get(id)
            return (
              <div key={id}
                style={{ ...this.props.containerStyle, ...this.props.style }}
                className={classNames(this.props.styles.maximize, this.props.className)}>
                <div
                  style={this.props.backgroundStyle}
                  onClick={actions.restore}
                />
                {child}
              </div>
            )
          }) : null}
        </div>
      )
    }
  }
  /*
  renderContent = () => {

  }
  */
}
