import cn from 'classnames'
const should = require('chai').should()

export default function formsContext (pure) {
  const { React, PropTypes, cloneElement, defaults } = pure

  return context => {
    const { getState
          , subscribe
          , subscribeForm
          , subscribeInput
          , events
          , emit
          } = context

    const getStateValue = (formName, name, defaultValue) => getState().getIn([ formName, name, 'value' ], defaultValue)

    const filterKeys = Object.keys(context).concat([ 'style', 'theme', 'shouldUpdate' ])
    const filterProps = props => Object.entries(props)
      .reduce ( (filtered, [ key, value ]) => filterKeys.includes(key) ? filtered : ({ ...filtered, [key]: value })
              , {}
              )

    return function forms (formName) {
      should.exist(formName, 'formName is required')

      const getFormState = () => getState().get(formName)
      const getFormStateValue = (name, defaultValue) => getStateValue(formName, name, defaultValue)


      const Input = pure(
        { displayName: 'Input'
        , statics:  { formName
                    }
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , name: PropTypes.string.isRequired
                      , type: PropTypes.string.isRequired
                      , initialValue: PropTypes.any
                      , subscribeInput: PropTypes.array
                      , subscribeForm: PropTypes.object
                      , shouldUpdate: PropTypes.func.isRequired
                      }
        , defaultProps: { ...defaults
                        , shouldUpdate: () => true
                        }
        , state:  {
                  }
        , init() {
            this.getStateValue = () => getFormStateValue(this.props.name, this.props.initialValue)

            this.setValue = value => {
              switch(this.input.type) {
                case 'checkbox':
                  this.input.checked = value === true
                  //console.info('SET CHECKBOX', this.props.name, this.input.checked)
                  break
                default:
                  this.input.value = value
                  //console.info('SET DEFAULT', this.props.name, this.input.value)
                  break
              }
            }

            this.getValue = () => {
              if(!this.input)
                return
              const { type, value, checked } = this.input
              switch(type) {
                case 'checkbox':
                  const resolved = checked === true || checked == 'true' || checked == 'checked'
                  //console.info('GET CHECKBOX', this.props.name, checked, resolved)
                  return resolved
                default:
                  //console.info('GET DEFAULT', this.props.name, value)
                  return value
              }
            }
            this.syncValue = (formName, name, initialValue) => {
              const value = getStateValue(formName, name, initialValue)
              this.setValue(value)
            }
          }

        , componentWillMount() {
            const { name, type, initialValue, shouldUpdate } = this.props


            if(this.props.subscribeInput) {
              const target = this.props.subscribeInput
              this.unsubscribeInput = subscribeInput(target, value => {
                //console.info('RECEIVING VALUE', value)
                if(shouldUpdate({ currentValue: this.getValue()
                                , subscribed: value
                                , subscriptionType: 'input'
                                , target
                                })) {
                  this.setValue(value)
                }
              })
            }
            if(this.props.subscribeForm) {
              const { target, targetName, selectValue, selectInitial } = this.props.subscribeForm
              this.unsubscribeForm = subscribeForm(target, inputs => {
                console.info('FORM UPDATE RECEIVED', target, inputs)
                if(shouldUpdate({ currentValue: this.getValue()
                                , subscribed: inputs
                                , subscriptionType: 'form'
                                , target
                                })) {
                  const resolvedName = (typeof targetName === 'function' ? targetName() : targetName)

                  if(resolvedName) {
                    const value = inputs.getIn( [ resolvedName
                                                , 'value'
                                                ] )
                    this.setValue(value)
                  } else if(selectValue) {
                    const value = selectValue(inputs)
                    console.info('SELECT VALUE', value)

                    this.setValue(value)
                  }
                }
              })
            }


            emit(events.registerInput, { formName, name, type, initialValue })

            const value = this.getStateValue()
            if(value) {
              if(type === 'checkbox') {
                this.setState({ defaultChecked: value })
              } else {
                this.setState({ defaultValue: value })
              }
            }
          }
        , componentDidMount() {
            const { name, type, initialValue, shouldUpdate } = this.props

            if(this.props.subscribeInput) {
              const target = this.props.subscribeInput
              const value = getStateValue(...target)
              this.setValue(value)
            }

            if(this.props.subscribeForm) {
              const { target, targetName, selectValue, selectInitial } = this.props.subscribeForm
              if(selectInitial)
                this.syncValue(target, typeof selectInitial === 'function' ? selectInitial() : selectInitial)
            }
          }
        , componentWillUnmount() {
            if(this.unsubscribeInput)
              this.unsubscribeInput()
            if(this.unsubscribeForm)
              this.unsubscribeForm()
          }
        , render() {
            const { styles, theme, name, type, initialValue, ...inputProps } = this.props
            return (
              <span className={cn(styles.inputWrap, theme.inputWrap, styles[`type_${type}`], theme[`type_${type}`] )}>
                <input
                  {...filterProps(inputProps)}
                  {...this.state}
                  ref={x => {
                    this.input = x
                  }}
                  type={type}
                  onChange={e => {
                    emit(events.updateInput, { formName, name, value: this.getValue() })
                  }}
                  className={cn(styles.input, theme.input)}
                />
                <div className={cn(styles.inputUI, theme.inputUI)} />
              </span>
            )
          }
        }
      )


      const Field = pure(
        { displayName: 'Field'
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , align: PropTypes.string.isRequired
                      , label: PropTypes.any
                      }
        , defaultProps: { ...defaults
                        , align: 'left'
                        }
        , init() {

            this.setValue = value => {
              this.inner.setValue(value)
            }

            this.getValue = () => {
              this.inner.getValue()
            }

          }
        , render() {
            const { styles, theme, align, children, ...inputProps } = this.props
            const fieldClass = cn ( styles.field
                                  , theme.field
                                  , align === 'right' ? styles.alignRight : styles.alignLeft
                                  , align === 'right' ? theme.alignRight : theme.alignLeft
                                  )
            const labelSpan = children ? <span className={cn(styles.inputLabel, theme.inputLabel)}>{children}</span> : null
            return (
              <span className={fieldClass}>
                <label className={cn(styles.inputLabel, theme.inputLabel)}>
                  {align === 'left' ? null : labelSpan}
                  <Input ref={x => this.inner = x} {...inputProps} styles={styles} theme={theme} />
                  {align === 'right' ? null : labelSpan}
                </label>
              </span>
            )
          }
        }
      )

      const Submit = pure(
        { displayName: 'Submit'
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , children: PropTypes.any.isRequired
                      }
        , defaultProps: { ...defaults
                        }
        , render() {
            const { styles, theme, children, ...inputProps } = this.props
            return (
              <Field {...inputProps} type="submit" initialValue={children} styles={styles} theme={theme} />
            )
          }
        }
      )



      return  { formName
              , Input
              , Submit
              , Field
              , getState: getFormState
              , getStateValue: getFormStateValue
              , subscribe: cb => subscribeForm(formName, cb)
              , subscribeInput: (name, cb) => subscribeFormInput([ formName, name ], cb)
              }
    }
  }
}
