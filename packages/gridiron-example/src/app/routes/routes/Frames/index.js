const path = 'frames'
const getComponent = (nextState, cb) => require.ensure([], require => cb(null, require('./components/Frames').default))
export default  { path, getComponent }
