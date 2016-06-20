import App from './components/App'
import Home from './components/Home'

export default ({ path: '/'
                , component: App
                , indexRoute: { component: Home }
                , getChildRoutes(location, cb) {
                    require.ensure([], require => cb(null,  [ require('./routes/Frames').default
                                                            , require('./routes/Test').default
                                                            , require('./routes/NoMatch').default
                                                            ]))
                  }
                })
