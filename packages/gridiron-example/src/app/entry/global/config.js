import config, { appName } from 'config-client'

export const injectConfigIntoGlobal = () => {
  window[appName] = window[appName] || {}
  window[appName].config = window[appName].config || config
}
