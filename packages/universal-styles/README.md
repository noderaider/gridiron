# universal-styles

**Universal Styles for CSS Modules and server side deferred rendering.**

`npm i -S universal-styles`

[![NPM](https://nodei.co/npm/universal-styles.png?stars=true&downloads=true)](https://nodei.co/npm/universal-styles/)

## Why?

**I built this library to solve the many issues surrounding server-side rendering of css (specifically within library projects for my use case).**

## Usage

```
import universalStyles from 'universal-styles'

function addStyles(...args) {
  if(typeof window === 'object') {
    /** We are in a browser and can access the window */

    /** ...CODE THAT TOUCHES WINDOW, DOCUMENT, etc. GOES HERE... */
  } else {
    /** We are on the server and need to defer until a browser is available */

    const enqueue = universalStyles(addStyles)
    enqueue(...args)
  }
}
```

By default, this module will accrue styles and link css urls when server rendering into a global.__universal__ object. If you do nothing, universal-styles should never throw, but the styles will not be applied to anything (from the server render). There are a few options depending on your needs to get the styles on the page, server-side.


#### 1. replay function

* Executes the same functions, with the same arguments, in the same order that were enqueued across all files.
* Will try and access window and other DOM globals (if the enqueued functions did). If they do not exist, it will repeat the same server fallback over again.

```js
global.__universal__.replay()
```

#### 2. serialize function

* Prints out a raw string that can be embedded in a web page head template (if you are not server rendering with React).
* Will embed all the style loading code with the styles and will run as soon as it is hit in the web page load.
* Does not interact with window, document or other DOM globals. (EVENTUALLY)

```
/** RENDER SOME STUFF THAT CAUSES STYLE LOADERS TO GET ENQUEUED */
/** ... */

/** Prints out raw string styles to template into head and clears the buffer out for the next server render */
const styles = global.__universal__.serialize()

const html = `<!doctype html>
<html>
  <head>
    ${styles}
  </head>
  <body>
    ${content}
  </body>
</html>
```


#### 3. reactStyles function (recommended for react apps)

* Recommended for server-side rendering in React applications.
* Prints out a <Styles /> React component that can be rendered into the head tag (full react-router example below).
* Does not interact with window, document or other DOM globals. (EVENTUALLY)
* By using a factory, this library needs no npm React dependency.

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

    /** Returns a component that applies styles and clears the buffer for the next server render */
    const Styles = global.__universal__.reactStyles(React)

    const html = `<!doctype html>
    ${renderToString((
      <html>
        <head>
          <Styles />
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
