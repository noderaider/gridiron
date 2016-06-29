## react-maximize-test

**Test framework for react-maximize and related components. Enables react-maximize to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/react-maximize-test.svg?branch=master)](https://travis-ci.org/noderaider/react-maximize-test)
[![codecov](https://codecov.io/gh/noderaider/react-maximize-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-maximize-test)

[![NPM](https://nodei.co/npm/react-maximize.png?stars=true&downloads=true)](https://nodei.co/npm/react-maximize/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[react-maximize](https://github.com/noderaider/react-maximize)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to react-maximize and react-maximize returns its components. This limits the ability to test react-maximize from within its own package. To accomodate, this library acts as the consuming app and tests react-maximize exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/react-maximize`
`cd react-maximize`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/react-maximize-test`
`cd react-maximize-test`
`npm i`
`npm link ../react-maximize`
`npm test`
