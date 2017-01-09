import reduxIdleMonitor from 'redux-idle-monitor'
import { push } from 'react-router-redux'


export const IDLESTATUS_INACTIVE = 'INACTIVE'

export const IDLE_STATUSES =  [ IDLESTATUS_INACTIVE
                              ]


export const idleStatusDelay = idleStatus => (dispatch, getState) => 30000


export const activeStatusAction = (dispatch, getState) =>  {
  console.info('MONITOR - ACTIVE')
}

export const idleStatusAction = idleStatus => (dispatch, getState) => {
  console.info('MONITOR - INACTIVE')
}

const opts = { appName: 'gridiron', IDLE_STATUSES, idleStatusDelay, activeStatusAction, idleStatusAction }

const { reducer, actions, middleware } = reduxIdleMonitor(opts)
const { start, stop, gotoIdleStatus } = actions
export default reducer
export { actions, middleware }
export { start, stop, gotoIdleStatus }
