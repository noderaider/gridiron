import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import ErrorFilter from 'app/elements/forms/filters/ErrorFilter'

import { contextTypes } from 'lib/context'
import CorePanel from './base/CorePanel'
import ErrorVisual from 'app/elements/diagnostics/ErrorVisual'

import { dismissError } from 'lib/redux/actions/errors'

class ErrorPanel extends Component {
  render() {
    const { dispatch, errorFilter, errors, isLoading } = this.props
    const categories = Object.keys(errors)

    const renderErrors = category => errors.get(category).map((err, i) =>
      <ErrorVisual
          key={i}
          error={err}
          onDismiss={() => dispatch(dismissError(category, i))}
      />
    )

    return (
      <CorePanel
          title="Error Panel"
          iconName="exclamation-circle"
          iconLoadingName="cog"
          accent="red"
          isLoading={isLoading}>

        <ErrorFilter />

        {errorFilter.api.value ? (
          renderErrors('api')
        ) : null}
        {errorFilter.identity.value ? (
          renderErrors('identity')
        ) : null}
      </CorePanel>
    )
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (!Immutable.is(this.props.errors, nextProps.errors)
            || this.props.errorFilter.api.value !== nextProps.errorFilter.api.value
            || this.props.errorFilter.identity.value !== nextProps.errorFilter.identity.value)
  }
}

function mapStateToProps(state, ownProps) {
  const { form, errors } = state
  return  { errorFilter: form.errorFilter || { api: { value: true }, identity: { value: true } }
          , errors
          , ...ownProps
          }
}

export default connect(mapStateToProps)(ErrorPanel)
