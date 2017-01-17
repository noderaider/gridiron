import React, { Component } from 'react'
import Immutable from 'immutable'
import Gridiron from '../modules/Gridiron'
import Sand from '../modules/Sand'

const defaultProps = (
  { documentsPerPage: 5
  , map: { documents: (state) => Immutable.Map.isMap(state) ? state : Immutable.Map(state).map( (content, header) => Immutable.Map({ header, content }) ) }
  , createSortKeys: (x) => x
  , createSortKeyComparator: (x) => x
  }
)

export default () => (
  <Sand Box={Gridiron.Pager} {...defaultProps}>
    {(pager) => <pre>{JSON.stringify(pager, null, 2)}</pre>}
  </Sand>
)

