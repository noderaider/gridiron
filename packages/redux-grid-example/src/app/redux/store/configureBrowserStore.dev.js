import { persistState } from 'redux-devtools'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { saveStore, getInitialState } from './globalStore'

const importConfigureStore = () => require('lib/redux/store/configureStore').default

const getDebugSessionKey = () => {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  if(matches)
    return matches[1]
}

const createBrowserStore = (history = browserHistory, initialState = getInitialState()) => {
  const configureStore = importConfigureStore()
  const store = configureStore(history, initialState)
  const syncedHistory = syncHistoryWithStore(browserHistory, store)
  saveStore(store, syncedHistory)
  return [store, syncedHistory]
}

export default function configureBrowserStore(...opts) {
  let [store, history] = createBrowserStore(...opts)
  const replaceStore = () => {
    store.unsubscribe()
    [store, history] = createBrowserStore(...opts)
  }
  if(module.hot) module.hot.accept('lib/redux/store/configureStore', replaceStore)
  return [store, history]
}
