## src/lib

Everything in this directory is Universal JavaScript. It will run fine in a node.js and browser environment with ONLY the use of babel.



#### Tips

* Code that doesn't need to be bundled is better off here because babel uses a much faster compile / watch process than webpack AND less hacks.
* Any modules defined in `lib` can be imported by `app` folder modules. There is a webpack alias for lib to this folder so just use `import SomeModule from 'lib/path/to/module'.


#### Structure

* errors - Subclassed custom errors that can be used from client or server.
* redux - Redux store, reducers, actions, middleware, modules ([ducks](https://github.com/erikras/ducks-modular-redux)) and constants all go here.
* router - Server side routing is configured here.
* services - Services for retrieving repeated information go here.
