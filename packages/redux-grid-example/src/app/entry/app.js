//import domready from 'domready'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { match, Router } from 'react-router'
import configureBrowserStore from 'app/redux/store/configureBrowserStore'
import routes from '../routes'
import perf from './global/performance'
perf.addTiming('appStart')

let [store, history] = configureBrowserStore()
/*
domready(() => {
  */
  perf.addTiming('appLoad')
  let root = document.getElementById('root')
  if(!root) {
    root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  }
  match({ history, routes }, (err, redirectLocation, renderProps) => {
    render(<Provider store={store}><Router {...renderProps} /></Provider>, root)
  })
//})
