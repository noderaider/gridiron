import { factories } from 'gridiron-core'

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

describe('factories', function () {
  it('exists', () => should.exist(factories))
  it('is an object', () => factories.should.be.a('function'))


  describe('#subscribe', function () {
    const { subscribe } = factories({ React })
    it('exists', () => should.exist(subscribe))
    it('should be a function', () => subscribe.should.be.a('function'))
    it('should throw for no params', () => (() => subscribe()).should.throw())
    it('should throw for one param', () => (() => subscribe(<div />)).should.throw())
    it('should not throw for correct params', () => (() => subscribe(<div />, [ 'propOne' ])).should.not.throw())
    it('should return valid object', () => {
      const result = subscribe(<div />, [ 'propOne' ])
      should.exist(result)
      const { component, propagate, listen } = result
      should.exist(component)
      should.exist(propagate)
      should.exist(listen)
      component.should.be.an('object')
      propagate.should.be.a('function')
      listen.should.be.a('function')
    })
  })
})
