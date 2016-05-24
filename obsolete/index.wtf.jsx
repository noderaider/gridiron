import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStateBisector } from 'redux-mux'
import { assert } from 'chai'
import { GriddleView, DefaultModules } from 'griddle-overhaul-react'

const IS_DEV = process.env.NODE_ENV !== 'production'
const ROOT_STATE_KEY = 'griddle'


class Griddle extends Component {
  static propTypes =  { context: PropTypes.object.isRequired
                      , dataKey: PropTypes.string.isRequired
                      };
  static defaultProps = { dataKey: 'visibleData' };

  componentWillMount() { this.loadData() }
  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data)
      this.loadData(nextProps)
  }

  loadData = () => {
    const { dispatch, data, columns, ignoredColumns, children } = this.props
    const allColumns = data && data.length > 0 ? Object.keys(data[0]) : []
    const properties = PropertyHelper.propertiesToJS( { rowProperties: children
                                                      , defaultColumns: columns
                                                      , ignoredColumns
                                                      , allColumns
                                                      } )

    dispatch(initializeGrid(properties))
    if(props.data)
      dispatch(loadData(data))
  };

  render() {
    const { actionCreators, dataKey, data, columns, ignoredColumns, children } = this.props
    return (
      <GriddleView
        {...actionCreators}
        dataKey={dataKey}
        data={griddle[dataKey]}
        columns={columns}
        ignoredColumns={ignoredColumns}
        children={children}
      />
    )
  }
}

const bisectState = createStateBisector(ROOT_STATE_KEY)

const mapGriddleStateToProps = (state, ownProps) => {
  const { context } = ownProps
  if(IS_DEV) assert.ok(context, 'griddle component must have context prop specified')
  const { id } = context
  if(IS_DEV) assert.ok(id, 'griddle context must have id prop specified')
    console.dir({ state, id })
  const { data, columns, ignoredColumns, children } = bisectState(id)(state)
  //const actionCreators = bindActionCreators(actions, dispatch)
  return { data, columns, ignoredColumns, children }
}

export default connect(mapGriddleStateToProps)(Griddle)



export const griddleConfig = defs => {
  const defMap = new Map(defs)
  return  { get ids() { return Array.from(defMap.keys()) }
          , get configs() { return Array.from(defMap.values()).map(x => x.plugins) }
          , context: id => ({ ...defMap.get(id), id })
          }
}


const coreReducer = (state, action) => {
  return state
}

export const contextReducer = context => {
  /** Destructure reducer plugin middlewares and append with the core griddle reducer */
  const [firstMiddleware, ...nextMiddlewares] = context.plugins.map(x => x.reducerMiddleware).concat([coreReducer])
  if(IS_DEV) assert(typeof firstMiddleware === 'function', 'must be at least one middleware defined')
  /** Reduce reducer middlewares to a single reducer with coreReducer at the center */
  return nextMiddlewares.reduce((current, next, i) => {
    const newReducer = current(next)
    return newReducer
  }, firstMiddleware)
}

export const griddleReducer = config => {
  console.dir(config)
  const ids = config.ids
  return (state = {}, action = {}) => {
    // TODO: SHORTCIRCUIT HERE
    return ids.reduce((prevState, id) => {
      let context = config.context(id)
      return Object.assign({}, prevState, { [id]: contextReducer(context)(state[id], action) || { id } })
    }, state)
  }
}



/** PLUGINS */
const createPluginContext = id => ({ name: `griddle-plugin-${id.toLowerCase()}` })
const identityReducerMiddleware = next => (state, action) => next(state, action)
const createLogReducerMiddleware = pluginContext => next => (state, action) => {
  const { name } = pluginContext
  console.info(`${name} pre-reducer =>`, { state, action })
  const newState = next(state, action)
  console.info(`${name} post-reducer =>`, { state: newState, action })
  return newState
}

export const griddlePlugin = (id, createReducerMiddleware) => {
  const pluginContext = createPluginContext(id)
  if(!createReducerMiddleware)
    createReducerMiddleware = IS_DEV ? createLogReducerMiddleware : () => identityReducerMiddleware
  const reducerMiddleware = createReducerMiddleware(pluginContext)
  return  { pluginContext
          , reducerMiddleware
          }
}
/** END PLUGINS */
