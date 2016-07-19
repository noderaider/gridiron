import reactFormula from 'react-formula'
import React from 'react'
import Immutable from 'immutable'
import { mount, shallow } from 'enzyme'
import { spy } from 'sinon'
const chai = require('chai')
chai.use(require('chai-enzyme')())
const should = chai.should()

describe('react-formula', () => {
  it('exists', () => should.exist(reactFormula))
  it('should be a function', () => reactFormula.should.be.a('function'))
  it('throws for no parameters', () => (() => reactFormula()).should.throw())
  it('should throw for invalid dependencies (React, ReactVirtualized, connect)', () => (() => reactFormula({ React, ReactVirtualized, connect })).should.throw())

  describe('<Form />', () => {
    const formula = reactFormula({ React, Immutable })
    it('should exist', () => should.exist(formula))
    const Form = formula()
    it('should exist', () => should.exist(Form))
    it('should shallow mount', () => (() => shallow(<Form />)).should.not.throw())
  })

})


