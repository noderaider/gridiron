import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers } from 'redux'
import { thunk } from 'redux-middleware'

import { middleware as idle, actions as idleActions } from '../modules/redux-idle-monitor'
import subscribeStore from './subscribeStore'
import * as reducers from '../reducers'

export default function configureStore(history, initialState) {
  const reducer = combineReducers(reducers)
  const middlewares = [ thunk
                      , routerMiddleware(history)
                      , idle
                      ]
  const enhancer = applyMiddleware(...middlewares)
  const store = createStore(reducer, initialState, enhancer)
  const unsubscribe = subscribeStore(store)
  if(IS_BROWSER)
    store.dispatch(idleActions.start())
  return store
}
