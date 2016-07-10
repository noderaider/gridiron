import Promise from 'bluebird'
import classNames from 'classnames'
import solvent from 'solvent'
import container from './container'
import { requestFullscreen, exitFullscreen } from '../utils/fullscreen'
const should = require('chai').should()

export default function maximize (deps = {}, defaults = {}) {
  const { React, ReactDOM, ReactGateway, shallowCompare } = solvent({ React: 'object', ReactDOM: 'object', ReactGateway: 'object', shallowCompare: 'function' })(deps)
  const { Component, PropTypes, cloneElement } = React
  const { Gateway, GatewayDest, GatewayProvider } = ReactGateway

  const Container = container(deps, defaults)


  const contentShape =  { maximize: PropTypes.any.isRequired
                        , restore: PropTypes.any.isRequired
                        }
  const propTypes = { children: PropTypes.any.isRequired
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


  class Maximize extends Component {
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
      return true
      //return shallowCompare(this, nextProps, nextState)
    }

    container = children => {
      return (
        <Container
          id={(N => Array(N+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, N))(5)}
          maximize={id => new Promise((resolve, reject) => {
            console.info('MAXIMIZING', id)
            this.setState({ containers: this.state.containers.concat(id) }, () => resolve())
          })}
          restore={id => new Promise((resolve, reject) => {
            const { containers } = this.state
            const index = containers.indexOf(id)
            index.should.be.at.least(0, `${id} does not exist in the list of state containers => ${JSON.stringify(containers)}`)

            const newContainers = [ ...containers.slice(0, index), ...containers.slice(index + 1) ]
            console.info('CONTAINER UNREGISTERED', index, id, containers, newContainers)
            this.setState({ containers: newContainers }, () => resolve())
          })}
        >
          {children}
        </Container>
      )
    };
    render() {
      const { children, containerClass, containerStyle, backgroundStyle, style, className, styles } = this.props
      const { containers } = this.state

      return (
        <GatewayProvider ref={x => this.gateway=x}>
          <div>
            <div>
              {children(this.container)}
            </div>

            <div ref={x => this.fullscreen=x}>
              {this.state.containers.map((x, i) => {
                const destName = `maximize-${x}`
                return (
                  <div
                    key={i}
                    style={{ ...containerStyle, ...style, top: 0 }}
                    className={classNames(styles.maximize, className)}
                  >
                    <div
                      style={backgroundStyle}
                      //onClick={actions.restore}
                    />
                    <GatewayDest name={destName} />
                  </div>
                )
              })}
            </div>
          </div>
        </GatewayProvider>
      )
    }
  }

  return Maximize
}
