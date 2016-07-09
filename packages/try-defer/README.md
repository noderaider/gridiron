# try-defer

**Composes a function that will try logic and accumulate failures to be retried at a deferred time.**

`npm i -S try-defer`

[![NPM](https://nodei.co/npm/try-defer.png?stars=true&downloads=true)](https://nodei.co/npm/try-defer/)

## Why?

**I built this library to solve the many issues surrounding server-side rendering of css (specifically within library projects for my use case). With this project, I can attempt to run a bunch of unknown code, and if it fails, serialize the failures to a string to be executed on the browser.**

## Usage

```js
import tryDefer from 'try-defer'

const [ inBrowser
      , { replay, serialize, reactReplay }
      ] = tryDefer(() => typeof window === 'object')

const alert = inBrowser((...args) => window.alert(`ONLY RUN ON BROWSER => ${JSON.stringify(args)}`))
const setBG = inBrowser((color) => document.body.style.backgroundColor = color)

/** This may or may not work. If it is bypassed or causes an error, it will be accumulated in the replay event to be executed at a deferred time.
alert(1, 2, 3)
setBG('yellow')
alert('deffferrrrr')
alert('this is in browser')
setBG('blue')

// ...

/**
 * replay
 * reruns all of the failed calls in order.
 * any failures will be repeated again on future replays.
 */
const replay()
```

**OR - if you want to have the replay embedded into the server rendered page and run on the client:**

```jsx
/**
 * serialize
 * serializes the replay event into a script tag that will be run when the client loads.
 */
const html = `<!doctype html>
<html>
  <head>
    ${serialize()}
  </head>
  <body>
    ${content}
  </body>
</html>
```

**OR - if you are in a React project attempting server rendering:**

```jsx
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

//....

router.use((req, res, next) => {
  let memoryHistory = createMemoryHistory(req.path)
  let store = configureStore(memoryHistory)
  let history = syncHistoryWithStore(memoryHistory, store)

  /* react router match history */
  match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    const content = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)

    /** Returns a component that reruns the logic in a browser environment. */
    const Replay = reactReplay(React)

    const html = `<!doctype html>
    ${renderToString((
      <html>
        <head>
          <Replay />
        </head>
        <body>
          {content}
        </body>
      </html>
    )}`

    res.send(html)
  })

})
```
