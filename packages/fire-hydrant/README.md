# fire-hydrant

**lightweight hydration and serialization of state, targeted at Redux Server Side Rendering and ImmutableJS**

[![NPM](https://nodei.co/npm/fire-hydrant.png?stars=true&downloads=true)](https://nodei.co/npm/fire-hydrant/)

![dependencies](https://raw.githubusercontent.com/cchamberlain/fire-hydrant/master/public/images/dependencies.png)

## Install

`npm i -S fire-hydrant`


## Documentation

Functions used to store state objects, partial immutables, and full immutables to strings and restore them back to their original state.


## [react-router](https://npmjs.com/package/react-router) and [react-router-redux](https://npmjs.com/package/react-router-redux) with async routes example


#### configureStore.js

```js
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers } from 'redux'
import * as reducers from '../reducers'

export default function configureStore(history, initialState) {
  const reducer = combineReducers(reducers)
  const enhancer = applyMiddleware([ routerMiddleware(history) ])
  return createStore(reducer, initialState, enhancer)
}
```


#### createRouter.js

**Plug this router into your server.use()**

```jsx
import React from 'react'
import Router from 'router'
import Immutable from 'immutable'
import { Provider } from 'react-redux'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { serialize, createInitialState } from 'fire-hydrant'

/** Routes can be direct server defined routes or a webpack bundle */
import routes from './routes'


const InitialState = ({ state }) => {
  const serialized = serialize(state, { Immutable })
  const __html = `window.__initialState__ = ${serialized}`
  return <script dangerouslySetInnerHTML={{ __html }} />
}


//-- ALTERNATE: Import createInitialState component factory for sanity checks and less boilerplate.
const InitialState = createInitialState({ React, Immutable })

const HTML = ({ content, store }) => {
  const state = store ? store.getState() : noop()

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Fire Hydrant</title>
      </head>
      <body>
        <InitialState state={state} />
        <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
        <script src="/app.js" />
      </body>
    </html>
  )
}

const renderHTML = props => `<!doctype html>
${renderToString(<HTML {...props} />)}`

export default function createRouter({ cors, paths }) {
  const router = Router()
  router.use((req, res, next) => {
    try {
      const memoryHistory = createMemoryHistory(req.path)
      let store = configureStore(memoryHistory)
      const history = syncHistoryWithStore(memoryHistory, store)

      match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error)
          res.status(500).send(error.message)
        else if (redirectLocation)
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        else if (renderProps) {
          const content = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)
          res.send(renderHTML({ content, store }))
        } else
          next()
      })
    } catch(routerError) {
      res.status(500).send(process.env.NODE_ENV !== 'production' ? routerError : 'An error occurred rendering the application.')
    }
  })
  return router
}
```


#### app.js

**Client entry point - This is where the state gets rehydrated.**

```jsx
import React from 'react'
import Immutable from 'immutable'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { match, Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { fromHydrant } from 'fire-hydrant'

import routes from './routes'

/** Rehydrate our server built state that is stored in __initialState__ global */
const initialState = fromHydrant(window.__initialState__ || {}, { Immutable })

const store = configureStore(browserHistory, initialState)
const history = syncHistoryWithStore(browserHistory, store)

const rootElement = document.getElementById('root')
match({ history, routes }, (err, redirectLocation, renderProps) => {
  render(<Provider store={store}><Router {...renderProps} /></Provider>, rootElement)
})
```




## Unit tests

```js
const regularObj =  { a: 'something'
                    , b: [1, 2, 3]
                    , c: { foo: { bar: true }}
                    }
const partialImmutable =  { ...regularObj
                          , d: Immutable.Map({ a: 'foo', b: 'bar' })
                          }
const topLevelImmutable = Immutable.fromJS(regularObj)



it('should toHydrant to an object', () => expect(toHydrant({ foo: 'bar' })).toEqual(jasmine.any(Object)))
it('should fromHydrant to an object', () => expect(fromHydrant({ foo: 'bar' })).toEqual(jasmine.any(Object)))
it('should serialize to a string', () => expect(serialize({ foo: 'bar' })).toEqual(jasmine.any(String)))
it('should deserialize to an object', () => expect(deserialize(`{"foo": "bar"}`)).toEqual(jasmine.any(Object)))

it('should be able to toHydrant and fromHydrant back for regular object', () => {
  let hydrant = toHydrant(regularObj)
  let result = fromHydrant(hydrant)
  expect(result).toEqual(regularObj)
})

it('should be able to toHydrant and fromHydrant back for partial immutable', () => {
  let hydrant = toHydrant(partialImmutable)
  let result = fromHydrant(hydrant)
  expect(result).toEqual(partialImmutable)
})

it('should be able to toHydrant and fromHydrant back for top level immutable', () => {
  let hydrant = toHydrant(topLevelImmutable)
  let result = fromHydrant(hydrant)
  expect(result).toEqual(topLevelImmutable)
})

it('should be able to serialize and deserialize to same values for regular object', () => {
  let serialized = serialize(regularObj)
  let result = deserialize(serialized)
  expect(result).toEqual(regularObj)
})

it('should be able to serialize and deserialize to same values for partial immutable', () => {
  let serialized = serialize(partialImmutable)
  let result = deserialize(serialized)
  expect(result).toEqual(partialImmutable)
})

it('should be able to serialize and deserialize to same values for top level immutable', () => {
  let serialized = serialize(topLevelImmutable)
  let result = deserialize(serialized)
  expect(result).toEqual(topLevelImmutable)
})

```
