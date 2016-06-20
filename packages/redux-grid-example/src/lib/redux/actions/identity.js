import { assert } from 'chai'
import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'
import jwtSimple from 'jwt-simple'
import  { FORGET_TOKENS
        , FORGOTTEN_TOKENS
        , FORGET_FINGERPRINT
        , FORGOTTEN_FINGERPRINT
        , FETCH_IDENTITY
        , SET_IDENTITY
        , PERSISTED_TOKENS
        , PERSISTED_FINGERPRINT
        , POST_AUTHORIZE
        , POST_AUTHORIZE_ADMIN
        , IDENTITY_INVALID
        , IDENTITY_EXPIRED
        , RECEIVE_COOKIES
        } from '../constants'

import { client, log, noop, IS_DEV } from '../../../config'
import { apiAction } from './api'
import IdentityError from '../../errors/IdentityError'
import persistence from '../../services/persistence'
import { goToPath } from '../../services/location'
import { getClaim, getTixClaim } from '../../services/claims'

const { saveState, loadState, removeState } = persistence()
const getPersisted = () => loadState(['tokens', 'fingerprint'])


const { clientId } = client

export const fetchIdentity = createAction(FETCH_IDENTITY)
export const setIdentity = createAction(SET_IDENTITY)
export const forgetTokens = createAction(FORGET_TOKENS)

export const authorized = (accessToken, refreshToken, decodedToken) => (dispatch, getState) => {
  const state = getState()
  if(!state.identity.isAuthorized || (state.identity.tokens.access !== accessToken && state.identity.tokens.refresh !== refreshToken)) {
    dispatch(setIdentity({ tokens: { access: accessToken, refresh: refreshToken }, decodedToken }))
  }
}

const getDecodedToken = accessToken => jwtSimple.decode(accessToken, null, true)

const getCookieData = () => {
  const { tokens, fingerprint } = getPersisted()
  const [accessToken, refreshToken] = tokens || []
  //TODO: THIS MAY HAVE ISSUES IF FINGERPRINT ISNT GETTING SYNCED QUICKLY
  //const decodedToken = getDecodedToken(accessToken)
  //const fingerprint = getTixClaim(decodedToken, 'fingerprint')
  return  { accessToken
          , refreshToken
          , fingerprint
          , subject: accessToken ? getClaim(getDecodedToken(accessToken), 'sub') : noop()
          }
}

const identityApi = (apiPath, args, {  genericError, successRedirect } = {}) => {
  if(IS_DEV) {
    assert.ok(apiPath, 'apiPath is required')
    assert.isArray(apiPath)
    assert.lengthOf(apiPath, 2)
    assert.ok(args, 'args are required')
    assert.typeOf(args, 'object')
  }
  return (dispatch, getState) => {
    return dispatch(apiAction(apiPath, args))
      .then(response => {
        if(response.error)
          throw new IdentityError(`Unable to authorize => ${JSON.stringify(response)}`)
        if(typeof response === 'string' && response.includes('AllowOneTime')) {
          const code = response.split('|')[1]
          return dispatch(push(`/identity/maintenance/migrate/${code}`))
        }
        if(successRedirect) {
          let newState = getState()
          if(newState.identity.isAuthorized) {
            if(typeof successRedirect === 'function') {
              const redirectPath = successRedirect(newState)
              if(typeof redirectPath === 'string')
                goToPath(redirectPath, true)
            } else if(typeof successRedirect === 'string')
              goToPath(successRedirect, true)
          }
        }
      })
      .catch(err => {
        if(genericError)
          dispatch(setIdentity(new IdentityError(typeof genericError === 'function' ? genericError(err) : genericError, err)))
      })
  }
}

export const authorizeIdentity = ({username, password, rememberMe = false}, successRedirect) => {
  if(IS_DEV) {
    assert.ok(username, 'username is required')
    assert.ok(password, 'password is required')
  }
  return (dispatch, getState) => {
    const { fingerprint } = getCookieData()
    const args = { username, password, rememberMe, clientId, fingerprint }
    const continuation = { successRedirect, genericError: 'Username and password were incorrect.' }
    return dispatch(identityApi(['identity', 'authorize'], args, continuation))
  }
}


export const refreshIdentity = () => {
  return (dispatch, getState) => {
    const { accessToken, refreshToken, fingerprint, subject } = getCookieData()
    if(IS_DEV) assert.ok(refreshToken, 'refreshToken is required')
    const args =  { refreshToken, fingerprint, subject, clientId }
    const continuation = { genericError: 'Error occurred while refreshing identity.' }
    return dispatch(identityApi(['identity', 'refresh'], args, continuation))
  }
}

export const impersonateIdentity = ({ organizationId, userId }) => {
  if(IS_DEV) assert.ok(organizationId || userId, 'must specify organizationId or userId to impersonate')
  return (dispatch, getState) => {
    const { accessToken, refreshToken, fingerprint, subject } = getCookieData()
    if(IS_DEV) {
      assert.ok(refreshToken, 'refreshToken is required for impersonate')
      assert.ok(subject, 'subject is required for impersonate')
    }
    const args = { organizationId, userId, fingerprint, subject, refreshToken, clientId }
    const continuation = { genericError: 'Error occurred while impersonating identity.' }
    return dispatch(identityApi(['identity', 'impersonate'], args, continuation))
  }
}


/** Creates an action that auto refreshes JWT tokens using a refresh token and randomized jitter offset time. */
export const createAutoRefresh = ({ getPersisted, jitterMaxMS = 30000 }) => (dispatch, getState) => {
  let { identity } = getState()
  if(!identity.refreshAtMS)
    return (dispatch, getState) => {}
  const jitterMS = Math.floor(Math.random() * jitterMaxMS)
  const refreshMS = (identity.refreshAtMS - jitterMS) - Date.now()

  log.info(`AUTOREFRESH IN ${refreshMS} MS, (JITTER => ${jitterMS})`)
  if(refreshMS < 0) {
    dispatch(refreshIdentity())
    return (dispatch, getState) => {}
  }
  const timeoutID = setTimeout(() => dispatch(refreshIdentity()), refreshMS)
  return (dispatch, getState) => {
    clearTimeout(timeoutID)
    log.debug('AUTOREFRESH CANCELLED')
  }
}

/** Creates an action that synchronizes authorization information across multiple tabs. */
export const createAuthSync = ({ getPersisted, tokenResolver, pollFrequency = 1000 }) => (dispatch, getState) => {
  let intervalID = setInterval(() => {
    const { identity } = getState()
    const stateTokens = identity.tokens

    const cookieTokens = tokenResolver()
    if(!stateTokens) { /** TAB IS NOT AUTHORIZED */
      if(cookieTokens[0]) { /** ANOTHER TAB IS LOGGED IN */
        log.warn({ cookieTokens }, 'DETECTED OTHER TAB AUTHORIZE... SYNCING')
        dispatch(authorized(...cookieTokens))
      }
    } else { // TAB IS AUTHORIZED
      if(!cookieTokens[0] || !cookieTokens[1]) { /** ANOTHER TAB LOGGED OUT */
        log.warn('DETECTED OTHER TAB LOGOUT... FORGETTING')
        dispatch(forgetTokens())
      } else {
        const latest = tokenResolver([stateTokens.access, stateTokens.refresh])
        if(stateTokens.access !== latest[0] || stateTokens.refresh !== latest[1]) {
          log.warn('DETECTED OTHER TAB TOKEN CHANGE WITH NEWER TOKEN... SYNCING')
          dispatch(authorized(...latest))
        }
      }
    }
  }, pollFrequency)
  return () => clearInterval(intervalID)
}
