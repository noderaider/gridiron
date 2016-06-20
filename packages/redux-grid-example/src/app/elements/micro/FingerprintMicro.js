import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const FingerprintTooltip = props => (
  <div>{props.fingerprint || 'No fingerprint present'}</div>
)

const FingerprintMicro = props => {
  const { fingerprint } = props
  return (
    <Micro
        componentID="fingerprint"
        actionType="clipboard"
        actionData={fingerprint}
        tooltip={<FingerprintTooltip {...props} />}>
      {fingerprint ? 'Fingerprint' : 'No Fingerprint'}
    </Micro>
  )
}

export default FingerprintMicro
