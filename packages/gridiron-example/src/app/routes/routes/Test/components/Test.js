import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default ({ children }) => (
  <div>
    <ul>
      <li><Link to="/test/forms">Forms</Link></li>
      <li><Link to="/test/grids">Grids</Link></li>
    </ul>
    {children}
  </div>
)
