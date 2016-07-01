import classNames from 'classnames'
import solvent from 'solvent'

export default function minimize(deps = {}, defaults = {}) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  return class Minimize extends Component {
    static propTypes =  { children: PropTypes.func.isRequired
                        , style: PropTypes.object.isRequired
                        , className: PropTypes.string.isRequired
                        , styles: PropTypes.object.isRequired
                        , containerStyle: PropTypes.object.isRequired
                        , backgroundStyle: PropTypes.object.isRequired
                        , maximizeContent: PropTypes.object.isRequired
                        , compressContent: PropTypes.object.isRequired
                        , maximizeDelay: PropTypes.number.isRequired
                        , compressDelay: PropTypes.number.isRequired
                        };
    static defaultProps = { styles: { maximize: 'maximize'
                                    , compress: 'compress'
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
                          , compressContent: <i className={'fa fa-compress'} />
                          , maximizeDelay: 200
                          , compressDelay: 200
                          , ...defaults
                          };
    constructor(props) {
      super(props)
      this.state =  { isMaximized: false
                    , containerClass: null
                    , containerStyle: null
                    , lastScroll: { x: 0, y: 0 }
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
    render() {
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
            onClick={() => isMaximized ? this.compress() : null}
          />
          {this.renderChildren()}
        </div>
      )
    }
    maximize = () => {
      const { styles, containerStyle, maximizeDelay } = this.props
      document.body.appendChild(this.container)
      this.setState({ isMaximized: true, containerClass: styles.maximize, containerStyle })
      setTimeout(() => this.setState({ containerClass: null }), maximizeDelay)
    };
    compress = () => {
      const { styles, compressDelay } = this.props
      this.setState({ containerClass: styles.compress })
      setTimeout(() => {
        this.parentNode.appendChild(this.container)
        this.setState({ isMaximized: false, containerClass: null, containerStyle: null })
      }, compressDelay)
    };
    renderChildren = () => {
      const { children, maximizeContent, compressContent, styles } = this.props
      const { isMaximized } = this.state
      const Controls = props => isMaximized ? (
        <button onClick={this.compress}>
          {compressContent}
        </button>
      ) : (
        <button onClick={this.maximize}>
          {maximizeContent}
        </button>
      )
      let childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' }
      return <div style={childrenStyle} className={styles.maximizeChildren}>{children({ Controls })}</div>
    };
  }
}
