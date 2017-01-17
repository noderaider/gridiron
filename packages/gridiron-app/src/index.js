import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'

import configureStore from './redux/store/configureStore'
const store = configureStore()

render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
