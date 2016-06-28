## react-ai-test

**Test framework for react-ai and related components. Enables react-ai to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/react-ai-test.svg?branch=master)](https://travis-ci.org/noderaider/react-ai-test)
[![codecov](https://codecov.io/gh/noderaider/react-ai-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-ai-test)

[![NPM](https://nodei.co/npm/react-ai.png?stars=true&downloads=true)](https://nodei.co/npm/react-ai/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[react-ai](https://github.com/noderaider/react-ai)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to react-ai and react-ai returns its components. This limits the ability to test react-ai from within its own package. To accomodate, this library acts as the consuming app and tests react-ai exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/react-ai`
`cd react-ai`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/react-ai-test`
`cd react-ai-test`
`npm i`
`npm link ../react-ai`
`npm test`
