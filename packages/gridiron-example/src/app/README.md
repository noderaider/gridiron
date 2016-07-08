## src/app

Everything in this directory is strictly Browser-Targeted JavaScript. It must be compiled via webpack to be run in a server / browser environment.

If code must be built to a browser bundle or requires loaders, use this directory.


#### Structure

* elements - React (shared) components that can be used across multiple pages.
* entry - Entry points for webpack browser bundles.
* fonts
* images
* redux - Browser specific redux functionality.
* routes - All of the routes and their components are hierarchically structured here. This is also bundled for server side rendering.
* styles
* vendor - Third party libraries that require custom functionality or shimming.
