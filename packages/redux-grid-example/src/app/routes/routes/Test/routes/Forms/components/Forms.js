import React from 'react'

export default ({ children, params }) => (
  <div>
    <h2>Form Tests</h2>
    {params.id ? <span>{params.id}</span> : null}
    {children}
  </div>
)
