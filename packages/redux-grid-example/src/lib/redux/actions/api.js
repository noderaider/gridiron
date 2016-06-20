import Promise from 'bluebird'
import 'isomorphic-fetch'
import { createAction } from 'redux-actions'
import jwtSimple from 'jwt-simple'

import { client, log } from '../../../config'
import { scheme, hostname, port, host, path } from '../../services/location'
import persistence from '../../services/persistence'
import  { CLEAR_DATA
        , FETCH_DATA
        , RECEIVE_DATA
        , KEYED_DATA
        } from '../constants'

import { forgetTokens, refreshIdentity } from './identity'
import APIError from '../../errors/APIError'

const { saveState, loadState, removeState } = persistence()
const getPersisted = () => loadState(['tokens', 'fingerprint'])

const { apis, clientId } = client

const noop = () => {}

export const clearData = createAction(CLEAR_DATA, ([apiName, actionName]) => ({ apiName, actionName }))
const fetchData = createAction(FETCH_DATA, ([apiName, actionName], inputData) => ({ apiName, actionName, inputData }))
const receiveData = createAction(RECEIVE_DATA, ([apiName, actionName], data) => ({ apiName, actionName, data }))
const receiveDataError = createAction(RECEIVE_DATA)
const keyedData = createAction(KEYED_DATA, ([apiName, actionName], [apiKey, actionKey], data) => ({ apiName, actionName, apiKey, actionKey, data }))
const keyedDataError = createAction(KEYED_DATA)


export const decodeToken = accessToken => jwtSimple.decode(accessToken, null, true)
export const isExpired = decodedToken => getExpiresInMS(decodedToken) < 0
const getExpiresInMS = decodedToken => decodedToken.exp * 1000 - Date.now()

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

const resolveScheme = actionConfig => scheme
const resolvePort = actionConfig => actionConfig.extra && actionConfig.extra.port ? actionConfig.extra.port : port
const resolveHostname = actionConfig => actionConfig.extra && actionConfig.extra.hostname ? actionConfig.extra.hostname : hostname

const resolveBaseUrl = actionConfig => {
  let resolvedScheme = resolveScheme(actionConfig)
  let resolvedPort = resolvePort(actionConfig)
  let resolvedHostname = resolveHostname(actionConfig)
  if((resolvedScheme === 'https' && resolvedPort === 443) || (resolvedScheme === 'http' && resolvedPort === 80)) { /** NO NEED TO SPECIFY PORT IN HERE */
    if(resolvedScheme === scheme && resolvedHostname === hostname && resolvedPort === port) /** SAME HOSTNAME, PORT, and SCHEME, NO NEED TO SPECIFY BASE URL */
      return ''
    return `${resolvedScheme}://${resolvedHostname}`
  }
  return `${resolvedScheme}://${resolvedHostname}:${resolvedPort}`
}

const supportedPropTypes = ['string', 'bool', 'number']
const checkPropType = (key, prop, propType) => {
  if(typeof prop === 'undefined' || prop === null)
    throw new APIError(`Parameter with key '${key}' was null but API was expecting propType '${propType}'.`)
  const getTypeError = () => new APIError(`Parameter with key '${key}' was not of expected propType '${propType}'.`)
  switch(propType) {
    case 'string':
      if (typeof prop !== 'string')
        throw getTypeError()
      break
    case 'bool':
      if(typeof prop !== 'boolean')
        throw getTypeError()
      break
    case 'number':
      if(typeof prop !== 'number')
        throw getTypeError()
      break
    case 'object':
      if(typeof prop !== 'object')
        throw getTypeError()
      break
    case 'array':
      if(!Array.isArray(prop))
        throw getTypeError()
      break
    case 'func':
    default:
      throw new APIError(`propType ${propType} is not supported for api interpolation. Reconfigure the api to use one of the supported propTypes => [${supportedPropTypes.join(', ')}]`)
  }
}


const resolveQuery = (actionConfig, inputData) => {
  if(!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.query))
    return ''
  // TODO: COMPILE QUERY STRING
  return '?'
}

const getTemplateRegExp = replacer => new RegExp(`\\$\\{${replacer}\\}`, 'gi')
/**
 * PATH = /some/path/looks/like/this/${variableName}/${another}
 * replacers = { variableName: 'path_seg_one', another: 'path_seg_two' }
 */
const compileTemplate = (path, replacers) => {
  if(path.includes(' '))
    throw new APIError('Space detected in path. This is not allowed.')
  for(let key of Object.keys(replacers)) {
    let re = getTemplateRegExp(key)
    path = path.replace(re, replacers[key])
  }
  return path
}

const resolvePath = (actionConfig, inputData) => {
  // TODO: NEED TO COMPILE DYNAMIC PATHS
  if(!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.route))
    return actionConfig.path

  const { route } = actionConfig.extra.expects
  let possibleVariables = Object.keys(route)
  let matchedVariables = Object.keys(inputData).filter(x => typeof inputData[x] !== 'undefined' && possibleVariables.includes(x))

  if(__DEV__) {
    //** VALIDATE REQUIRED VARIABLES */
    let requiredVariables = possibleVariables.filter(x => route[x].isRequired)
    let missedVariables = requiredVariables.filter(x => matchedVariables.includes(x) === false)
    if(missedVariables.length > 0)
      throw new APIError(`Route with path ${actionConfig.path} requires the following missing route variables => [${missedVariables.join(', ')}]`)

    //** VALIDATE TYPED VARIABLES */
    let typedVariables = matchedVariables.filter(x => route[x].propType)
    typedVariables.forEach(x => checkPropType(x, inputData[x], route[x].propType))
  }

  /** Reduce to an object with key value map of things to be replaced. */
  let replacers = matchedVariables.reduce((obj, key) => Object.assign({}, obj, { [key]: inputData[key].toString() }), {})
  return compileTemplate(actionConfig.path, replacers)
}

const resolveBody = (actionConfig, inputData) => {
  if(!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.body))
    return noop()

  const { body } = actionConfig.extra.expects
  let possibleVariables = Object.keys(body)
  let matchedVariables = Object.keys(inputData).filter(x => typeof inputData[x] !== 'undefined' && possibleVariables.includes(x))

  if(__DEV__) {
    //** VALIDATE REQUIRED VARIABLES */
    let requiredVariables = possibleVariables.filter(x => body[x].isRequired)
    let missedVariables = requiredVariables.filter(x => matchedVariables.includes(x) === false)
    if(missedVariables.length > 0)
      throw new APIError(`Route with path ${actionConfig.path} requires the following missing body variables => [${missedVariables.join(', ')}], passed => [${JSON.stringify(inputData)}]`)

    //** VALIDATE TYPED VARIABLES */
    let typedVariables = matchedVariables.filter(x => body[x].propType)
    typedVariables.forEach(x => checkPropType(x, inputData[x], body[x].propType))
  }
  let resolvedBody = matchedVariables.reduce((obj, key) => Object.assign({}, obj, { [key]: inputData[key] }), {})
  return JSON.stringify(resolvedBody)
}

const resolveInput = (actionConfig, inputData) => `${resolveBaseUrl(actionConfig)}${resolvePath(actionConfig, inputData)}${resolveQuery(actionConfig, inputData)}`

const resolveInit = (actionConfig, inputData) => {
  /** TODO: NEED TO COMPILE ROUTES PATHS AND TEST IF THERE ARE REQUIRED DATA */
  let body = resolveBody(actionConfig, inputData)
  return Object.assign({}, actionConfig.init, { body })
}

const getErrorCode = response => {
  switch(response.statusText) {
    default:
      return 'API_UNCLASSIFIED'
  }
}

const getAPIError = (info, response) => {
  const code = getErrorCode(response)
  switch(response.status) {
    default:
      return new APIError(`An API error occurred => ${response.statusText}`, null, { ...info, response, code })
  }
}

let activeRequests = new Map()
function executeFetch (input, init, transform, { apiName, actionName, inputData }) {
  return (dispatch, getState) => {
    const info = { input, init, apiName, actionName, inputData }
    const key = JSON.stringify({ ...info, transform })
    let request = activeRequests.get(key)
    if(!request) {
      dispatch(fetchData([apiName, actionName], inputData))
      request = fetch(input, init)
                  .then(response => {
                    if(!response.ok) {
                      if(response.status === 401)
                        dispatch(forgetTokens())
                      throw getAPIError(info, response)
                    }
                    return response.json()
                  })
                  .then(json => {
                    let data = json
                    if(transform)
                      data = Array.isArray(json) ? json.map(transform) : transform(json)
                    activeRequests.delete(key)
                    dispatch(receiveData([apiName, actionName], data))
                    return data
                  })
                  .catch(err => {
                    activeRequests.delete(key)
                    dispatch(receiveDataError(err))
                    throw err
                  })
      activeRequests.set(key, request)
    } else
      log.info({ apiName, actionName }, 'request already processing, continuing on enqueued response.')
    return request
  }
}


const resolveInputData = args => {
  if(args.length > 0 && typeof args[0] !== 'function')
    return args[0]
}

const resolveTransform = args => {
  if(args.length > 0) {
    let lastArg = args[args.length - 1]
    if(typeof lastArg === 'function')
      return lastArg
  }
}

const getDecodedToken = accessToken => jwtSimple.decode(accessToken, null, true)

const getCookieData = () => {
  const { tokens } = getPersisted()
  const [accessToken, refreshToken] = tokens || []
  const decodedToken = getDecodedToken(accessToken)
  const fingerprint = getTixClaim(decodedToken, 'fingerprint')
  const subject = getClaim(decodedToken, 'sub')
  return { accessToken, refreshToken, fingerprint, subject }
}

const authorizeInit = init => {
  const { accessToken } = getCookieData()
  let headers = Object.assign({}, init.headers, { Authorization: `Bearer ${accessToken}`})
  return Object.assign({}, init, { headers })
}


export function apiAction([apiName, actionName], ...args) {
  const inputData = resolveInputData(args)
  const transform = resolveTransform(args)
  return (dispatch, getState) => {
    try {
      let apiConfig = apis[apiName]
      if(!apiConfig) {
        let err = new APIError(`Specified api does not exist, ensure api '${apiName}' exists in api config.`, null, { apiName, actionName, inputData })
        dispatch(receiveDataError(err))
        return Promise.reject(err)
      }
      let actionConfig = apiConfig[actionName]
      if(!actionConfig) {
        let err = new APIError(`Specified api action does not exist, ensure api '${apiName}' has an action definition for ${actionName}`, null, { apiName, actionName, inputData })
        dispatch(receiveDataError(err))
        return Promise.reject(err)
      }

      let info = { apiName, actionName, inputData }
      let input = resolveInput(actionConfig, inputData)
      let init = resolveInit(actionConfig, inputData)
      const isAuthorized = actionConfig.extra && actionConfig.extra.isAuthorized
      return dispatch(executeFetch(input, isAuthorized ? authorizeInit(init) : init, transform, info))
    } catch(innerError) {
      let err = new APIError('Unexpected error occurred during data fetch.', innerError, { apiName, actionName })
      dispatch(receiveDataError(err))
      return Promise.reject(err)
    }
  }
}

export function keyedApiAction([apiName, actionName], [apiKey, actionKey], ...args) {
  return (dispatch, getState) => {
    try {
      dispatch(apiAction([apiName, actionName], ...args))
        .then(data => {
          dispatch(keyedData([apiName, actionName], [apiKey, actionKey], data))
          return data
        })
    } catch(innerError) {
      let err = new APIError('Unexpected error occurred during keyed api fetch.', innerError, { apiName, actionName, actionKey })
      dispatch(keyedDataError(err))
    }
  }
}


export const logAccess = (path, query, title) => dispatch => dispatch(apiAction(['log', 'access'], { path, query, title }))
