import cookie from 'react-cookie'
import { client, IS_DEV } from '../../../../config'
const { cookieNames } = client

export default ({ url }) => {
  /** UNCOMMENT THIS OUT FOR DARK THEME */
  /*
  if(IS_DEV && cookieNames.theme) {
    let cookieTheme = cookie.load(cookieNames.theme)
    if(cookieTheme) return require('./theme').default(cookieTheme)
  }
*/
  switch(url) {
    case '/management/quicksaletouchscreen.asp':
    case '/management/tendertouchscreen.asp':
    case '/management/eventselectiontouchscreen.asp':
    case '/management/actselectiontouchscreen.asp':
      return require('./touchscreen').default
  }
}
