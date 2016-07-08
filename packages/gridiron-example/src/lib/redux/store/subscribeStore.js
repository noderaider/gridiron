import { actions as idleActions } from '../modules/redux-idle-monitor'
import { createAutoRefresh } from '../actions/identity'
import persistence from '../../services/persistence'

const selectIsAuthorized = state => state.identity ? state.identity.isAuthorized : false
const selectIsAdmin = state => state.identity ? state.identity.isAdmin : false


export const createPostAuthorizeSubscriber = ({ getPersisted }) => store => {
  const { dispatch, getState } = store

  let currentIsAuthorized = null
  let currentIsAdmin = null

  let autoRefresh = createAutoRefresh({ getPersisted })
  let cancelAutoRefresh = (dispatch, getState) => {}

  return store.subscribe(() => {
    let previousIsAuthorized = currentIsAuthorized
    let previousIsAdmin = currentIsAdmin
    let state = store.getState()
    currentIsAuthorized = selectIsAuthorized(state)
    currentIsAdmin = selectIsAdmin(state)

    if(currentIsAuthorized !== previousIsAuthorized) {
      dispatch(cancelAutoRefresh)
      if(currentIsAuthorized) {
        cancelAutoRefresh = dispatch(autoRefresh)
        dispatch(idleActions.start())
      } else {
        dispatch(idleActions.stop())
      }
    }
  })
}

export default function subscribeStore(store) {
  /*
  const { getPersisted } = persistence()
  const subscribePostAuthorize = createPostAuthorizeSubscriber({ getPersisted })
  const unsubscribePostAuthorize = subscribePostAuthorize(store)
  return () => unsubscribePostAuthorize()
  */
  return () => {}
}
