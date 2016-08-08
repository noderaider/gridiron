import App from './components/App'
import Home from './components/Home'
import Compare from './components/Compare'

export default ({ path: '/'
                , component: App
                , indexRoute: { component: Home }
                , childRoutes:  [ { path: '/compare', component: Compare }
                                , { path: '*', component: Home }
                                ]
                })
