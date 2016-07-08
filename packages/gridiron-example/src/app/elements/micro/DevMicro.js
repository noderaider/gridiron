import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const DevMicro = props => {
  return (
    <Micro
        componentID="dev"
        iconName="code"
        bsStyle="info"
        tooltip="Build is operating in DEV mode">
        DEV
    </Micro>
  )
}
export default DevMicro
