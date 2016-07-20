import EventEmitter from 'eventemitter3'
import reactStamp from 'react-stamp'
import solvent from 'solvent'
const should = require('chai').should()

export default function reactPubSub(deps, defaults) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, cloneElement } = React
  const { compose } = reactStamp(React)
  const pubEvent = 'pub'
  const subEvent = 'sub'

  /** Creates a connected pub / sub component template */
  return function pubSub ({ propNames = [], stateNames = [] } = {}) {
    const EE = new EventEmitter()


    const getContext = ({ props = {}
                        , state = {}
                        } = {}) => ({ props, state })

    const getValue = (obj, path) => path.reduce((value, x) => {
      if(value)
        return value[x]
      return null
    }, obj)

    const latest = (pub = {}, sub = {}, path = [], defaultValue) => {
      const pubValue = getValue(pub, path)
      const subValue = getValue(sub, path)
      const pubExists = typeof pubValue !== 'undefined'
      const subExists = typeof subValue !== 'undefined'
      if(!pubExists && !subExists) {
        //console.info('ONE', pubValue, subValue)
        return defaultValue
      } else if(pubExists && !subExists) {
        //console.info('TWO', pubValue, subValue)
        return pubValue
      } else if(!pubExists && subExists) {
        //console.info('THREE', pubValue, subValue)
        return subValue
      } else {
        //console.info('RESOLVE BOTH EXIST', pub, sub)
        return pub.time > sub.time ? pubValue : subValue
      }
    }

    let _reset = false

    function createPub (...desc) {
      return compose( ...desc
                    , { displayName: 'pub'
                      , init() {
                          this._handleSub = ({ props, state }) => {
                            if(this.reset) {
                              this.reset({ props, state }, () => {
                                _reset = false
                              })
                            } else
                              _reset = false
                          }

                          this._handleUpdate = (nextProps, nextState) => {
                            const { props, state } = this
                            const updated = { propNames: propNames.filter(x => nextProps[x] !== props[x])
                                            , stateNames: stateNames.filter(x => nextState[x] !== state[x])
                                            }
                            if(updated.propNames.length > 0 || updated.stateNames.length > 0) {
                              const pub = { props: updated.propNames.reduce((updatedProps, x) => ({ ...updatedProps, [x]: nextProps[x] }), {})
                                          , state: updated.stateNames.reduce((updatedState, x) => ({ ...updatedState, [x]: nextState[x] }), {})
                                          , time: Date.now()
                                          }
                              EE.emit(pubEvent, pub)
                            }
                          }
                        }
                      , componentDidMount() {
                          EE.on(subEvent, this._handleSub)
                        }
                      , componentWillUnmount() {
                          EE.removeListener(subEvent, this._handleSub)
                        }
                      , componentWillUpdate(...args) {
                          if(!_reset)
                            this._handleUpdate(...args)
                        }
                      }
                    )
    }



    function createSub (...desc) {
      return compose( ...desc
                    , { displayName: 'sub'
                      , init() {
                          this._handlePub = pub => {
                            if(!pub.time) {
                              console.warn('HANDLE PUB CALLED ON SUB (BUG, SKIPPING)', pub)
                              return
                            }
                            this.setState({ pub })
                          }
                          this.latest = (...args) => {
                            const { pub, sub } = this.state
                            return latest(pub, sub, ...args)
                          }
                          this.sub = ({ props = {}, state = {} }) => {
                            _reset = true
                            EE.emit(subEvent, { props, state })
                            this.setState({ sub: { props, state, time: Date.now() } }, () => {
                            })
                          }
                        }
                      , state:  { pub: { props: null, state: null, time: 0 }
                                , sub: { props: null, state: null, time: 0 }
                                }
                      , componentDidMount() {
                          EE.on(pubEvent, this._handlePub)
                        }
                      , componentWillUnmount() {
                          EE.removeListener(pubEvent, this._handlePub)
                        }
                      }
                    )
    }


    return  { createPub
            , createSub
            , pub: x => EE.emit(pubEvent, x)
            , sub: x => EE.on(pubEvent, x)
            }
  }
}
