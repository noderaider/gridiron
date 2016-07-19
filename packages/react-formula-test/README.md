## react-formula-test

**Test framework for reactFormula and related components. Enables reactFormula to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/react-formula-test.svg?branch=master)](https://travis-ci.org/noderaider/react-formula-test)
[![codecov](https://codecov.io/gh/noderaider/react-formula-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-formula-test)

[![NPM](https://nodei.co/npm/reactFormula.png?stars=true&downloads=true)](https://nodei.co/npm/reactFormula/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[reactFormula](https://github.com/noderaider/reactFormula)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to reactFormula and reactFormula returns its components. This limits the ability to test reactFormula from within its own package. To accomodate, this library acts as the consuming app and tests reactFormula exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/reactFormula`
`cd reactFormula`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/react-formula-test`
`cd react-formula-test`
`npm i`
`npm link ../reactFormula`
`npm test`
