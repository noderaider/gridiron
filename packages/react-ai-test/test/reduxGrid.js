import reduxGrid from 'react-ai'
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

describe('reduxGrid', () => {
  it('exists', () => should.exist(reduxGrid))
  it('should be a function', () => reduxGrid.should.be.a('function'))
  it('throws for no parameters', () => (() => reduxGrid()).should.throw())
  it('should throw for invalid dependencies (React, ReactVirtualized, connect)', () => (() => reduxGrid({ React, ReactVirtualized, connect })).should.throw())

  const getState = () => {}
  const ContentBox = props => <div>{props.children}</div>
  it('should not throw for valid dependencies (React, ReactVirtualized, connect, getState, Immutable, ContentBox)', () => (() => reduxGrid({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })).should.not.throw())

  describe('<CoreGrid />', () => {
    const reducer = (state = {}, action = {}) => {}
    const store = createStore(reducer)
    const { CoreGrid } = reduxGrid({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })
    it('should exist', () => should.exist(CoreGrid))
    it('should shallow mount', () => (() => shallow(<Provider store={store}><CoreGrid /></Provider>)).should.not.throw())
  })

  describe('<DrillGrid />', () => {
    const reducer = (state = {}, action = {}) => {}
    const store = createStore(reducer)
    const { DrillGrid } = reduxGrid({ React, ReactVirtualized, connect, getState, Immutable, ContentBox })
    it('should exist', () => should.exist(DrillGrid))
    it('should shallow mount', () => (() => shallow(<Provider store={store}><DrillGrid /></Provider>)).should.not.throw())
  })
})


