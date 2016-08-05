import reduxIdleMonitor from 'redux-idle-monitor'
import { push } from 'react-router-redux'

import { packageName, title, subtitle, IS_BROWSER } from '../../../config'
import { setText } from '../actions/visual'

export const IDLESTATUS_INACTIVE = 'INACTIVE'

export const IDLE_STATUSES =  [ IDLESTATUS_INACTIVE
                              ]


export const idleStatusDelay = idleStatus => (dispatch, getState) => 30000


export const activeStatusAction = (dispatch, getState) =>  {
  dispatch(setText({ subtitle }))
}

export const idleStatusAction = idleStatus => (dispatch, getState) => {
  dispatch(setText({ subtitle }))
}

const opts = { appName: title, IDLE_STATUSES, idleStatusDelay, activeStatusAction, idleStatusAction }

const { reducer, actions, middleware } = reduxIdleMonitor(opts)
const { start, stop, gotoIdleStatus } = actions
export default reducer
export { actions, middleware }
export { start, stop, gotoIdleStatus }
