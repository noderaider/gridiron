import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from 'lib/redux/store/configureStore'
import { saveStore, getInitialState } from './globalStore'

export default function configureBrowserStore (history = browserHistory, initialState = getInitialState()) {
  const store = configureStore(history, initialState)
  const syncedHistory = syncHistoryWithStore(browserHistory, store)
  saveStore(store, syncedHistory)
  return [store, syncedHistory]
}
