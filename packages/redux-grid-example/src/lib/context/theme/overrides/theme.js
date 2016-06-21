function getSheet(theme) {
  try {
    switch(theme) {
      case 'solarized-dark':
        return () => require('./css/solarized-dark.gcss')
    }
  } catch(err) { console.error(err) }
}

export default cookieTheme => {
  const sheet = getSheet(cookieTheme)
  return theme => ({ sheet })
}
