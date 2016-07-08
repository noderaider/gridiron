import { createAction } from 'redux-actions'
import { apiAction } from './api'
import  { UPDATE_INPUT_VALUE
        , CLEAR_SUGGESTIONS
        , FETCH_SUGGESTIONS
        , FILTER_SUGGESTIONS
        } from '../constants'

export const updateInputValue = createAction(UPDATE_INPUT_VALUE, ([apiName, actionName], value) => ({ apiName, actionName, value }))
export const clearSuggestions = createAction(CLEAR_SUGGESTIONS, ([apiName, actionName]) => ({ apiName, actionName }))
export const fetchSuggestions = createAction(FETCH_SUGGESTIONS, ([apiName, actionName]) => ({ apiName, actionName }))
export const filterSuggestions = createAction(FILTER_SUGGESTIONS, ([apiName, actionName], suggestions, value) => ({ apiName, actionName, suggestions, value }))
export const filterSuggestionsError = createAction(FILTER_SUGGESTIONS)

export function loadSuggestions([apiName, actionName], value) {
  return (dispatch, getState) => {
    let { api } = getState()
    let suggestions = api.entities.getIn([apiName, actionName])
    if(suggestions)
      return Promise.resolve(dispatch(filterSuggestions([apiName, actionName], suggestions, value)))
    dispatch(fetchSuggestions([apiName, actionName]))
    return dispatch(apiAction([apiName, actionName]))
      .then(data => dispatch(filterSuggestions([apiName, actionName], data, value)))
      .catch(err => dispatch(filterSuggestionsError(err)))
  }
}




