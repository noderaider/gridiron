import { IS_BROWSER } from '../../config'

export const scheme = IS_BROWSER ? window.location.protocol.slice(0, -1) : 'https'
export const protocol = IS_BROWSER ? window.location.protocol : `${scheme}:`
export const hostname = IS_BROWSER ? window.location.hostname : 'SERVERNAME'
export const port = IS_BROWSER ? parseInt(window.location.port) : 443
export const host = IS_BROWSER ? window.location.host : 'SERVER'
export const path = IS_BROWSER ? window.location.pathname : '/SERVER'
export const query = IS_BROWSER ? window.location.search.replace('?', '') : '?SERVER=true'
export const title = IS_BROWSER ? window.document.title : 'SERVER'
export const cleanUrl = `${protocol}//${host}${path}`
export const goToUrl = (newUrl, doPostback) => {
  if(!IS_BROWSER)
    return
  if(!doPostback)
    window.history.pushState({ url: newUrl }, null, newUrl)
  else
    window.location.replace(newUrl)
}
export const goToPath = (newPath, doPostback) => goToUrl(`${protocol}//${host}${newPath}`, doPostback)
export const goToCleanUrl = doPostback => goToUrl(cleanUrl, doPostback)
