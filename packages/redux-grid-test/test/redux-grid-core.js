import { factories } from 'redux-grid-core'

import React from 'react'
import Immutable from 'immutable'
import * as ReactVirtualized from 'react-virtualized'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { spy } from 'sinon'
const chai = require('chai')
chai.use(require('chai-enzyme')())
const should = chai.should()

describe('factories', () => {
  it('exists', () => should.exist(factories))
  it('is a function', () => factories.should.be.a('function'))


})
