import { createAction } from 'redux-actions'
import  { TOGGLE_VISIBILITY
        , SET_VISIBILITY
        , SET_THEME
        , TOGGLE_EXPANDER
        , SET_EXPANDER
        , SET_TEXT
        , REGISTER_TOOLTIP
        , DISPOSE_TOOLTIP
        } from '../constants'

export const toggleVisibility = createAction(TOGGLE_VISIBILITY, (componentID, value = true, options = [false, true]) => ({ componentID, value, options }))
export const setVisibility = createAction(SET_VISIBILITY, (componentID, value, options = [false, true]) => ({ componentID, value, options }))
export const setTheme = createAction(SET_THEME, name => ({ name }))
export const setText = createAction(SET_TEXT)

export const setExpander = createAction(SET_EXPANDER, (componentID, value) => ({ componentID, value }))
export const toggleExpander = createAction(TOGGLE_EXPANDER, (componentID, initialValue = false) => ({ componentID, initialValue }))


export const registerTooltip = createAction(REGISTER_TOOLTIP, (componentID, props) => ({ componentID, props }))
export const disposeTooltip = createAction(DISPOSE_TOOLTIP, componentID => ({ componentID }))
