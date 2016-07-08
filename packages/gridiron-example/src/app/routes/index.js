import App from './components/App'
import Home from './components/Home'

export default ({ path: '/'
                , component: App
                , indexRoute: { component: Home }
                , childRoutes: [ { path: '*', component: Home } ]
                })
