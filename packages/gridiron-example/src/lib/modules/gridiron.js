import gridiron from 'gridiron'

import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactGateway from 'react-gateway'
import shallowCompare from 'react-addons-shallow-compare'
import createFragment from 'react-addons-create-fragment'
import bindActionDispatchers from 'bind-action-dispatchers'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { Pre } from './pre'
import contextTypes from '../context'

export const deps = { React, ReactDOM, ReactGateway, shallowCompare, createFragment, connect, push, Immutable, bindActionDispatchers, Pre, contextTypes }

const themeName = 'mellow'

export default gridiron(deps, { themeName })
