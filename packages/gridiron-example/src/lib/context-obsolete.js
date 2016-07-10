//import contextual from 'contextual'
import React from 'react'
import contextTypes from './context'
import { getTheme, schemeNames } from './context/theme'
console.warn('CONTEXT TYPES 1', contextTypes)

const defaultThemeName = 'solarized-dark'
//const defaultTheme = getTheme(defaultThemeName)
//const defaultTheme = defaultThemeName
//const { contextTypes, defaultTheme, getTheme, schemeNames } = contextual({ defaultThemeName, React })
export { contextTypes, getTheme, schemeNames /*, defaultTheme*/ } //defaultTheme, getTheme, schemeNames }
