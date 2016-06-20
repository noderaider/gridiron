export default name => {
  switch(name) {
    case 'server':
      return 'node'
    default:
      return 'web'
  }
}
