import Immutable from 'immutable'
import  { FORGET_TOKENS
        , FORGET_FINGERPRINT
        , FETCH_IDENTITY
        , SET_IDENTITY
        , POST_AUTHORIZE
        , POST_AUTHORIZE_ADMIN
        , IDENTITY_INVALID
        , IDENTITY_EXPIRED
        , AUTHORIZE_MIDDLEWARE
        } from '../constants'

const getTixClaimSchema = name => `http://schemas.tix.com/identity/claims/${name}`
const getClaim = (decodedToken, name) => decodedToken[name]
const hasTixClaim = (decodedToken, name, value) => hasClaim(decodedToken, getTixClaimSchema(name), value)
const getTixClaim = (decodedToken, name) => getClaim(decodedToken, getTixClaimSchema(name))
const hasRole = (decodedToken, roleName) => hasClaim(decodedToken, getTixClaimSchema('role'), roleName)
const hasClaim = (decodedToken, name, value) => {
  let claim = getClaim(decodedToken, name)
  // if claim exists but value was not specified, return true
  if (claim && !value)
    return true
  if (claim)
    return Array.isArray(claim) ? claim.indexOf(value) !== -1 : claim === value
}


function tokens(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case SET_IDENTITY:
      if(error || !payload.tokens)
        return null
      return payload.tokens
    case FORGET_TOKENS:
    case IDENTITY_INVALID:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
  }
  return state
}

function fingerprint(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_FINGERPRINT:
      return null
    case SET_IDENTITY:
      if(error)
        return state
      const { decodedToken } = payload
      return getTixClaim(decodedToken, 'fingerprint')
  }
  return state
}


function isFetching(state = false, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FETCH_IDENTITY:
      return true
    case SET_IDENTITY:
      return false
  }
  return state
}

function isAuthorized(state = false, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return false
    case AUTHORIZE_MIDDLEWARE:
      return error ? false : state
    case SET_IDENTITY:
      return error ? false : true
  }
  return state
}

function isAdmin(state = false, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return false
    case AUTHORIZE_MIDDLEWARE:
      return error ? false : state
    case SET_IDENTITY:
      if(error)
        return false
      const { decodedToken } = payload
      const id = getTixClaim(decodedToken, 'actualorganizationid')
      return id === 1
  }
  return state
}

function subject(state = null, action = {}) {
  const { type, payload, error } = action
  if(error)
    return state
  switch(type) {
    case SET_IDENTITY:
      const { decodedToken } = payload
      return getClaim(decodedToken, 'sub')
  }
  return state
}

function user(state = null, action = {}) {
  const { type, payload, error } = action

  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      let fullName = getTixClaim(decodedToken, 'username') // userfullname
      /** Probably should switch this parsing around to return 'userfirstname' and 'userlastname' */
      let sanitizedFullName = fullName ? fullName.trim() : 'Unknown Name'
      let nameParts = sanitizedFullName.split(' ').map(x => x.trim()).filter(x => x && x.length > 0)
      let [ firstName, ...lastNames ] = nameParts
      return  { username: getClaim(decodedToken, 'sub')
              , id: getTixClaim(decodedToken, 'userid')
              , fullName
              , firstName
              , lastName: lastNames.join(' ')
              }
  }
  return state
}

function actualUser(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      return  { username: getTixClaim(decodedToken, 'actualusername') || 'No Actual Username' // 'implement?'
              , id: getTixClaim(decodedToken, 'actualuserid') || 'No Actual User Id'
              , fullName: getTixClaim(decodedToken, 'actualfullName') || 'No Full Name' // 'implement?'
              , firstName: getTixClaim(decodedToken, 'actualfirstname') // 'implement?'
              , lastName: getTixClaim(decodedToken, 'actuallastname') // 'implement?'
              }
  }
  return state
}

function organization(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      return  { id: getTixClaim(decodedToken, 'organizationid')
              , name: getTixClaim(decodedToken, 'organization') // organizationname
              }
  }
  return state
}

function actualOrganization(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      let id = getTixClaim(decodedToken, 'actualorganizationid')
      return  { id
              , name: id === 1 ? 'Tix' : getTixClaim(decodedToken, 'organization') // actualorganizationname
              }
  }
  return state
}

const getTimeoutMS = timeoutMinutes => timeoutMinutes * 60000
const defaultTimeoutMS = getTimeoutMS(120)
/** Sliding session timeout from any point in time */
function timeoutMS(state = defaultTimeoutMS, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return defaultTimeoutMS
    case AUTHORIZE_MIDDLEWARE:
      return error ? defaultTimeoutMS : state
    case SET_IDENTITY:
      if(error)
        return defaultTimeoutMS
      const { decodedToken } = payload
      return getTimeoutMS(getTixClaim(decodedToken, 'timeout'))
  }
  return state
}

const inactiveWindowMS = 30000
const getInactiveMS = timeoutMinutes => timeoutMinutes * 60000 - inactiveWindowMS
const defaultInactiveMS = getInactiveMS(120)
/** Sliding session inactive from any point in time */
function inactiveMS(state = defaultInactiveMS, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return defaultInactiveMS
    case AUTHORIZE_MIDDLEWARE:
      return error ? defaultInactiveMS : state
    case SET_IDENTITY:
      if(error)
        return defaultInactiveMS
      const { decodedToken } = payload
      return getInactiveMS(getTixClaim(decodedToken, 'timeout'))
  }
  return state
}

/** What time (epoch) does token expire at */
function expiresAtMS(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      return decodedToken.exp * 1000
  }
  return state
}

/** How long of a window prior to expiration should refresh occur */
const refreshWindowMS = 40000
/** What time (epoch) should refresh occur at */
function refreshAtMS(state = null, action = {}) {
  const { type, payload, error } = action
  switch(type) {
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    //case IDENTITY_EXPIRED:
      return null
    case AUTHORIZE_MIDDLEWARE:
      return error ? null : state
    case SET_IDENTITY:
      if(error)
        return null
      const { decodedToken } = payload
      return decodedToken.exp * 1000 - refreshWindowMS
  }
  return state
}

const initialState =  { isFetching: isFetching()
                      , isAuthorized: isAuthorized()
                      , isAdmin: isAdmin()
                      , subject: subject()
                      , user: user()
                      , actualUser: actualUser()
                      , organization: organization()
                      , actualOrganization: actualOrganization()
                      , timeoutMS: timeoutMS()
                      , inactiveMS: inactiveMS()
                      , expiresAtMS: expiresAtMS()
                      , refreshAtMS: refreshAtMS()
                      , tokens: tokens()
                      , fingerprint: fingerprint()
                      //, errors: errors()
                      }


export default function identity(state = initialState, action) {
  const { type, payload, error } = action
  switch(type) {
    case FETCH_IDENTITY:
    case SET_IDENTITY:
    case FORGET_TOKENS:
    case FORGET_FINGERPRINT:
    case IDENTITY_INVALID:
    case IDENTITY_EXPIRED:
    case AUTHORIZE_MIDDLEWARE:
      return Object.assign({}, state, { isFetching: isFetching(state.isFetching, action)
                                      , isAuthorized: isAuthorized(state.isAuthorized, action)
                                      , isAdmin: isAdmin(state.isAdmin, action)
                                      , subject: subject(state.subject, action)
                                      , user: user(state.user, action)
                                      , actualUser: actualUser(state.actualUser, action)
                                      , organization: organization(state.organization, action)
                                      , actualOrganization: actualOrganization(state.actualOrganization, action)
                                      , timeoutMS: timeoutMS(state.timeoutMS, action)
                                      , inactiveMS: inactiveMS(state.inactiveMS, action)
                                      , expiresAtMS: expiresAtMS(state.expiresAtMS, action)
                                      , refreshAtMS: refreshAtMS(state.refreshAtMS, action)
                                      , tokens: tokens(state.tokens, action)
                                      , fingerprint: fingerprint(state.fingerprint, action)
                                      //, errors: errors(state.errors, action)
                                      })
  }
  return state
}
