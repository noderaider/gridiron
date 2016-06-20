import Immutable from 'immutable'
import  { CLEAR_ERRORS
        , DISMISS_ERROR
        , FETCH_DATA
        , RECEIVE_DATA
        , KEYED_DATA
        , CLEAR_DATA
        , AUTHORIZE_MIDDLEWARE
        , RECEIVE_AUTHORIZE_IDENTITY
        , RECEIVE_REFRESH_IDENTITY
        , RECEIVE_IMPERSONATE_IDENTITY
        , FETCH_IDENTITY
        , SET_IDENTITY
        , FORGET_TOKENS
        , FORGET_FINGERPRINT
        , IDENTITY_INVALID
        , IDENTITY_EXPIRED
        } from '../constants'

export default function errors(state = Immutable.fromJS({ api: [], identity: [] }), action = {}) {
  const { type, payload, error } = action

  // HANDLE NON ERRORS
  if(!error) {
    switch(type) {
      case DISMISS_ERROR:
        const { category, id } = payload
        return state.deleteIn([category, id])
      case CLEAR_ERRORS:
      case RECEIVE_AUTHORIZE_IDENTITY:
      case RECEIVE_REFRESH_IDENTITY:
      case RECEIVE_IMPERSONATE_IDENTITY:
      case SET_IDENTITY:
        return Immutable.fromJS({ api: [], identity: [] })
      case FETCH_DATA:
        return state.set('identity', Immutable.List())
    }
    return state
  }

  const err = payload ? payload : new Error('Unknown Error')

  // HANDLE ERRORS
  switch(type) {
    case AUTHORIZE_MIDDLEWARE:
    case DISMISS_ERROR:
    case RECEIVE_AUTHORIZE_IDENTITY:
    case RECEIVE_REFRESH_IDENTITY:
    case RECEIVE_IMPERSONATE_IDENTITY:
    case FETCH_DATA:
    case RECEIVE_DATA:
    case KEYED_DATA:
    case CLEAR_DATA:
      return state.update('api', x => x.unshift(err))
    case FETCH_IDENTITY:
    case SET_IDENTITY:
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    case IDENTITY_EXPIRED:
    case AUTHORIZE_MIDDLEWARE:
      return state.update('identity', x => x.unshift(err))
  }
  return state
}
