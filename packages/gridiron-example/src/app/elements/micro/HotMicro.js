import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const HotMicro = props => {
  return (
    <Micro
        componentID="hot"
        iconName="fire"
        bsStyle="danger"
        tooltip="Hot module reloading is enabled">
        HOT
    </Micro>
  )
}
export default HotMicro
