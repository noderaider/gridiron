import EventEmitter from 'eventemitter3'
import reactStamp from 'react-stamp'
import solvent from 'solvent'
const should = require('chai').should()

export default function reactPubSub(deps, defaults) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, cloneElement } = React
  const { compose } = reactStamp(React)

  /** Creates a connected pub / sub component template */
  return function pubSub ({ propNames = []
                          , stateNames = []
                          , pubKey = 'pub'
                          , subKey = 'sub'
                          } = {}) {
    const events =  { pub: 'pub'
                    , sub: 'sub'
                    , sub_register: 'sub_register'
                    , sub_deregister: 'sub_deregister'
                    }
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

    function registerListeners(eventKey, listeners = []) {
      const resolved = listeners.filter(x => typeof x === 'function')
      for(let listener of resolved) {
        EE.on(eventKey, listener)
      }
      return function deregisterListeners() {
        for(let listener of resolved) {
          EE.removeListener(eventKey, listener)
        }
      }
    }


    function createPub( desc
                      , { onRegisterSub
                        , onDeregisterSub
                        , onReceiveSub
                        } = {}) {
      return compose( desc
                    , { displayName: `pub${desc.displayName ? `_${desc.displayName}` : ''}`
                      , state:  { [subKey]: {}
                                }
                      , init() {
                          this.__registers = []
                          this.__ignoreUpdates = false
                        /*
                          this._receiveSub = ({ props, state }) => {
                            if(this.reset) {
                              this.reset({ props, state }, () => {
                                _reset = false
                              })
                            } else
                              _reset = false
                          }
                          */

                          this.__handleUpdate = (nextProps, nextState) => {
                            const { props, state } = this
                            const updated = { propNames: propNames.filter(x => nextProps[x] !== props[x])
                                            , stateNames: stateNames.filter(x => nextState[x] !== state[x])
                                            }
                            if(updated.propNames.length > 0 || updated.stateNames.length > 0) {
                              const pub = { props: updated.propNames.reduce((updatedProps, x) => ({ ...updatedProps, [x]: nextProps[x] }), {})
                                          , state: updated.stateNames.reduce((updatedState, x) => ({ ...updatedState, [x]: nextState[x] }), {})
                                          , time: Date.now()
                                          }
                              EE.emit(events.pub, pub)
                            }
                          }

                          this.setLocalState = (newState, cb) => {
                            this.__ignoreUpdates = true
                            this.setState(newState, () => {
                              this.__ignoreUpdates = false
                              if(cb)
                                cb()
                            })
                          }
                        }
                      , componentDidMount() {
                          this.__registers.push(registerListeners(events.register_sub, [ onRegisterSub, this.onRegisterSub, this.props.onRegisterSub ]))
                          this.__registers.push(registerListeners(events.deregister_sub, [ onDeregisterSub, this.onDeregisterSub, this.props.onDeregisterSub ]))
                          this.__registers.push(registerListeners(events.sub, [ onReceiveSub, this.onReceiveSub, this.props.onReceiveSub ]))
                        }
                      , componentWillUnmount() {
                          for(let deregister of this.__registers) {
                            deregister()
                          }
                        }
                      , componentWillUpdate(...args) {
                          if(!this.__ignoreUpdates)
                            this.__handleUpdate(...args)
                        }
                      }
                    )
    }



    function createSub( desc
                      , { onReceivePub
                        } = {}) {
      return compose( desc
                    , { displayName: `sub${desc.displayName ? `_${desc.displayName}` : ''}`
                      , state:  { [pubKey]: { props: null, state: null, time: 0 }
                                , [subKey]: { props: null, state: null, time: 0 }
                                }
                      , init() {
                          this.__registers = []
                          this.__onReceivePub = pub => {
                            const pubState = { [pubKey]: pub }
                            this.setState(pubState)
                          }
                          this.latest = (...args) => {
                            return latest(this.state[pubKey], this.state[subKey], ...args)
                          }
                          this.sendPub = obj => {
                            //_reset = true
                            EE.emit(events.sub, obj)
                            //this.setState({ [subKey]: { props, state, time: Date.now() } }, () => {})
                          }
                          this.setSubState = (newState, cb) => {
                            this.setState({ [subKey]: { state: newState, time: Date.now() } }, () => {
                              if(cb) cb()
                            })
                          }
                        }
                      , componentDidMount() {
                          this.__registers.push(registerListeners(events.pub, [ this.__onReceivePub, onReceivePub, this.onReceivePub, this.props.onReceivePub ]))
                          EE.emit(events.register_sub, { props: this.props, state: this.state })
                        }
                      , componentWillUnmount() {
                          for(let deregister of this.__registers) {
                            deregister()
                          }
                          EE.emit(events.deregister_sub, { props: this.props, state: this.state })
                        }
                      }
                    )
    }


    return  { createPub
            , createSub
            , pub: x => EE.emit(events.pub, x)
            , sub: x => EE.on(events.pub, x)
            }
  }
}
