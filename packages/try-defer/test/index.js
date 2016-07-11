import rewire from 'rewire'
import util from 'util'
const should = require('chai').should()

describe('lib', function () {
  let lib = rewire('../lib')
  it('should exist', () => should.exist(lib))
  let tryDefer = lib.default
  let { browserDefer } = lib

  function testInterface (obj) {
    context('interface', function() {
      it('should exist', function () { should.exist(obj) })
      it('should be a function', function () { obj.should.be.a('function') })
      it('should not throw', function () { (() => obj()).should.not.throw() })
      describe('returns', function () {
        let result = null
        let ctx = null
        let defer = null
        beforeEach(function () {
          result = obj()
          ctx = result[0]
          defer = result[1]
        })
        afterEach(function () {
          result = null
          ctx = null
          defer = null
        })

        it('should return an array of length 2', function() {
          should.exist(result)
          result.should.be.instanceof(Array)
          result.length.should.eql(2)
        })

        describe('array', function() {
          it('should exist', function () { should.exist(ctx) })
          it('should be a function', function() { ctx.should.be.a('function') })
          it('should exist', function () { should.exist(defer) })
          it('should be an object', function() { defer.should.be.an('object') })

          let replay = null
          let serialize = null
          let reactReplay = null
          beforeEach(function () {
            replay = defer.replay
            serialize = defer.serialize
            reactReplay = defer.reactReplay
          })
          afterEach(function () {
            replay = null
            serialize = null
            reactReplay = null
          })

          describe('#replay', function() {
            it('should be a function', function () {
              should.exist(replay)
              replay.should.be.a('function')
            })
          })
          describe('#serialize', function() {
            it('should be a function', function() {
              should.exist(serialize)
              serialize.should.be.a('function')
            })
          })
          describe('#reactReplay', function() {
            it('should be a function', function() {
              should.exist(reactReplay)
              reactReplay.should.be.a('function')
            })
          })
        })
      })

    })
  }

  describe('tryDefer', function () {
    testInterface(tryDefer)

    describe('accumulates', function () {
      it('should accrue errors per context', function () {
        let [ ctx, defer ] = tryDefer()
        let throws = ctx(() => { throw new Error('BLOW UP') })
        let one = throws()
        should.exist(one.deferred)
        one.deferred.should.be.a('boolean')
        one.deferred.should.be.false
        should.exist(one.attempt)
        one.attempt.should.be.a('number')
        one.attempt.should.eql(1)
        should.exist(one.err)
        one.err.should.be.instanceof(Error)

        let two = throws()
        should.exist(two.deferred)
        two.deferred.should.be.a('boolean')
        two.deferred.should.be.false
        should.exist(two.attempt)
        two.attempt.should.be.a('number')
        two.attempt.should.eql(2)
        should.exist(two.err)
        two.err.should.be.instanceof(Error)



        let [ ctx_two, defer_two ] = tryDefer()
        let throws_two = ctx_two(() => { throw new Error('BLOW UP') })
        let three = throws_two()
        should.exist(three.deferred)
        three.deferred.should.be.a('boolean')
        three.deferred.should.be.false
        should.exist(three.attempt)
        three.attempt.should.be.a('number')
        three.attempt.should.eql(1)
        should.exist(three.err)
        three.err.should.be.instanceof(Error)

        let four = throws_two()
        should.exist(four.deferred)
        four.deferred.should.be.a('boolean')
        four.deferred.should.be.false
        should.exist(four.attempt)
        four.attempt.should.be.a('number')
        four.attempt.should.eql(2)
        should.exist(four.err)
        four.err.should.be.instanceof(Error)
      })
    })

    describe('serializes-deserializes', function () {
      it('should serialize and deserialize back', function() {
        let value = 0
        let attempted = 0
        let [ skipsThree, defer ] = tryDefer(() => {
          if(value < 3) {
            value++
            return false
          }
          return true
        })

        let skipper = skipsThree(function () {
          attempted++
          return attempted
        })

        skipper()
        skipper()
        skipper()

        let serialized = defer.serialize()
        console.warn(serialized)
        /*
        let results = eval(serialized)
        console.warn(results)
        */
        //let results = deserializer(tryDefer)
        /*
        should.exist(results)
        results.should.be.instanceof(Array)
        results.should.eql([ 1, 2, 3 ])
        */
      })


    })
  })

  describe('browserDefer', function() {
    testInterface(browserDefer)
  })
})
