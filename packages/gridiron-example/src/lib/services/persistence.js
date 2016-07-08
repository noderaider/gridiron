import cookie from 'react-cookie'
import { client, log, noop } from '../../config'
const { state } = client

const keyNames = Object.keys(state.meta)
const separator = ':'
const stateSerializers =  { json: state => JSON.stringify(state)
                          , concat: state => state.join(separator)
                          , base64: state => new Buffer(state).toString('base64')
                          }
const stateDeserializers =  { json: serialized => JSON.parse(serialized)
                            , concat: serialized => serialized.split(separator)
                            , base64: serialized => new Buffer(serialized, 'base64').toString('ascii')
                            }



function getStateMeta(key) {
  let stateMeta = state.meta[key]
  if(!stateMeta)
    throw new Error(`Unsupported state => '${stateKey}'. Supported states: ['${JSON.stringify([...keyNames])}']`)
  return stateMeta
}

function getStores(stateKeys = keyNames) {
  let stores = {}
  for(let stateKey of stateKeys) {
    let stateMeta = getStateMeta(stateKey)
    let serialize = getSerializer(stateMeta)
    let deserialize = getDeserializer(stateMeta)
    stores[stateKey] = getPersistMedium({ persist: stateMeta.persist
                                        , serialize
                                        , deserialize
                                        })
  }
  return stores
}


function getSerializer({ jsonProps, concatProps, base64Props }) {
  if(jsonProps && concatProps)
    throw new Error('Cannot serialize using jsonProps and concatProps (concatProps should only be used on array state).')

  let serializers = []
  if(jsonProps)
    serializers.push(stateSerializers.json)
  if(concatProps)
    serializers.push(stateSerializers.concat)
  if(base64Props)
    serializers.push(stateSerializers.base64)

  return state => {
    //log.warn({ state }, 'SERIALIZER')
    return serializers.reduce((mutated, serialize) => serialize(mutated), state)
  }
}

function getDeserializer({ jsonProps, concatProps, base64Props, defaultProps = noop() }) {
  if(jsonProps && concatProps)
    throw new Error('Cannot serialize using jsonProps and concatProps (concatProps should only be used on array state).')

  let deserializers = []
  if(base64Props)
    deserializers.push(stateDeserializers.base64)
  if(concatProps)
    deserializers.push(stateDeserializers.concat)
  if(jsonProps)
    deserializers.push(stateDeserializers.json)

  return serialized => {
    //log.warn({ serialized }, 'DESERIALIZER')
    return typeof serialized === 'undefined' ? defaultProps : deserializers.reduce((mutated, deserialize) => deserialize(mutated), serialized)
  }
}


function getPersistMedium({ persist, serialize, deserialize }) {
  switch(persist.type) {
    case 'cookie':
      return  { load: () => deserialize(cookie.load(persist.name))
              , save: state => cookie.save(persist.name, serialize(state), cookieOpts(persist))
              , remove: () => cookie.save(persist.name, noop(), cookieOpts({...persist, days: -1}))
              }
    case 'local':
      return  { load: () => deserialize(localStorage.getItem(persist.name))
              , save: state => localStorage.setItem(persist.name, serialize(state))
              , remove: () => localStorage.removeItem(persist.name)
              }
    case 'session':
      return  { load: () => deserialize(sessionStorage.getItem(persist.name))
              , save: state => sessionStorage.setItem(persist.name, serialize(state))
              , remove: () => sessionStorage.removeItem(persist.name)
              }
  }
}

const cookieOpts = persist => ( { path: '/'
                                , expires: getFutureDate(persist.days || 1)
                                , secure: persist.setSecureCookie || false
                                , httpOnly: persist.httpOnly || false
                                } )

function getFutureDate(days) {
  let futureDate = new Date()
  futureDate.setDate(futureDate.getDate()+days)
  return futureDate
}


export default (stores = getStores()) => {
  const loadState = (stateKeys = keyNames) => {
    let state = {}
    for(let stateKey of stateKeys)
      state[stateKey] = stores[stateKey].load()
    return state
  }

  const saveState = partialState => {
    //log.warn({ partialState }, 'saveState')
    let fullState = {}
    for(let stateKey of Object.keys(partialState)) {
      stores[stateKey].save(partialState[stateKey])
      fullState[stateKey] = state
    }
    return fullState
  }

  const removeState = stateKeys => {
    //log.warn({ stateKeys }, 'removeState')
    if(!stateKeys)
      throw new Error('Must supply stateKeys to remove from state.')
    let fullState = loadState()
    for(let stateKey of stateKeys) {
      stores[stateKey].remove()
      fullState[stateKey] = noop()
    }
    return fullState
  }

  /** Loads all the common cookie details */
  const getPersisted = () => loadState(['tokens', 'fingerprint'])
  return { loadState, saveState, removeState, getPersisted }
}
