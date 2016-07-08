import gridiron from 'gridiron'
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

describe('gridiron', () => {
  it('exists', () => should.exist(gridiron))
  it('should be a function', () => gridiron.should.be.a('function'))
  it('throws for no parameters', () => (() => gridiron()).should.throw())
  it('should throw for invalid dependencies (React, ReactVirtualized, connect)', () => (() => gridiron({ React, ReactVirtualized, connect })).should.throw())

  const getState = () => {}
  const ContentBox = props => <div>{props.children}</div>
  it('should not throw for valid dependencies (React, ReactVirtualized, connect, getState, Immutable, ContentBox)', () => (() => gridiron({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })).should.not.throw())

  describe('<CoreGrid />', () => {
    const reducer = (state = {}, action = {}) => {}
    const store = createStore(reducer)
    const { CoreGrid } = gridiron({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })
    it('should exist', () => should.exist(CoreGrid))
    it('should shallow mount', () => (() => shallow(<Provider store={store}><CoreGrid /></Provider>)).should.not.throw())
  })

  describe('<DrillGrid />', () => {
    const reducer = (state = {}, action = {}) => {}
    const store = createStore(reducer)
    const { DrillGrid } = gridiron({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })
    it('should exist', () => should.exist(DrillGrid))
    it('should shallow mount', () => (() => shallow(<Provider store={store}><DrillGrid /></Provider>)).should.not.throw())
  })
})


