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
  const { React, ReactDOM, Immutable, shallowCompare, reactPre } = deps
  const { Component, PropTypes, cloneElement } = React
  const { Pre } = reactPre
  const { compose } = reactStamp(React)

  should.not.exist(global.__formula__, 'reactFormula should only be called once per application.')

  function formula(formulaID) {
    should.exist(formulaID, 'must specify formulaID')
    if(typeof window !== 'object')
      return () => { Input: props => {} }

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
    const events =  { registerInput: 'registerInput'
                    , updateInput: 'updateInput'
                    , formsWillUpdate: 'formsWillUpdate'
                    , formWillUpdate: formName => `formWillUpdate_${formName}`
                    , inputWillUpdate: (formName, name) => `inputWillUpdate_${formName}_${name}`
                    }

    const stylePropTypes = ({ theme: PropTypes.object.isRequired
                            , styles: PropTypes.object.isRequired
                            })




    const FormsContext = compose (
      { displayName: 'FormsContext'
      , propTypes:  { ...stylePropTypes
                    }
      , defaultProps: { ...defaults
                      }
      , shouldComponentUpdate(nextProps) {
          return shallowCompare(this, nextProps)
        }
      , init() {
          this.busy = work => {
            if(this.devTools)
              return this.devTools.busy(work)
            return work(() => {})
          }
        }
      , render() {
          const { showDevTools, styles, theme } = this.props
          return (
            <div id={contextID} ref={setContext} className={cn(styles.FormsContext, theme.FormsContext)}>
              <FormsState busy={this.busy}>
                {forms => showDevTools ? <DevTools ref={x => this.devTools = x} forms={forms} /> : null}
              </FormsState>
            </div>
          )
        }
      }
    )

    const select =  { inputValue: (formName, name) => [ formName, name, 'value' ]
                    , inputType: (formName, name) => [ formName, name, 'type' ]
                    }

    const FormsState = compose (
      { displayName: 'FormsState'
      , state:  { forms: Immutable.Map()
                }
      , propTypes:  { ...stylePropTypes
                    , busy: PropTypes.func.isRequired
                    }
      , defaultProps: { ...defaults
                      }
      , init() {
          const { busy } = this.props
          this.__registers = []

          this.onRegisterInput = ({ formName, name, initialValue = '', type }) => {
            const path = select.inputValue(formName, name)
            if(typeof this.state.forms.getIn(path) === 'undefined') {
              busy(notBusy => {
                const forms = this.state.forms.setIn(path, initialValue)
                if(type)
                  this.state.forms.setIn(select.inputType(formName, name), type)
                this.setState({ forms }, notBusy)
              })
            }
          }
          this.onUpdateInput = ({ formName, name, value }) => {
            busy(notBusy => {
              const path = select.inputValue(formName, name)
              const forms = this.state.forms.setIn(path, value)
              this.setState({ forms }, notBusy)
            })
          }

        }
      , componentDidMount() {
          this.__registers.push(registerListeners(events.registerInput, [ this.onRegisterInput ]))
          this.__registers.push(registerListeners(events.updateInput, [ this.onUpdateInput ]))
        }
      , componentWillUnmount() {
          while(this.__registers.length > 0) {
            this.__registers.pop()()
          }
        }
      , shouldComponentUpdate(nextProps, nextState) {
          if(shallowCompare(this, nextProps, nextState)) {
            EE.emit(events.formsWillUpdate, nextState.forms)
            return true
          }
          return false
        }
      , render() {
          const { styles, theme, children } = this.props
          const { forms } = this.state
          return (
            <span className={cn(styles.Forms, theme.Forms)}>
              {forms.entrySeq().map(([ formName, inputs ], key) => (
                <FormState key={key} formName={formName} inputs={inputs} />
              ))}
              {children(forms)}
            </span>
          )
        }
      }
    )

    const FormState = compose(
      { displayName: 'FormState'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , formName: PropTypes.string.isRequired
                    , inputs: PropTypes.object.isRequired
                    , onSubmit: PropTypes.func
                    , onChange: PropTypes.func
                    }
      , defaultProps: { ...defaults
                      }
      , shouldComponentUpdate(nextProps) {
          if(shallowCompare(this, nextProps)) {
            const { formName } = this.props
            EE.emit(events.formWillUpdate(formName), nextProps.inputs)
            return true
          }
          return false
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
          const { styles
                , theme
                , formName
                , inputs
                , onSubmit
                } = this.props

          return (
            <form
              id={formName}
              ref={x => this.form = x}
              onSubmit={onSubmit}
            >
              {inputs.entrySeq().map(([ name, meta ], key) => (
                <InputState key={key} formName={formName} name={name} value={meta.get('value')} type={meta.get('type')} />
              ))}
            </form>
          )
        }
      }
    )

    const InputState = compose(
      { displayName: 'InputState'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , formName: PropTypes.string.isRequired
                    , name: PropTypes.string.isRequired
                    , value: PropTypes.any.isRequired
                    , type: PropTypes.string
                    }
      , defaultProps: { ...defaults
                      }
      , shouldComponentUpdate(nextProps) {
          if(shallowCompare(this, nextProps)) {
            const { formName, name } = this.props
            EE.emit(events.inputWillUpdate(formName, name), nextProps.value)
            return true
          }
          return false
        }
      , render() {
          const { name, value } = this.props
          return (
            <input
              ref={x => this.input = x}
              name={name}
              value={value}
              type="hidden"
            />
          )
        }
      }
    )


    const DevTools = compose (
      { displayName: 'DevTools'
      , propTypes:  { ...stylePropTypes
                    , forms: PropTypes.object.isRequired
                    }
      , defaultProps: defaults
      , init() {
          this.busy = work => {
            if(this.logo) {
              requestAnimationFrame(() => this.logo.busy())
              work(() => setTimeout(() => requestAnimationFrame(() => this.logo.notBusy()), 100))
            }
          }

          this.toggle = () => {
            if(this.dock)
              this.dock.toggle(done)
          }
        }
      , shouldComponentUpdate(nextProps) {
          return shallowCompare(this, nextProps)
        }
      , render() {
          const { styles, theme, forms } = this.props

          return (
            <Dock
              ref={x => this.dock = x}
              busy={this.busy}
              toggleContent={(
                <Logo ref={x => this.logo = x} />
              )}
            >
              <div className={cn(styles.dockWrap, theme.dockWrap)}>
                <div className={cn(styles.dockTitle, theme.dockTitle)}>react-∳ormula</div>
                <div className={cn(styles.dockEntries, theme.dockEntries)}>
                  <FormsView forms={forms} />
                </div>
              </div>
            </Dock>
          )

        }
      }
    )


    const FormsView = compose (
      { displayName: 'FormsView'
      , propTypes:  { ...stylePropTypes
                    , forms: PropTypes.object.isRequired
                    }
      , defaultProps: defaults
      , shouldComponentUpdate(nextProps) {
          return shallowCompare(this, nextProps)
        }
      , render() {
          const { styles, theme, forms } = this.props
          return forms ? (
            <span>
              {forms.entrySeq().map(([ formName, inputs ], key) => (
                <span key={key} className={cn(styles.dockForm, theme.dockForm)}>
                  <div className={cn(styles.dockFormName, theme.dockFormName)}>{formName}</div>
                  <div className={cn(styles.dockFormFields, theme.dockFormFields)}>
                    {inputs.entrySeq().map(([ name, meta ], key) => (
                      <div key={key} className={cn(styles.dockFormEntry, theme.dockFormEntry)}>{name}: <Pre>{meta.get('value')}</Pre></div>
                    ))}
                  </div>
                </span>
              ))}
            </span>
          ) : null
        }
      }
    )

    let currentState = Immutable.Map()
    EE.on(events.formsWillUpdate, newState => {
      currentState = newState
    })
    const getState = () => currentState

    const subscribe = (formNames, cb) => {
      const onChange = (...args) => {
        console.warn('SUBSCRIBE EVENT', currentState.toJS(), ...args)
        cb(formNames.map(name => currentState.get(name)))
      }
      return formNames.map(formName => {
        EE.on(events.formWillUpdate(formName), onChange)
        return () => EE.removeListener(events.formWillUpdate(formName), onChange)
      })
    }

    function forms (formName) {
      should.exist(formName, 'formName is required')

      const getFormState = () => {
        return currentState.get(formName)
      }



      const Input = compose(
        { displayName: 'input'
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , name: PropTypes.string.isRequired
                      , type: PropTypes.string.isRequired
                      , initialValue: PropTypes.any
                      }
        , defaultProps: { ...defaults
                        }
        , init() {
            this.getInputState = () => {
              const { name, initialValue } = this.props
              return currentState.getIn(select.inputValue(formName, name), initialValue)
            }
          }
        , shouldComponentUpdate(nextProps, nextState) {
            return shallowCompare(this, nextProps, nextState)
          }
        , componentDidMount() {
            const { name, type, initialValue } = this.props
            EE.emit(events.registerInput, { formName, name, type, initialValue })

            const selectString = `#${formName} input[name="${name}"]`
            const input = document.querySelector(selectString)
            if(typeof input !== 'undefined' && input !== null) {
              if(this.input.type == 'checkbox') {
                if(input.value == 'true') {
                  this.input.checked = true
                } else
                  this.input.removeAttribute('checked')
              } else {
                this.input.value = input.value
              }
            } else {
              //console.info('skipping value', input)
            }
          }
        , render() {
            const { styles, theme, name, type, initialValue, ...inputProps } = this.props
            const value = this.props.value || initialValue
            return (
              <span className={cn(styles.inputWrap, theme.inputWrap, styles[`type_${type}`], theme[`type_${type}`] )}>
                <input
                  {...inputProps}
                  ref={x => this.input = x}
                  type={type}
                  onChange={e => {
                    const { value, checked } = e.target
                    EE.emit(events.updateInput, { formName, name, value: type === 'checkbox' ? checked : value })
                  }}
                  className={cn(styles.input, theme.input)}
                />
                <div className={cn(styles.inputUI, theme.inputUI)} />
              </span>
            )
          }
        }
      )

      const Field = compose(
        { displayName: 'field'
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , align: PropTypes.string.isRequired
                      , label: PropTypes.any
                      }
        , defaultProps: { ...defaults
                        , align: 'left'
                        }
        , shouldComponentUpdate(nextProps) {
            return shallowCompare(this, nextProps)
          }
        , render() {
            const { styles, theme, align, label, ...inputProps } = this.props
            const fieldClass = cn ( styles.field
                                  , theme.field
                                  , align === 'right' ? styles.alignRight : styles.alignLeft
                                  , align === 'right' ? theme.alignRight : theme.alignLeft
                                  )
            const labelSpan = <span className={cn(styles.inputLabel, theme.inputLabel)}>{label}</span>
            return (
              <span className={fieldClass}>
                <label className={cn(styles.inputLabel, theme.inputLabel)}>
                  {align === 'left' ? null : labelSpan}
                  <Input {...inputProps} styles={styles} theme={theme} />
                  {align === 'right' ? null : labelSpan}
                </label>
              </span>
            )
          }
        }
      )

      const Submit = compose(
        { displayName: 'submit'
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , children: PropTypes.any.isRequired
                      }
        , defaultProps: { ...defaults
                        }
        , shouldComponentUpdate(nextProps) {
            return shallowCompare(this, nextProps)
          }
        , render() {
            const { styles, theme, children, ...inputProps } = this.props
            return (
              <Field {...inputProps} type="submit" initialValue={children} styles={styles} theme={theme} />
            )
          }
        }
      )



      return  { Input
              , Submit
              , Field
              , getFormState
              , subscribe: cb => subscribe([ formName ], formStates => cb(formStates[0]))
              }
    }


    Object.assign(forms, { getState, subscribe })

    render(<FormsContext showDevTools={true} />)
    return forms
  }
  return formula
}
