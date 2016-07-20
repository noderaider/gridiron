export { logo } from './components'
import cn from 'classnames'
import reactStamp from 'react-stamp'
import reactPubSub from 'react-pub-sub'
import EventEmitter from 'eventemitter3'

const should = require('chai').should()

const applyCapitalization = str => str.length <= 2 ? str.toUpperCase() : `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * reactFormula
 * Requires dependencies { React, Immutable } and component defaults and returns form component factory.
 */
export default function reactFormula (deps, defaults) {
  const { React, Immutable, reactPre } = deps
  const { Component, PropTypes } = React
  const { Pre } = reactPre
  const { compose } = reactStamp(React)

  should.not.exist(global.__formula__, 'reactFormula should only be called once per application.')
  let __formula__ = global.__formula__ = Immutable.Map()


  function formula(formulaID) {
    __formula__ = __formula__.set(formulaID, Immutable.Map())

    const EE = new EventEmitter()
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
    const events =  { createForm: 'createForm'
                    , createInput: 'createInput'
                    , updateInput: 'updateInput'
                    }


    //const pubSub = reactPubSub({ React })
    //const { createPub, createSub, pub, sub } = pubSub({ stateNames: [ 'forms' ] })

    const Form = compose(
      { displayName: 'form'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , fields: PropTypes.array.isRequired
                    , values: PropTypes.object.isRequired
                    , onSubmit: PropTypes.func
                    , onChange: PropTypes.func
                    }
      , defaultProps: { ...defaults
                      }
                      /*
      , state:  { fields: []
                , values: {}
                }
                */
      , init() {
          this.inputs = []
          /*
          this.onChange = ({ name, value }) => {
            const { values } = this.state
            this.setState({ values: { ...values, [name]: value } })
          }
          */
          this.onSubmit = e => {
            if(this.props.onSubmit)
              this.props.onSubmit(e)
            e.preventDefault()
          }
        }
      , render() {
          const { formID
                , children
                , styles
                , theme
                , actions
                , enabled
                , onSubmit
                , onChange

                , fields
                , values
                } = this.props

          //const { fields, values } = this.state

          return (
            <form
              id={formID}
              ref={x => this.form = x}
              onSubmit={onSubmit}
            >
              {fields.map((field, key) => (
                <input
                  key={key}
                  ref={x => this.inputs[field] = x}
                  name={field}
                  value={values[field]}
                  type="hidden"
                />
              ))}
            </form>
          )
        }
      }
    )

    // form: { fields: [ 'field_one', 'field_two' ], values: { field_one: true } }

    const contextID = `__formula_${formulaID}`

    const FormsContext = compose (
      { displayName: 'FormsContext'
      //, state: { forms: Immutable.Map({ [formulaID]: Immutable.Map() }) }
      , init() {
          this.__registers = []
          /*
          this.onCreateForm = ({ formID }) => {
            console.warn('FORM CREATTTTTED !!!!', forms)
            const { forms } = this.state
            this.setState({ forms: { ...forms, [formID]: { fields: [] } } })
          }
          */
          this.onCreateInput = ({ formID, field }) => {
            //const { forms } = this.state
            console.warn('input created', __formula__)
            __formula__ = __formula__.updateIn([ formulaID, formID, field ], Immutable.Map(), x => x)
            this.forceUpdate()
            /*
            const form = forms[formID]
            this.setState({ forms:  { ...forms
                                    , [formID]: { ...form
                                                , fields: [ ...form.fields, field ]
                                                }
                                    }
                          })
                          */
          }
          this.onUpdateInput = ({ formID, field, value }) => {
            //const { forms } = this.state
            console.warn('input updated', formID, field, value)
            __formula__ = __formula__.setIn([ formulaID, formID, field, 'value' ], value )
            this.forceUpdate()
            /*
            const form = forms[formID]
            this.setState({ forms:  { ...forms
                                    , [formID]: { ...form
                                            , fields: [ ...fields, field ]
                                            , values: { ...form.values, [field]: value }
                                            }
                                    }
                          })
                          */
          }
        }
      , render() {
          const { visible } = this.props
          const forms = __formula__.get(formulaID)
          if(!forms) {
            console.warn('NO FORMS FOUND AT FORMULA ID')
            return <span>NO FORMS</span>
          }
          //const { forms } = this.state
          return (
            <div id={contextID}>
              {forms.entrySeq().map(([ formID, value ], key) => {
                //const form = __formula__.getIn([ formulaID, formID ]).toJS()
                const form = value.toJS()
                return (
                  <div key={key}>
                    <Pre>{{ [formID]: form }}</Pre>
                    <Form formID={formID} {...form} />
                  </div>
                )
              })}
            </div>
          )
          /*
              {visible ? <Pre>{this.state}</Pre> : null}
              {forms ? Object.keys(forms).map((formID, key) => <Form key={key} {...forms[formID]} />) : <span>NO FORMS</span>}
              */
        }
      , componentDidMount() {
          //this.__registers.push(registerListeners(events.createForm, [ this.onCreateForm ]))
          this.__registers.push(registerListeners(events.createInput, [ this.onCreateInput ]))
          this.__registers.push(registerListeners(events.updateInput, [ this.onUpdateInput ]))
        }
      , componentWillUnmount() {
          while(this.__registers.length > 0) {
            this.__registers.pop()()
          }
        }
      }
    )


    function createForm (formID) {
      should.exist(formID, 'formID is required')
      console.warn('CREATE_FORM', formID)
      /*
      EE.emit(events.createForm, { formID })
      */

/*
      function createInput (field, { type = 'text', initialValue } = {}) {
        should.exist(field, 'field is required')
        EE.emit(events.createInput, { formID, field })
        */

        const Input = compose(
          { displayName: 'input'
          , propTypes:  { styles: PropTypes.object.isRequired
                        , theme: PropTypes.object.isRequired
                        , name: PropTypes.string.isRequired
                        , type: PropTypes.string.isRequired
                        , initialValue: PropTypes.any
                        //, onChange: PropTypes.func.isRequired
                        }
          , defaultProps: { ...defaults
                          }
          , componentDidMount() {
              const field = this.props.name
              EE.emit(events.createInput, { formID, field })
              const value = document.querySelector(`#${formID} input[name="${field}"]`).getAttribute('value')
              console.warn('setting value', value)
              this.input.value = value
            }
          , render() {
              const field = this.props.name
              const { styles, theme, name, type, initialValue, onChange, ...inputProps } = this.props
              const value = this.props.value || initialValue
              return (
                <label className={cn(styles.inputLabel, theme.inputLabel)}>
                  <Pre>{this.state}</Pre>
                  <input
                    {...inputProps}
                    ref={x => this.input = x}
                    type={type}
                    onChange={e => {
                      const { value, checked } = e.target
                      EE.emit(events.updateInput, { formID, field, value: type === 'checkbox' ? checked : value })
                      /*
                      if(onChange)
                        onChange({ name, type, value: type === 'checkbox' ? checked : value, e })
                      */
                    }}
                  />
                  <div className={cn(styles.inputUI, theme.inputUI)} />
                </label>
              )
            }
          }
        )
        /*
        return Input
      }
      */

      return Input
    }
    return { FormsContext, createForm }
  }
  return formula
}
