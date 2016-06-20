import  { UPDATE_INPUT_VALUE
        , CLEAR_SUGGESTIONS
        , FETCH_SUGGESTIONS
        , FILTER_SUGGESTIONS
        } from '../constants'


const digitsRE = /\(?\d+\)?/g
const wordsRE = /[\w\(\)]+/ig

const idFilter = (id, value) => {
  let inputDigits = value.match(digitsRE)
  if(!inputDigits)
    return false
  return inputDigits.some(x => `(${id})`.includes(x))
}

const nameFilter = (name, value) => {
  let inputWords = value.match(wordsRE)
  if(!inputWords)
    return false
  return inputWords.some(x => name.toLowerCase().includes(x.toLowerCase()))
}

const monikerFilter = (moniker, value) => {
  if(!value)
    return false
  return nameFilter(moniker.name, value) || idFilter(moniker.id, value)
}

function value(state = '', action = {}) {
  const { type, payload, error } = action
  switch (type) {
    case UPDATE_INPUT_VALUE:
      const { value } = payload
      return value
  }
  return state
}

function suggestions(state = [], action = {}) {
  const { type, payload, error } = action
  switch (type) {
    case CLEAR_SUGGESTIONS:
      return []
    case FILTER_SUGGESTIONS:
      if(state.value === payload.value)
        return payload.suggestions
      return payload.suggestions.filter(moniker => monikerFilter(moniker, payload.value)).sort((a, b) => (a.id - b.id)).slice(0, 12)
  }
  return state
}

function isLoading(state = false, action = {}) {
  const { type, payload, error } = action
  switch (type) {
    case FETCH_SUGGESTIONS:
      return true
    case FILTER_SUGGESTIONS:
      return false
  }
  return state
}

const initialState =  { value: value()
                      , suggestions: suggestions()
                      , isLoading: isLoading()
                      }

export default function autocomplete(state = initialState, action) {
  const { type, payload, error } = action
  switch (type) {
    case UPDATE_INPUT_VALUE:
    case CLEAR_SUGGESTIONS:
    case FETCH_SUGGESTIONS:
    case FILTER_SUGGESTIONS:
      return Object.assign({}, state, { value: value(state.value, action)
                                      , suggestions: suggestions(state.suggestions, action)
                                      , isLoading: isLoading(state.isLoading, action)
                                      })
  }
  return state
}
