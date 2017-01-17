import React, { Component } from 'react'
import Immutable from 'immutable'
import Gridiron from '../modules/Gridiron'
import Sand from '../modules/Sand'

const defaultProps = (
  {}
)

export default () => (
  <Sand Box={Gridiron.Grid} {...defaultProps} />
)
