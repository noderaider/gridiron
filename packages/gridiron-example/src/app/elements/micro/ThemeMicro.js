import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const ThemeTooltip = props => (
  <div>{props.theme}</div>
)

const ThemeMicro = props => {
  const { dispatch } = props
  return (
    <Micro componentID="theme-panel" tooltip={<ThemeTooltip {...props} />}>Theme</Micro>
  )
}

export default ThemeMicro
