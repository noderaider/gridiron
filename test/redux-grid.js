import ApiGrid from '../lib/components/grid/ApiGrid'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme'
import { spy } from 'sinon'
const chai = require('chai')
chai.use(require('chai-enzyme')())
const should = chai.should()

describe('redux-grid', () => {
  it('exists', () => should.exist(ApiGrid))
  describe('componentDidMount', () => {
    it('mounts', () => {
      spy(ApiGrid.prototype, 'componentDidMount')
      const wrapper = mount(<ApiGrid />)
      ApiGrid.prototype.componentDidMount.calledOnce.should.be.true
    })
  })
  describe('render', () => {
    context('renders direct data', () => {
      const data =  [ { name: 'jim', age: 26, interest: 'being boring', sex: 'male' }
                    , { name: 'tony', age: 37, interest: 'skydiving', sex: 'male' }
                    , { name: 'lisa', age: 40, interest: 'sleeping', sex: 'female' }
                    , { name: 'dan', age: 20, interest: 'jumping', sex: 'male' }
                    , { name: 'sarah', age: 15, interest: 'eating', sex: 'female' }
                    ]

      const selector = state => state.data.map(({ name, age, interest, sex }) => ({ ['Name']: name, ['Age']: age, ['Is A Dude']: sex === 'male' }))
      it('renders same number of columns as selector', () => {
        const wrapper = shallow(<ApiGrid selector={selector} state={data} />)
      })
    })
  })

})


