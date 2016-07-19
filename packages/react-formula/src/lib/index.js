export { logo } from './components'
import cn from 'classnames'
import reactStamp from 'react-stamp'
import reactPubSub from 'react-pub-sub'

const should = require('chai').should()

const applyCapitalization = str => str.length <= 2 ? str.toUpperCase() : `${str[0].toUpperCase()}${str.slice(1)}`

/**
 * reactFormula
 * Requires dependencies { React, Immutable } and component defaults and returns form component factory.
 */
export default function reactFormula (deps, defaults) {
  const { React, Immutable } = deps
  const { Component, PropTypes } = React
  const { compose } = reactStamp(React)

  return function formula(config) {
    const pubSub = reactPubSub({ React })



    const Input = input({})

    return compose(
      { displayName: 'formula'
      , propTypes:  { theme: PropTypes.object.isRequired
                    , styles: PropTypes.object.isRequired
                    , onSubmit: PropTypes.func
                    , onChange: PropTypes.func
                    }
      , defaultProps: { ...defaults
                      }
      , state: { values: {} }
      , init() {
          const { values } = this.state
          this.onChange = ({ name, value }) => {
            this.setState({ values: { ...values, [name]: value } })
          }
        }
      , componentWillMount() {
          const PublicInput = props => (
            <Input
              {...props}
              onChange={x => {
                console.info('CHANGED', x, props)
                if(props.onChange)
                  props.onChange(x)
                this.onChange(x)
              }}
              value={this.state.values[props.name] || false}
            />
          )
          const Label = label({})

          this.setState({ Content: config({ Input: PublicInput, Label: Label }) })
        }
      , render() {
          const { id
                , children
                , styles
                , theme
                , actions
                , enabled
                , onSubmit
                , onChange
                } = this.props

          const formClass = cn( styles.formContainer
                              , theme.formContainer
                              , enabled ? styles.formEnabled : styles.formDisabled
                              , enabled ? theme.formEnabled : theme.formDisabled
                              )




          return (
            <div className={formClass}>
              <form onSubmit={e => {
                if(onSubmit)
                  onSubmit(e)
                e.preventDefault()
              }}>
                {this.state.Content}
              </form>
            </div>
          )
        }
      }
    )
  }

  function label (config) {
    return compose(
      { displayName: 'label'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , children: PropTypes.any.isRequired
                    }
      , defaultProps: { ...defaults
                      }
      , render() {
          const { styles, theme, children } = this.props
          return (
            <label className={cn(styles.input, theme.input)}>
              {children}
            </label>
          )
        }
      }
    )
  }

  function input ({} = {}) {
    return compose(
      { displayName: 'input'
      , propTypes:  { styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , name: PropTypes.string.isRequired
                    , type: PropTypes.string.isRequired
                    , onChange: PropTypes.func.isRequired
                    }
      , defaultProps: { ...defaults
                      }
      , render() {
          const { styles, theme, name, type, onChange, ...inputProps } = this.props
          console.warn('INPUTPROPS', inputProps)
          return (
            <span className={cn(styles.inputContainer, theme.inputContainer)}>
              <input
                {...inputProps}
                type={type}
                onChange={e => {
                  const { value, checked } = e.target
                  if(onChange)
                    onChange({ name, type, value: type === 'checkbox' ? checked : value, e })
                }}

              />
              <div className={cn(styles.inputUI, theme.inputUI)} />
            </span>
          )
        }
      }
    )
  }
}
