import reduxGrid from 'redux-grid'
import React from 'react'
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
  it('should not throw for valid dependencies (React, ReactVirtualized, connect)', () => (() => reduxGrid({ React, ReactVirtualized, connect })).should.not.throw())
  describe('<Grid />', () => {
    const reducer = (state = {}, action = {}) => {}
    const store = createStore(reducer)
    const { Grid } = reduxGrid({ React, ReactVirtualized, connect })
    it('should exist', () => should.exist(Grid))
    it('should shallow mount', () => (() => shallow(<Provider store={store}><Grid /></Provider>)).should.not.throw())
  })
})


