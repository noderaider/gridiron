import React, { Component } from 'react'
import Immutable from 'immutable'
import gridiron from '../modules/gridiron'
import sand from 'react-sand'

const Sand = sand({ React })

const defaultProps = (
  { documentsPerPage: 5
  , map: { documents: (state) => Immutable.Map.isMap(state) ? state : Immutable.Map(state).map( (content, header) => Immutable.Map({ header, content }) ) }
  }
)

export default class PagerSandbox extends Component {
  render() {
    return (
      <Sand Box={gridiron.Pager} {...defaultProps}>
        {(pager) => <pre>{JSON.stringify(pager, null, 2)}</pre>}
      </Sand>
    )
  }
}

