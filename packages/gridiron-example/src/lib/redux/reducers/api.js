import Immutable from 'immutable'
import  { CLEAR_DATA
        , FETCH_DATA
        , RECEIVE_DATA
        , KEYED_DATA
        , AUTHORIZE_MIDDLEWARE
        , RECEIVE_AUTHORIZE_IDENTITY
        , RECEIVE_REFRESH_IDENTITY
        , RECEIVE_IMPERSONATE_IDENTITY
        } from '../constants'

function entities(state = Immutable.Map(), action = {}) {
  const { type, payload, error } = action
  if(error || !payload)
    return state
  const { apiName, actionName, actionKey, data } = payload
  switch(type) {
    case KEYED_DATA:
      return state.setIn([apiName, actionKey], data)
    case RECEIVE_DATA:
      return state.setIn([apiName, actionName], data)
    case CLEAR_DATA:
      return state.deleteIn([apiName, actionName])
  }
  return state
}

function isFetching(state = Immutable.Map(), action = {}) {
  const { type, payload, error } = action
  if(!type || !payload)
    return state
  const { apiName, actionName, actionKey, inputData, data } = payload
  switch(type) {
    case FETCH_DATA:
      return state.setIn([apiName, actionName], !error)
    case RECEIVE_DATA:
    case CLEAR_DATA:
      return state.setIn([apiName, actionName], false)
    case KEYED_DATA:
      return state.setIn([apiName, actionKey], false)
  }
  return state
}

export const initialState = { entities: entities()
                            , isFetching: isFetching()
                            }

export default function api(state = initialState, action) {
  const { type, payload, error } = action
  switch(type) {
    case FETCH_DATA:
      return Object.assign({}, state, { isFetching: isFetching(state.isFetching, action) })
    case RECEIVE_DATA:
    case KEYED_DATA:
    case CLEAR_DATA:
      return Object.assign({}, state, { entities: entities(state.entities, action)
                                      , isFetching: isFetching(state.isFetching, action)
                                      })
  }
  return state
}
