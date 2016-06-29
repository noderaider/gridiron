## redux-pager-test

**Test framework for redux-pager and related components. Enables redux-pager to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/redux-pager-test.svg?branch=master)](https://travis-ci.org/noderaider/redux-pager-test)
[![codecov](https://codecov.io/gh/noderaider/redux-pager-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/redux-pager-test)

[![NPM](https://nodei.co/npm/redux-pager.png?stars=true&downloads=true)](https://nodei.co/npm/redux-pager/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[redux-pager](https://github.com/noderaider/redux-pager)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to redux-pager and redux-pager returns its components. This limits the ability to test redux-pager from within its own package. To accomodate, this library acts as the consuming app and tests redux-pager exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/redux-pager`
`cd redux-pager`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/redux-pager-test`
`cd redux-pager-test`
`npm i`
`npm link ../redux-pager`
`npm test`
