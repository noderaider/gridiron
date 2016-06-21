import rewire from 'rewire'
const should = require('chai').should()

describe('lib', function() {
  const lib = rewire('../lib')

  describe('#default', function () {
    it('should have default export', () => should.exist(lib.default))
  })

  const solvent = lib.default
  describe('solvent', function () {
    it('should be a function', () => solvent.should.be.a('function'))
    it('should not throw', () => (() => solvent()).should.not.throw())
    it('should return a function', () => solvent().should.be.a('function'))
    it('should validate object', () => {
      const resolver = solvent({ React: 'object' })
      resolver({ React: { prop: 'Some property' } }).should.be.an('object')
                                                                .that.has.property('React')
                                                                  .that.is.an('object')
    })
  })
})
