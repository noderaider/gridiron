import gridiron from 'gridiron'

import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import bindActionDispatchers from 'bind-action-dispatchers'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { Pre } from '../react-pre'
import contextTypes from '../../context'

export const deps = { React, ReactDOM, shallowCompare, connect, push, Immutable, bindActionDispatchers, Pre, contextTypes }

const themeName = 'mellow'

export default gridiron(deps, { themeName })
