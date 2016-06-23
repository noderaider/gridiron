import solvent from 'solvent'
import gridMonitorButton from './gridMonitorButton'
import shouldPureComponentUpdate from 'react-pure-render/function'
import * as themes from 'redux-devtools-themes'
import { updateScrollTop } from './actions'
import reducer from './reducers'
import debounce from 'lodash.debounce'


const styles =  { container:  { fontFamily: 'monaco, Consolas, Lucida Console, monospace'
                              , position: 'relative'
                              , overflowY: 'hidden'
                              , width: '100%'
                              , height: '100%'
                              , minWidth: 300
                              , direction: 'ltr'
                              }
                , buttonBar:  { textAlign: 'center'
                              , borderBottomWidth: 1
                              , borderBottomStyle: 'solid'
                              , borderColor: 'transparent'
                              , zIndex: 1
                              , display: 'flex'
                              , flexDirection: 'row'
                              }
                , elements: { position: 'absolute'
                            , left: 0
                            , right: 0
                            , top: 38
                            , bottom: 0
                            , overflowX: 'hidden'
                            , overflowY: 'auto'
                            }
                }


export default function gridMonitor (deps) {
  const { React, ActionCreators } = solvent({ React: 'object'
                                            , ActionCreators: 'object'
                                            })(deps)
  const { PropTypes, Component } = React

  const { reset, rollback, commit, sweep, toggleAction } = ActionCreators

  const GridMonitorButton = gridMonitorButton(deps)

  return class GridMonitor extends Component {
    static update = reducer;

    static propTypes =  { dispatch: PropTypes.func
                        , computedStates: PropTypes.array
                        , actionsById: PropTypes.object
                        , stagedActionIds: PropTypes.array
                        , skippedActionIds: PropTypes.array
                        , monitorState: PropTypes.shape({ initialScrollTop: PropTypes.number })
                        , preserveScrollTop: PropTypes.bool
                        , select: PropTypes.func.isRequired
                        , theme: PropTypes.oneOfType( [ PropTypes.object
                                                      , PropTypes.string
                                                      ] )
                        , expandActionRoot: PropTypes.bool
                        , expandStateRoot: PropTypes.bool
                        };

    static defaultProps = { select: (state) => state
                          , theme: 'nicinabox'
                          , preserveScrollTop: true
                          , expandActionRoot: true
                          , expandStateRoot: true
                          };

    shouldComponentUpdate = shouldPureComponentUpdate;

    updateScrollTop = debounce(() => {
      const node = this.refs.container
      this.props.dispatch(updateScrollTop(node ? node.scrollTop : 0))
    }, 500);

    scroll() {
      const node = this.refs.container
      if (!node) {
        return
      }
      if (this.scrollDown) {
        const { offsetHeight, scrollHeight } = node
        node.scrollTop = scrollHeight - offsetHeight
        this.scrollDown = false
      }
    }

    componentDidMount() {
      const node = this.refs.container
      if (!node || !this.props.monitorState) {
        return
      }

      if (this.props.preserveScrollTop) {
        node.scrollTop = this.props.monitorState.initialScrollTop
        node.addEventListener('scroll', this.updateScrollTop)
      } else {
        this.scrollDown = true
        this.scroll()
      }
    }

    componentWillUnmount() {
      const node = this.refs.container
      if (node && this.props.preserveScrollTop) {
        node.removeEventListener('scroll', this.updateScrollTop)
      }
    }

    componentWillReceiveProps(nextProps) {
      const node = this.refs.container
      if (!node) {
        this.scrollDown = true
      } else if (
        this.props.stagedActionIds.length <
        nextProps.stagedActionIds.length
      ) {
        const { scrollTop, offsetHeight, scrollHeight } = node

        this.scrollDown = Math.abs(
          scrollHeight - (scrollTop + offsetHeight)
        ) < 20
      } else {
        this.scrollDown = false
      }
    }

    componentDidUpdate() {
      this.scroll()
    }

    handleRollback = () => this.props.dispatch(rollback());
    handleSweep = () => this.props.dispatch(sweep());
    handleCommit = () => this.props.dispatch(commit());
    handleToggleAction = id => this.props.dispatch(toggleAction(id));
    handleReset = () => this.props.dispatch(reset());

    getTheme = () => {
      let { theme } = this.props
      if (typeof theme !== 'string') {
        return theme
      }

      if (typeof themes[theme] !== 'undefined') {
        return themes[theme]
      }

      console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox')
      return themes.nicinabox
    };

    render() {
      const theme = this.getTheme()
      const {
        actionsById,
        skippedActionIds,
        stagedActionIds,
        computedStates,
        select,
        expandActionRoot,
        expandStateRoot
        } = this.props

      const entryListProps =  { theme
                              , actionsById
                              , skippedActionIds
                              , stagedActionIds
                              , computedStates
                              , select
                              , expandActionRoot
                              , expandStateRoot
                              , onActionClick: this.handleToggleAction
                              }

      return (
        <div style={{ ...styles.container, backgroundColor: theme.base00 }}>
          <div style={{ ...styles.buttonBar, borderColor: theme.base02 }}>
            <GridMonitorButton
              theme={theme}
              onClick={this.handleReset}
              enabled>
              Reset
            </GridMonitorButton>
            <GridMonitorButton
              theme={theme}
              onClick={this.handleRollback}
              enabled={computedStates.length > 1}>
              Revert
            </GridMonitorButton>
            <GridMonitorButton
              theme={theme}
              onClick={this.handleSweep}
              enabled={skippedActionIds.length > 0}>
              Sweep
            </GridMonitorButton>
            <GridMonitorButton
              theme={theme}
              onClick={this.handleCommit}
              enabled={computedStates.length > 1}>
              Commit
            </GridMonitorButton>
          </div>
          <div style={styles.elements} ref='container'>
            GRID GOES HERE
          {/*
            <GridMonitorEntryList {...entryListProps} />
          */}
          </div>
        </div>
      )
    }
  }

}
