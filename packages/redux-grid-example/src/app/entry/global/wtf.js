import config, { appName } from 'config-client'
import { diagnose } from 'app/services/diagnostics'

export const injectWTFIntoGlobal = () => {
  window[appName] = window[appName] || {}
  let diagnostics = { wtf: () => diagnose() }
  Object.assign(window[appName], diagnostics)
}
