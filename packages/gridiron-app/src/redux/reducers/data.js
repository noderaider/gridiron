import Immutable from 'immutable'
import { initialState, idSelector } from '../actions/data'
import { STREAM_DATA_START, STREAM_DATA_META, STREAM_DATA_RECEIVE, STREAM_DATA_COMPLETE } from '../constants'
const should = require('chai').should()


const subscribed =  [ STREAM_DATA_START
                    , STREAM_DATA_META
                    , STREAM_DATA_RECEIVE
                    , STREAM_DATA_COMPLETE
                    ]

export default function data (state = initialState, actions = {}) {
  const { type, payload } = actions
  if(!subscribed.includes(type))
    return state

  const { id, meta, batchID, batch } = payload
  should.exist(id, 'id path to data should exist.')
  id.should.be.instanceof(Array, 'id must be an array.')

  const select = idSelector(id)

  switch (type) {
    case STREAM_DATA_START:
      return state
    case STREAM_DATA_META:
      console.info('SETTING META', meta)
      return state.setIn(select('meta'), Immutable.Map(meta))
    case STREAM_DATA_RECEIVE:
    case STREAM_DATA_COMPLETE:
    /*
      const immutableBatch = Immutable.Map(batch.reduce((x, i) => ))
      console.info('IMMUTABLE BATCH', batch, immutableBatch.toJS())
      */
      const newState = state.updateIn(select('results'), results => {
        const startIndex = results.size
        return results.withMutations(r => {
          batch.forEach((result, i) => {
            r.set(startIndex + i, Immutable.Map(result))
          })
        })
      })
      const r = newState.getIn(select('results'))

      console.info('NEW STATE', r)
      return newState
    default:
      return state
  }
}
