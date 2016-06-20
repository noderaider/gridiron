import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

@reduxForm( { form: 'errorFilter'
            , fields: ['api', 'identity']
            , initialValues: { api: true, identity: true }
            } )
export default class ErrorFilter extends Component {
  render() {
    const { fields: { api, identity
                    }
          , handleSubmit
          , submitting
          } = this.props

    let divStyle = { display:'inline-block', marginRight:10 }
    return (
        <form>
          <div style={divStyle}>
            <label>
              <input type="checkbox" {...api} /> api
            </label>
          </div>
          <div style={divStyle}>
            <label>
              <input type="checkbox" {...identity} /> identity
            </label>
          </div>
        </form>
    )
  }
}
