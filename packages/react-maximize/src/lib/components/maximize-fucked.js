import Promise from 'bluebird'
import classNames from 'classnames'
import solvent from 'solvent'

export default function maximize (deps = {}, defaults = {}) {
  const { React, ReactDOM, shallowCompare, CSSPropertyOperations } = solvent({ React: 'object', ReactDOM: 'object', shallowCompare: 'function', CSSPropertyOperations: 'function' })(deps)
  const { Component, PropTypes, cloneElement } = React

  const KEYCODES = { ESCAPE: 27 }

  class Portal extends Component {

    constructor() {
      super()
      this.state = { active: false }
      this.handleWrapperClick = this.handleWrapperClick.bind(this)
      this.closePortal = this.closePortal.bind(this)
      this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this)
      this.handleKeydown = this.handleKeydown.bind(this)
      this.portal = null
      this.node = null
    }

    componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown)
      }

      if (this.props.closeOnOutsideClick) {
        document.addEventListener('mouseup', this.handleOutsideMouseClick)
        document.addEventListener('touchstart', this.handleOutsideMouseClick)
      }

      if (this.props.isOpened) {
        this.openPortal()
      }
    }

    componentWillReceiveProps(newProps) {
      // portal's 'is open' state is handled through the prop isOpened
      if (typeof newProps.isOpened !== 'undefined') {
        if (newProps.isOpened) {
          if (this.state.active) {
            this.renderPortal(newProps)
          } else {
            this.openPortal(newProps)
          }
        }
        if (!newProps.isOpened && this.state.active) {
          this.closePortal()
        }
      }

      // portal handles its own 'is open' state
      if (typeof newProps.isOpened === 'undefined' && this.state.active) {
        this.renderPortal(newProps)
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown)
      }

      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('mouseup', this.handleOutsideMouseClick)
        document.removeEventListener('touchstart', this.handleOutsideMouseClick)
      }

      this.closePortal(true)
    }

    handleWrapperClick(e) {
      e.preventDefault()
      e.stopPropagation()
      if (this.state.active) { return }
      this.openPortal()
    }

    openPortal(props = this.props) {
      this.setState({ active: true })
      this.renderPortal(props)
      this.props.onOpen(this.node)
    }

    closePortal(isUnmounted = false) {
      const resetPortalState = () => {
        if (this.node) {
          ReactDOM.unmountComponentAtNode(this.node)
          document.body.removeChild(this.node)
        }
        this.portal = null
        this.node = null
        if (isUnmounted !== true) {
          this.setState({ active: false })
        }
      }

      if (this.state.active) {
        if (this.props.beforeClose) {
          this.props.beforeClose(this.node, resetPortalState)
        } else {
          resetPortalState()
        }

        this.props.onClose()
      }
    }

    handleOutsideMouseClick(e) {
      if (!this.state.active) { return }

      const root = findDOMNode(this.portal)
      if (root.contains(e.target) || (e.button && e.button !== 0)) { return }

      e.stopPropagation()
      this.closePortal()
    }

    handleKeydown(e) {
      if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
        this.closePortal()
      }
    }

    applyClassNameAndStyle(props) {
      if (props.className) {
        this.node.className = props.className
      }
      if (props.style) {
        // React 15.1.0+ requires third parameter in debug mode
        /* eslint-disable no-underscore-dangle */
        CSSPropertyOperations.setValueForStyles(this.node,
                                                props.style,
                                                this._reactInternalInstance)
        /* eslint-enable no-underscore-dangle */
      }
    }

    renderPortal(props) {
      if (!this.node) {
        this.node = document.createElement('div')
        // apply CSS before the node is added to the DOM to avoid needless reflows
        this.applyClassNameAndStyle(props)
        document.body.appendChild(this.node)
      } else {
        // update CSS when new props arrive
        this.applyClassNameAndStyle(props)
      }
      this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.cloneElement(props.children, { closePortal: this.closePortal }),
        this.node,
        this.props.onUpdate
      )
    }

    render() {
      if (this.props.openByClickOn) {
        return React.cloneElement(this.props.openByClickOn, { onClick: this.handleWrapperClick })
      }
      return null
    }
  }

  Portal.propTypes =  { className: PropTypes.string
                      , style: PropTypes.object
                      , children: PropTypes.element.isRequired
                      , openByClickOn: PropTypes.element
                      , closeOnEsc: PropTypes.bool
                      , closeOnOutsideClick: PropTypes.bool
                      , isOpened: PropTypes.bool
                      , onOpen: PropTypes.func
                      , onClose: PropTypes.func
                      , beforeClose: PropTypes.func
                      , onUpdate: PropTypes.func
                      }

  Portal.defaultProps = { onOpen: () => {}
                        , onClose: () => {}
                        , onUpdate: () => {}
                        }

  class Controls extends Component {
    constructor(props) {
      super(props)
      this.state = { isMaximized: false }
    }
    render() {
      const { content, actions } = this.props
      const { isMaximized } = this.state
      console.info('IS MAXIMIZED', isMaximized)

      return isMaximized ? (
        <button onClick={() => {
            console.warn('RESTORE')
            actions.restore()
            this.setState({ isMaximized: false })
          }}>
          {content.restore}
        </button>
      ) : (
        <button onClick={() => {
            console.warn('MAXIMIZE')
            actions.maximize()
            this.setState({ isMaximized: true })
          }}>
          {content.maximize}
        </button>
      )
    }
  }

  class Container extends Component {
    constructor(props) {
      super(props)
      //this.state = { isMaximized: props.isMaximized() }
      this.state = { mounted: false }
    }
    componentDidMount() {
      console.info('MOUNTED')
      this.setState({ mounted: true })
    }
    componentWillUnmount() {
      console.info('UNMOUNTED')
      this.setState({ mounted: false })
    }
    render() {
      const { children } = this.props
      console.warn('CHILDREN', children)
      return <div ref={x => this.internalRef=x}>{children}</div>
    }
    reference = () => new Promise((resolve, reject) => {
        if(this.mounted)
          return resolve(this)
        else {
          const intervalID = setInterval(() => {
            if(this.mounted) {
              clearInterval(intervalID)
              resolve(this)
            }
          }, 200)
        }
    });
    update = () => {
      this.forceUpdate()
    };
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
      const { children, maximizeContent, restoreContent, styles } = this.props
      const { isMaximized } = this.state

      const childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' }

      const containerStyle =  { border: '2px solid black'
                              , display: 'flex'
                              , flexDirection: 'column'
                              , margin: 0
                              , padding: 0
                              }

      const content = children({ container: (id, getContent) => {
          if(this.containers.has(id)) {
            /*
            if(this.state.maximized.includes(id))
              return null
            else {
              */
              return (
                <Portal isOpened={true}>
                <div ref={x => {
                  const obj = this.containers.get(id)
                  const container = obj.container
                  console.warn('CURRENT', current)
                  //current.forceUpdate()
                  current.reference().then(ref => {
                    x.appendChild(ref)
                  })
                }} />
                </Portal>
              )
            //}
          } else
            return this.createContainer(id, getContent)
        }
      })


      return (
        <div ref={x => this.container=x}>
          <div key="root" style={{ border: '1px dashed yellow' }}>
            {content}
          </div>
          {this.state.maximized.length > 0 ? this.state.maximized.map(id => {
            const { actions, container } = this.containers.get(id)
            return (
              <div key={id}
                ref={x => {
                  console.warn('MAXIMIZED APPEND', Object.keys(container))
                  container.reference().then(ref => {
                    console.info('APPENDING', container)
                    x.appendChild(ref)
                    container.update()
                  })
                  //container.forceUpdate()
                }}
                style={{ ...this.props.containerStyle, ...this.props.style, border: '1px dashed red' }}
                className={classNames(this.props.styles.maximize, this.props.className)}>
                <div
                  style={this.props.backgroundStyle}
                  onClick={actions.restore}
                />
                {/*container*/}
              </div>
            )
          }) : null}
        </div>
      )
    }
    createContainer = (id, getContent) => {
      console.warn(`CREATING CONTAINER => ${id}`)
      const { maximized } = this.state
      const isMaximized = () => this.state.maximized.includes(id)
      const actions = { maximize: () => this.setState({ maximized: maximized.concat(id) })
                      , restore: () => this.setState({ maximized: maximized.slice(0, -1) })
                      }
      const controls = (
        <Controls
          actions={actions}
          content={this.props.content}
        />
      )
      const container = <Container ref={x => {
        console.warn('SETTING CONTAINER', id, actions, x)
        this.containers.set(id, { actions, container: x })
      }}>{getContent({ controls })}</Container>
      //this.containers.set(id, { actions, container })
      //const container = <Container ref={x => this.containers.set(id, { actions, container: x })} isMaximized={isMaximized}>{getContent({ controls })}</Container>
      console.info('CONTAINER', container)
      return container
    };
  }

}
