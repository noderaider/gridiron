import 'babel-polyfill'
import make from './webpack/make'
export default [ make('static'), make('vendor') ]
