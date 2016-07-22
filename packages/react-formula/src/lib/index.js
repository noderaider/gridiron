export { logo } from './components'
import cn from 'classnames'
import reactStamp from 'react-stamp'
import dock from './components/dock'
import logo from './components/logo'
import EventEmitter from 'eventemitter3'
import util from 'util'

const should = require('chai').should()

const applyCapitalization = str => str.length <= 2 ? str.toUpperCase() : `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * reactFormula
 * Requires dependencies { React, Immutable } and component defaults and returns form component factory.
 */
export default function reactFormula (deps, defaults) {
  const Dock = dock(deps, defaults)
  const Logo = logo(deps, defaults)
  const { React, ReactDOM, Immutable, reactPre } = deps
  const { Component, PropTypes, cloneElement } = React
  const { Pre } = reactPre
  const { compose } = reactStamp(React)

  should.not.exist(global.__formula__, 'reactFormula should only be called once per application.')

  function formula(formulaID) {
    should.exist(formulaID, 'must specify formulaID')
    if(typeof window !== 'object')
      return { createForm: () => { Input: props => {} } }

    const contextID = `__formula__${formulaID}`
    const rootNodeID = `${contextID}_root`
    let rootNode
    function render(component) {
      if(!rootNode) {
        rootNode = document.createElement('div')
        rootNode.id = rootNodeID
        document.body.appendChild(rootNode)
      }
      ReactDOM.render(component, rootNode)
    }

    function setContext(context) {
      global[contextID] = context
    }
    function getContext() {
      return global[contextID]
    }


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

    const FormsContext = compose (
      { displayName: 'FormsContext'
      , state:  { forms: Immutable.Map()
                , enabled: false
                }
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    }
      , defaultProps: { ...defaults
                      }
      , init() {
          this.__registers = []

          this.onCreateInput = ({ formID, field }) => {
            const fieldsPath = [ formID, field ]
            if(typeof this.state.forms.getIn(fieldsPath) === 'undefined') {
              const forms = this.state.forms.setIn(fieldsPath, '')
              this.setState({ forms })
            }
          }
          this.onUpdateInput = ({ formID, field, value }) => {
            const fieldsPath = [ formID, field ]
            const forms = this.state.forms.setIn(fieldsPath, value)
            console.warn('input updated', util.inspect(forms.toJS()), formID, field, value)
            this.setState({ forms })
          }
        }
      , render() {
          const { visible, styles, theme } = this.props
          const { enabled } = this.state
          return (
            <div id={contextID} ref={setContext} className={cn(styles.FormsContext, theme.FormsContext)}>
              {visible ? (
                <Dock enabled={enabled}>
                  <span className={cn(styles.dockWrap, theme.dockWrap)}>
                    {this.state.forms.entrySeq().map(([ formID, fields ], key) => (
                      <span key={key} className={cn(styles.dockForm, theme.dockForm)}>
                        <div className={cn(styles.dockFormName, theme.dockFormName)}>{formID}</div>
                        <Pre>{fields}</Pre>
                      </span>
                    ))}
                  </span>
                  <button
                    className={cn(styles.dockButton, theme.dockButton)}
                    onClick={() => this.setState({ enabled: !enabled })}
                  >
                    <Logo />
                  </button>
                </Dock>
              ) : null}
              <span className={cn(styles.Forms, theme.Forms)}>
                {this.state.forms.entrySeq().map(([ formID, fields ], key) => (
                  <Form key={key} formID={formID} fields={fields} />
                ))}
              </span>
            </div>
          )
        }
      , componentDidMount() {
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



    const Form = compose(
      { displayName: 'form'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , fields: PropTypes.object.isRequired
                    , onSubmit: PropTypes.func
                    , onChange: PropTypes.func
                    }
      , defaultProps: { ...defaults
                      }
      , init() {
          this.inputs = []
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
                } = this.props

          return (
            <form
              id={formID}
              ref={x => this.form = x}
              onSubmit={onSubmit}
            >
              {fields.entrySeq().map(([ field, value ], key) => (
                <input
                  key={key}
                  ref={x => this.inputs[field] = x}
                  name={field}
                  value={value}
                  type="hidden"
                />
              ))}
            </form>
          )
        }
      }
    )




    function createForm (formID) {
      should.exist(formID, 'formID is required')
      console.warn('CREATE_FORM', formID)

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

            const selectString = `#${formID} input[name="${field}"]`
            console.warn('input mount', selectString)
            const input = document.querySelector(selectString)
            if(typeof input !== 'undefined' && input !== null) {
              if(this.input.type == 'checkbox') {
                if(input.value == 'true') {
                  console.warn('setting "CHECKED" checkbox value =>', input.value, `|typeof ${typeof input.value}|`, this.input.value, this.input.checked, this.input.type, this.input)
                  //this.input.setAttribute('checked', 'checked')
                  this.input.checked = true
                } else //if(input.value === false) {
                  console.warn('removing "CHECKED" checkbox value =>', input.value, `|typeof ${typeof input.value}|`, this.input.value, this.input.checked, this.input.type, this.input)
                  this.input.removeAttribute('checked')
                  /*
                } else {
                  //throw new Error('Checkbox must have boolean value')
                }
                */
              } else {
                console.warn('setting value', input.value, this.input.value, this.input.type, this.input)
                this.input.value = input.value
              }
            } else {
              console.warn('skipping value', input)
            }
          }
        , render() {
            const field = this.props.name
            const { styles, theme, name, type, initialValue, ...inputProps } = this.props
            const value = this.props.value || initialValue
            return (
              <label className={cn(styles.inputLabel, theme.inputLabel)}>
                <Pre>{this.props}</Pre>
                <input
                  {...inputProps}
                  ref={x => this.input = x}
                  type={type}
                  onChange={e => {
                    const { value, checked } = e.target
                    EE.emit(events.updateInput, { formID, field, value: type === 'checkbox' ? checked : value })
                  }}
                />
                <div className={cn(styles.inputUI, theme.inputUI)} />
              </label>
            )
          }
        }
      )
      return { Input }
    }

    render(<FormsContext visible={true} />)
    return { createForm }
  }
  return formula
}
