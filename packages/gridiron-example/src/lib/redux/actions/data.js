import Promise from 'bluebird'
import Immutable from 'immutable'
import { createAction } from 'redux-actions'
import Papa from 'papaparse'
import { STREAM_DATA_START, STREAM_DATA_META, STREAM_DATA_RECEIVE, STREAM_DATA_COMPLETE } from '../constants'
const should = require('chai').should()

const streamDataStart = createAction(STREAM_DATA_START, (id, opts) => ({ id, opts }))
const streamDataMeta = createAction(STREAM_DATA_META, (id, meta) => ({ id, meta }))
const streamDataReceive = createAction(STREAM_DATA_RECEIVE, (id, batchID, batch) => ({ id, batchID, batch }))
const streamDataComplete = createAction(STREAM_DATA_COMPLETE, (id, results, file) => ({ id, results, file }))

const bucketUrl = 'https://s3-us-west-2.amazonaws.com/gridiron-data'
const s3 = path => `${bucketUrl}/${path}`

export const initialState = Immutable.Map(
  { openflights: Immutable.Map(
      { airlines: Immutable.Map({ url: s3('openflights/airlines.csv')
                                , results: Immutable.OrderedMap()
                                , meta: Immutable.Map({ columns: [] })
                                })
      , airports: Immutable.Map({ url: s3('openflights/airports.csv')
                                , results: Immutable.OrderedMap()
                                , meta: Immutable.Map({ columns: [] })
                                })
      , routes: Immutable.Map({ url: s3('openflights/routes.csv')
                              , results: Immutable.OrderedMap()
                              , meta: Immutable.Map({ columns: [] })
                              })
      }
    )
  }
)

export const idSelector = id => (...pathIn) => [ ...id, ...pathIn ]

Papa.SCRIPT_PATH = '/static/papaparse.min.js'
export function streamData (id, { batchSize = 100 } = {}) {
  const select = idSelector(id)
  return (dispatch, getState) => {
    const state = getState()
    const url = initialState.getIn(select('url'))
    dispatch(streamDataStart(id, { batchSize }))
    let batch = []
    let batchID = 0
    Papa.parse( url
              , { download: true
                , worker: true
                , dynamicTyping: true
                , preview: 100
                , header: true
                , step: (results, parser) => {
                    results.data.length.should.eql(1)
                    const [ datum ] = results.data
                    if(batchID === 0 && batch.length === 0) {
                      const columns = Object.keys(datum)
                      console.info('COLUMNS', columns)
                      dispatch(streamDataMeta(id, { columns }))
                    }
                    batch.push(datum)
                    if(batch.length >= batchSize) {
                      dispatch(streamDataReceive(id, batchID, batch))
                      //parser.pause()
                      batchID++
                      batch = []
                    }
                    /*
                    if(results.errors)
                      console.error('ERRORS', results.errors)
                    */
                  }
                  /*
                , complete: (results, file) => {
                    if(results.data) {
                      batch.push(results.data)
                    }
                    dispatch(streamDataComplete(id, batch, file))
                    //console.log('Parsing complete', results, file)
                  }
                  */
                }
              )
  }
}

