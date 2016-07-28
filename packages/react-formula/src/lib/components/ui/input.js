

      const Input = composePure(
        { displayName: 'Input'
        , statics:  { formName
                    }
        , propTypes:  { styles: PropTypes.object.isRequired
                      , theme: PropTypes.object.isRequired
                      , name: PropTypes.string.isRequired
                      , type: PropTypes.string.isRequired
                      , initialValue: PropTypes.any
                      , subscribeInput: PropTypes.object
                      , subscribeForm: PropTypes.object
                      , shouldUpdate: PropTypes.func.isRequired
                      }
        , defaultProps: { ...defaults
                        , shouldUpdate: () => true
                        }
        , init() {
            this.getInputState = () => {
              const { name, initialValue } = this.props
              return currentState.getIn(select.inputValue(formName, name), initialValue)
            }

            this.setValue = value => {
              switch(this.input.type) {
                case 'checkbox':
                  if(value == 'true' || value == true || value == 'checked')
                    this.input.checked = true
                  else
                    this.input.removeAttribute('checked')
                  break
                default:
                  this.input.value = value
                  break
              }
            }

            this.getValue = () => {
              const { type, value, checked } = this.input
              switch(type) {
                case 'checkbox':
                  return checked == 'true' || checked == 'checked'
                default:
                  return value
              }
            }
            this.syncValue = target => {
              const value = getState().getIn(select.inputValue(...target))
              this.setValue(value)
            }
          }
        , componentDidMount() {
            const { name, type, initialValue, shouldUpdate } = this.props
            EE.emit(events.registerInput, { formName, name, type, initialValue })

            const selectString = `#${formName} input[name="${name}"]`
            const input = document.querySelector(selectString)
            if(typeof input !== 'undefined' && input !== null) {
              this.setValue(input.value)
            } else {
              //console.info('skipping value', input)
            }

            if(this.props.subscribeInput) {
              const target = this.props.subscribeInput
              this.unsubscribeInput = subscribeInput(target, value => {
                if(shouldUpdate({ currentValue: this.getValue()
                                , subscribed: value
                                , subscriptionType: 'input'
                                , target
                                })) {
                  this.setValue(value)
                }
              })
              this.syncValue(target)
            }
            if(this.props.subscribeForm) {
              const { target, targetName, selectValue, selectInitial } = this.props.subscribeForm
              this.unsubscribeForm = subscribeForm(target, inputs => {
                if(shouldUpdate({ currentValue: this.getValue()
                                , subscribed: inputs
                                , subscriptionType: 'form'
                                , target
                                })) {
                  const resolvedName = (typeof targetName === 'function' ? targetName() : targetName)
                  if(resolvedName) {
                    this.setValue(inputs.getIn( [ resolvedName
                                                , 'value'
                                                ] ))
                  } else if(selectValue) {
                    this.setValue(selectValue(inputs))
                  }
                }
              })
              if(selectInitial)
                this.syncValue({ formName: target, name: typeof selectInitial === 'function' ? selectInitial() : selectInitial })
            }
          }
        , componentWillUnmount() {
            if(this.unsubscribeInput)
              this.unsubscribeInput()
            if(this.unsubscribeForm)
              this.unsubscribeForm()
          }
        , render() {
            const { styles, theme, name, type, initialValue, subscribeTo, ...inputProps } = this.props
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
