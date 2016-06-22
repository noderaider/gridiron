import rewire from 'rewire'
const should = require('chai').should()

describe('lib', function() {
  const lib = rewire('../lib')

  describe('#default', function () {
    it('should have default export', () => should.exist(lib.default))
  })

  const GridMonitor = lib.default
  describe('GridMonitor', function () {
    it('should be a function', () => GridMonitor.should.be.a('function'))
  })
})
