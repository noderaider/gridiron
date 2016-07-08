import contextual from 'contextual'
import React from 'react'

const defaultThemeName = 'solarized-dark'
const { contextTypes, defaultTheme, getTheme, schemeNames } = contextual({ defaultThemeName, React })
export { contextTypes, defaultTheme, getTheme, schemeNames }
