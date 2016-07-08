import React from 'react'
import PrimaryGrid from 'app/elements/grids/PrimaryGrid'

export default ({ children, params }) => (
  <div>
    <h2>Grid Tests</h2>
    {params.id ? <span>{params.id}</span> : null}
    <PrimaryGrid />
    {children}
  </div>
)
