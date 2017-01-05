import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import createFragment from 'react-addons-create-fragment'
import Immutable from 'immutable'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

const Pre = props => <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(props, null, 2) }} />

const modules = { React, ReactDOM, shallowCompare, createFragment, connect, push, Immutable, Pre }
export default () => modules
