import gridiron from 'gridiron'

import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import createFragment from 'react-addons-create-fragment'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { Pre } from './pre'

export const deps = { React, ReactDOM, shallowCompare, createFragment, connect, push, Immutable, Pre }

const themeName = 'mellow'

export default gridiron(deps, { themeName })
