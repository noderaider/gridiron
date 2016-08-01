import cn from 'classnames'
import formsContext from './formsContext'
import dock from './components/dock'
import logo from './components/logo'
import EventEmitter from 'eventemitter3'
import util from 'util'
import pureStamp from 'pure-stamp'

const should = require('chai').should()

const APP_SCOPE = 'app'
const GLOBAL_KEY = '__FORMULA__'

/**
 * reactFormula
 * Requires dependencies { React, Immutable } and component defaults and returns form component factory.
 */
export default function reactFormula (deps, { appScopeName = 'app', ...defaults } = {}) {
  const pure = pureStamp(deps, defaults)
  const { React, PropTypes, cloneElement, ReactDOM, Immutable, Pre } = pure
  const Dock = dock(pure)
  const Logo = logo(pure)


  /** This is just here to throw errors if the user is accidentally instantiating formula twice. */
  should.not.exist(global[GLOBAL_KEY], 'react-formula: reactFormula function should only be called once per application.')

  function scope(scopeName) {
    should.exist(scopeName, 'react-formula: scope function requires a unique scopeName.')

    const SCOPE_ID = `__formula__${scopeName}`
    const SCOPE_DOM_ID = `${SCOPE_ID}_root`

    const access =  { get scope() { return global[SCOPE_ID] }
                    , set scope(value) { global[SCOPE_ID] = value }
                    , getDOMNode() {
                        if(typeof window !== 'object')
                          return console.warn('react-formula: bypassing rendering on server.')
                        let rootNode = document.getElementById(SCOPE_DOM_ID)
                        if(rootNode)
                          return rootNode
                        rootNode = document.createElement('div')
                        rootNode.id = SCOPE_DOM_ID
                        document.body.appendChild(rootNode)
                        return rootNode
                      }
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
                    , formsDidUpdate: 'formsDidUpdate'
                    , formWillUpdate: formName => `formWillUpdate_${formName}`
                    , inputWillUpdate: (formName, name) => `inputWillUpdate_${formName}_${name}`
                    }

    const stylePropTypes = ({ theme: PropTypes.object.isRequired
                            , styles: PropTypes.object.isRequired
                            })


    const FormsContext = pure (
      { displayName: 'FormsContext'
      , propTypes:  { ...stylePropTypes
                    }
      , defaultProps: { ...defaults
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
            <div id={SCOPE_ID} ref={x => access.scope = x} className={cn(styles.FormsContext, theme.FormsContext)}>
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

    const FormsState = pure (
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
          this.forms = Immutable.Map()

          this.onRegisterInput = ({ formName, name, initialValue = '', type }) => {
            const path = select.inputValue(formName, name)

            if(typeof this.forms.getIn(path) === 'undefined') {
              busy(notBusy => {
                this.forms = this.forms.setIn(path, initialValue)
                this.setState({ forms: this.forms }, notBusy)
                /*
                  : type ? forms.setIn(select.inputType(formName, name), type)
                  : forms
                */
              })
            }
          }
          this.onUpdateInput = ({ formName, name, value }) => {
            busy(notBusy => {
              const path = select.inputValue(formName, name)
              this.forms = this.forms.setIn(path, value)
              this.setState({ forms: this.forms }, notBusy)
            })
          }

        }
      , componentWillMount() {
          this.__registers.push(registerListeners(events.registerInput, [ this.onRegisterInput ]))
          this.__registers.push(registerListeners(events.updateInput, [ this.onUpdateInput ]))
        }
      , componentWillUnmount() {
          while(this.__registers.length > 0) {
            this.__registers.pop()()
          }
        }
      , componentDidUpdate(prevProps, prevState) {
          if(prevState.forms !== this.state.forms)
            EE.emit(events.formsDidUpdate, this.state.forms)
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

    const FormState = pure (
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
      , componentWillReceiveProps(nextProps) {
          const { formName, inputs } = this.props
          if(inputs !== nextProps.inputs)
            EE.emit(events.formWillUpdate(formName), nextProps.inputs)
        }
      , init() {
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

    const InputState = pure (
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
      , init() {
          this.emitValue = value => {
            const { formName, name } = this.props
            EE.emit(events.inputWillUpdate(formName, name), value)
          }
        }
      , componentWillMount() {
        this.emitValue(this.props.value)
      }
      , componentWillReceiveProps(nextProps) {
          if(this.props.value !== nextProps.value)
            this.emitValue(nextProps.value)
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


    const DevTools = pure (
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


    const FormsView = pure (
      { displayName: 'FormsView'
      , propTypes:  { ...stylePropTypes
                    , forms: PropTypes.object.isRequired
                    }
      , defaultProps: defaults
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
    EE.on(events.formsDidUpdate, newState => {
      currentState = newState
    })
    const getState = () => currentState

    const subscribe = (formNames, cb) => {
      console.warn('SUBSCRIBE', formNames)
      return formNames.map(formName => subscribeForm(formName, (...args) => {
        cb(formNames.map(name => currentState.get(name)))
      }))
    }

    function subscribeForm (formName, cb) {
      EE.on(events.formWillUpdate(formName), cb)
      return () => EE.removeListener(events.formWillUpdate(formName), cb)
    }

    const subscribeInput = ([ formName, name ], cb) => {
      EE.on(events.inputWillUpdate(formName, name), cb)
      return () => EE.removeListener(events.inputWillUpdate(formName, name), cb)
    }


    const forms = formsContext(pure)( { getState
                                      , subscribe
                                      , subscribeForm
                                      , subscribeInput
                                      , events
                                      , emit: (...args) => EE.emit(...args)
                                      } )


    const domNode = access.getDOMNode()
    if(domNode)
      ReactDOM.render(<FormsContext showDevTools={true} />, domNode)

    forms.getState = getState
    forms.subscribe = subscribe
    forms.subscribeInput = subscribeInput
    return Object.assign(forms, { getState, subscribe, subscribeInput })
  }
  let formula = scope(APP_SCOPE)
  formula.scope = scope
  Object.freeze(formula)
  Object.freeze(formula.scope)
  return formula
}
