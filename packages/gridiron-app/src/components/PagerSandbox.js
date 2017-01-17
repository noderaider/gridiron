import React, { Component } from 'react'
import Immutable from 'immutable'
import Gridiron from '../modules/Gridiron'
import Sand from '../modules/Sand'

const defaultProps = (
  { documentsPerPage: 5
  , map: { documents: (state) => (state.data.getIn([ 'openflights', 'airlines', 'results' ], Immutable.Map())) } // In([ 'openflights', 'datum', 'airlines', 'results' ], Immutable.Map()) } //.get('results') }
  , createSortKeys: (x) => x
  , createSortKeyComparator: (x) => x
  }
)

export default () => (
  <Sand Box={Gridiron.Pager} {...defaultProps}>
    {/*(pager) => <pre>{JSON.stringify(pager, null, 2)}</pre>*/}
    {(pager) => (
      <div
        style={
          {
          }
        }
      >
        <h4>pager (callback argument) object properties</h4>
        <div>documentsPerPage: {pager.documentsPerPage}</div>
        <div>page: {pager.page}</div>
        <div>typeSingular: {pager.typeSingular}</div>
        <div>typePlural: {pager.typePlural}</div>
        <div>earlyProps: {pager.earlyProps}</div>
        <div>lateProps: {pager.lateProps}</div>
        <h5>status:</h5>
        <pre>{JSON.stringify(pager.status, null, 2)}</pre>
        <h5>actions:</h5>
        <pre>{JSON.stringify(pager.actions, null, 2)}</pre>

{/*
        <pre>{JSON.stringify(pager, null, 2)}</pre>
      */}
      </div>
    )}
  </Sand>
)

