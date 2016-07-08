export default  { path: 'grids(/:id)'
                , getComponent(nextState, cb) {
                    require.ensure([], require => cb(null, require('./components/Grids').default))
                  }
                }
