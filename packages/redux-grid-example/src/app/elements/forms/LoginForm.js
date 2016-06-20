import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Row, Col } from 'react-bootstrap'
import Input from './controls/Input'
import { contextTypes } from 'lib/context'

const validate = values => {
  const errors = {}
  if (!values.username)
    errors.username = 'Required'
  else if (values.username.length > 15)
    errors.username = 'Must be 15 characters or less'
  return errors
}

class LoginForm extends Component {
  static contextTypes = contextTypes;
  static propTypes =  { fields: PropTypes.object.isRequired
                      , handleSubmit: PropTypes.func.isRequired
                      , submitting: PropTypes.bool.isRequired
                      , onForgotPasswordClick: PropTypes.func.isRequired
                      };
  componentDidMount() {
    if(this.username)
      this.username.input.focus()
  }
  render() {
    const { fields: { username, password, rememberMe }, resetForm, handleSubmit, submitting, onForgotPasswordClick } = this.props
    const { theme: { palette, color, style }, gridProps } = this.context

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group p-top-10">
          <Input
            ref={x => this.username=x}
            type="text"
            placeholder="Username"
            className="form-control"
            {...username}
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            placeholder="Password"
            className="form-control"
            {...password}
          />
        </div>

        <Row>
          <Col xs={8} sm={8} pullLeft>
            <div style={{ fontSize: 12 }} className="pull-left p-top-10" htmlFor="loginSubmit">
              {'If you forgot your username or password '}
              <a onClick={onForgotPasswordClick} style={style.link}>
                click here
              </a>
            </div>
          </Col>
          <Col xs={4} pullRight>

                type="submit"
                style={style.bold}
                className="btn btn-default btn-stretch pull-right"
                disabled={submitting}
                onClick={handleSubmit}>
              Login
            </button>
          </Col>
        </Row>
      </form>
    )
  }
}

export default reduxForm( { form: 'login'
                          , fields: ['username', 'password', 'rememberMe']
                          , validate
                          })(LoginForm)
