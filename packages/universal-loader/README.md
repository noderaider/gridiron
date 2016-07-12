# [universal-loader](https://npmjs.com/package/universal-loader) for webpack

**A drop-in replacement for webpack's [style-loader](https://npmjs.com/package/style-loader) that won't bomb. Client rendering works exactly the same as style-loader. Server rendering defers style application to a future point (typically when serving the response). No dependencies on other isomorphic webpack loaders / plugins.**


[![NPM](https://nodei.co/npm/universal-loader.png?stars=true&downloads=true)](https://nodei.co/npm/universal-loader/)


`npm i -S universal-loader`

By default, this module will accrue styles and link css urls when server rendering into a global.__universal__ object. If you do nothing, the universal-loader should never throw, but the styles will not be applied to anything (from the server render). There are a few options depending on your needs to get the styles on the page, server-side.


#### 1. replay function

* Executes the same script that would have been run by the style-loader, at a deferred point in time (hopefully, in a browser context).
* Will try and access window and other DOM globals. If they do not exist, it will repeat the same server fallback over again.

```js
global.__universal__.replay()
```

#### 2. serialize function

* Prints out a raw string that can be embedded in a web page head template (if you are not server rendering with React).
* Will embed all the style loading code with the styles and will run as soon as it is hit in the web page load.
* Does not interact with window, document or other DOM globals. (EVENTUALLY)

```
/** RENDER SOME STUFF THAT WOULD NORMALLY THROW WITH style-loader */
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




# Documentation from [style-loader](https://npmjs.com/package/style-loader) (Client-side)


Adds CSS to the DOM by injecting a `<style>` tag

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

### Simple API

``` javascript
require("style!raw!./file.css");
// => add rules in file.css to document
```

It's recommended to combine it with the [`css-loader`](https://github.com/webpack/css-loader): `require("style!css!./file.css")`.

It's also possible to add a URL instead of a CSS string:

``` javascript
require("style/url!file!./file.css");
// => add a <link rel="stylesheet"> to file.css to document
```

### Local scope CSS

(experimental)

When using [local scope CSS](https://github.com/webpack/css-loader#local-scope) the module exports the generated identifiers:

``` javascript
var style = require("style!css!./file.css");
style.placeholder1 === "z849f98ca812bc0d099a43e0f90184"
```

### Reference-counted API

``` javascript
var style = require("style/useable!css!./file.css");
style.use(); // = style.ref();
style.unuse(); // = style.unref();
```

Styles are not added on `require`, but instead on call to `use`/`ref`. Styles are removed from page if `unuse`/`unref` is called exactly as often as `use`/`ref`.

Note: Behavior is undefined when `unuse`/`unref` is called more often than `use`/`ref`. Don't do that.

### Options

#### `insertAt`

By default, the style-loader appends `<style>` elements to the end of the `<head>` tag of the page. This will cause CSS created by the loader to take priority over CSS already present in the document head. To insert style elements at the beginning of the head, set this query parameter to 'top', e.g. `require('../style.css?insertAt=top')`.

#### `singleton`

If defined, the style-loader will re-use a single `<style>` element, instead of adding/removing individual elements for each required module. **Note:** this option is on by default in IE9, which has strict limitations on the number of style tags allowed on a page. You can enable or disable it with the singleton query parameter (`?singleton` or `?-singleton`).

## Recommended configuration

By convention the reference-counted API should be bound to `.useable.css` and the simple API to `.css` (similar to other file types, i.e. `.useable.less` and `.less`).

So the recommended configuration for webpack is:

``` javascript
{
  module: {
    loaders: [
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.useable\.css$/, loader: "style/useable!css" }
    ]
  }
}
```

**Note** about source maps support and assets referenced with `url`: when style loader is used with ?sourceMap option, the CSS modules will be generated as `Blob`s, so relative paths don't work (they would be relative to `chrome:blob` or `chrome:devtools`). In order for assets to maintain correct paths setting `output.publicPath` property of webpack configuration must be set, so that absolute paths are generated.

## Install

```
npm install style-loader
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
