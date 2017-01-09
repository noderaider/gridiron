import Immutable from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers } from 'redux'
import { thunk, createLogger } from 'redux-middleware'

import { middleware as idle, actions as idleActions } from '../modules/redux-idle-monitor'
import { streamData } from '../actions/data'
import * as reducers from '../reducers'


export default function configureStore(history, initialState) {
  const reducer = combineReducers(reducers)
  const middlewares = [ thunk
                      , routerMiddleware(history)
                      , idle
                      , createLogger({ logger: console })
                      ]
  const enhancer = compose( applyMiddleware(...middlewares)
                          , typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
                          )
  const store = createStore(reducer, initialState, enhancer)

  if(typeof window === 'object')
    store.dispatch(streamData([ 'openflights', 'airlines' ]))
  if(module.hot)
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default))
  return store
}
