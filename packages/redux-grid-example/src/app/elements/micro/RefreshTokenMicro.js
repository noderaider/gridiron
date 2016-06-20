import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const RefreshTokenTooltip = props => (
  <div>{props.refreshToken || 'No refresh token present'}</div>
)

const RefreshTokenMicro = props => {
  const { refreshToken } = props
  return (
    <Micro
        componentID="refresh-token"
        actionType="clipboard"
        actionData={refreshToken}
        tooltip={(
          <RefreshTokenTooltip {...props} />
        )}>
      {refreshToken ? 'Refresh Token' : 'No Refresh Token'}
    </Micro>
  )
}

export default RefreshTokenMicro
