export default name => {
  switch(name) {
    case 'server':
      return { __filename: true, __dirname: true, console: true }
    default:
      return { fs: 'empty', 'graceful-fs': 'empty' }
  }
}
