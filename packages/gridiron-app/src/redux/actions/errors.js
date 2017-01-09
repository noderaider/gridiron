import { createAction } from 'redux-actions'
import  { ADD_ERROR
        , DISMISS_ERROR
        , CLEAR_ERRORS
        } from '../constants'

/** TODO: DECIDE BETWEEN THIS STYLE GENERIC OR ERRORS CROSS CUTTING EVENTS FROM ALL CATEGORIES */
//export const addError = createAction(ADD_ERROR, (err, category, event) => ({ err, category, event }))
export const dismissError = createAction(DISMISS_ERROR, (category, id) => ({ category, id }))
export const clearErrors = createAction(CLEAR_ERRORS)
