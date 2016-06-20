## redux-grid-test

**Test framework for redux-grid and related components. Enables redux-grid to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/redux-grid-test.svg?branch=master)](https://travis-ci.org/noderaider/redux-grid-test)
[![codecov](https://codecov.io/gh/noderaider/redux-grid-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/redux-grid-test)

[![NPM](https://nodei.co/npm/redux-grid.png?stars=true&downloads=true)](https://nodei.co/npm/redux-grid/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[redux-grid](https://github.com/noderaider/redux-grid)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to redux-grid and redux-grid returns its components. This limits the ability to test redux-grid from within its own package. To accomodate, this library acts as the consuming app and tests redux-grid exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/redux-grid`
`cd redux-grid`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/redux-grid-test`
`cd redux-grid-test`
`npm i`
`npm link ../redux-grid`
`npm test`
