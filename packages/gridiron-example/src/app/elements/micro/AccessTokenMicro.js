import React, { Component, PropTypes } from 'react'
import Micro from './core/Micro'

const codeStyle = { maxWidth: 200, fontSize: '0.6em', backgroundColor: 'rgba(255, 255, 255, 0.5)' }
const AccessTokenTooltip = props => props.accessToken ? (
    <pre style={codeStyle}><code>{props.accessToken}</code></pre>
  ) : <div>No access token present</div>

const AccessTokenMicro = props => {
  const { accessToken } = props
  return (
    <Micro
        componentID="access-token"
        actionType="clipboard"
        actionData={accessToken}
        tooltip={<AccessTokenTooltip {...props} />}>
      {accessToken ? 'Access Token' : 'No Access Token'}
    </Micro>
  )
}

export default AccessTokenMicro
