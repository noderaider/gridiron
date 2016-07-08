export default  { path: 'forms(/:id)'
                , getComponent(nextState, cb) {
                    require.ensure([], require => cb(null, require('./components/Forms').default))
                  }
                }
