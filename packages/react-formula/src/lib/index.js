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
  const pubSub = reactPubSub({ React })

  let forms = []

  const FormsContext = compose(
    { displayName: 'FormsContext'
    , render() {
        <div>
          {forms.map((Form, key) => <Form key={key} />)}
        </div>
      }
    }
  )

  function formula(formulaName) {

    return function createForm ({ id = `${formulaName}_${forms.length}` } = {}) {
      const { createPub, createSub } = pubSub({ stateNames: [ 'fields', 'values' ] })

      const Form = createPub(
        { displayName: 'formula'
        , propTypes:  { theme: PropTypes.object.isRequired
                      , styles: PropTypes.object.isRequired
                      , values: PropTypes.object.isRequired
                      , onSubmit: PropTypes.func
                      , onChange: PropTypes.func
                      }
        , defaultProps: { ...defaults
                        }
        , state: { values: {} }
        , init() {
            this.inputs = []
            this.onChange = ({ name, value }) => {
              const { values } = this.state
              this.setState({ values: { ...values, [name]: value } })
            }
            this.onSubmit = e => {
              if(this.props.onSubmit)
                this.props.onSubmit(e)
              e.preventDefault()
            }
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

            const values = { ...this.props.values, ...this.state.values }
            const { fields, values } = this.state.sub

            return (
              <form
                id={id}
                ref={x => this.form = x}
                onSubmit={this.onSubmit}
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

      function createInput ({ field, type = 'text', value } = {}) {

        return createSub(
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
              const { pub } = this.state
              const { type } = field
              const value = this.props.value || field.value
              return (
                <label className={cn(styles.inputLabel, theme.inputLabel)}>
                  <pre>{util.inspect(pub)}</pre>
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
                </label>
              )
            }
          }
        )
      }

      forms.push(Form)
      return createInput
    }
    return { FormsContext, formula }
  }
}
