export default  { path: 'test'
                , getComponent(nextState, cb) {
                    require.ensure([], require => cb(null, require('./components/Test').default))
                  }
                , getChildRoutes(location, cb) {
                    require.ensure([], require => cb(null,  [ require('./routes/Grids').default
                                                            , require('./routes/Forms').default
                                                            ]))
                  }
                }
