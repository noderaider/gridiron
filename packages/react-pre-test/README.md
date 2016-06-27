## react-pre-test

**Test framework for react-pre and related components. Enables react-pre to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/react-pre-test.svg?branch=master)](https://travis-ci.org/noderaider/react-pre-test)
[![codecov](https://codecov.io/gh/noderaider/react-pre-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-pre-test)

[![NPM](https://nodei.co/npm/react-pre.png?stars=true&downloads=true)](https://nodei.co/npm/react-pre/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[react-pre](https://github.com/noderaider/react-pre)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to react-pre and react-pre returns its components. This limits the ability to test react-pre from within its own package. To accomodate, this library acts as the consuming app and tests react-pre exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/react-pre`
`cd react-pre`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/react-pre-test`
`cd react-pre-test`
`npm i`
`npm link ../react-pre`
`npm test`
