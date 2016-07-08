## gridiron-test

**Test framework for gridiron and related components. Enables gridiron to not carry heavyweight dependencies.**

[![Build Status](https://travis-ci.org/noderaider/gridiron-test.svg?branch=master)](https://travis-ci.org/noderaider/gridiron-test)
[![codecov](https://codecov.io/gh/noderaider/gridiron-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/gridiron-test)

[![NPM](https://nodei.co/npm/gridiron.png?stars=true&downloads=true)](https://nodei.co/npm/gridiron/)

## Philosophy

Given the number of issues that occur when React and other heavy dependencies get bundled with a library component, **[gridiron](https://github.com/noderaider/gridiron)** does not include any of these dependencies. Instead, the consumer provides there version of React, connect, ReactVirtualized, etc. to gridiron and gridiron returns its components. This limits the ability to test gridiron from within its own package. To accomodate, this library acts as the consuming app and tests gridiron exactly as it would be used in a consumer environment. This means 0 chance of accidentally including 2 copies of React in the DOM or any library code for that matter.

## How to use

`git clone https://github.com/noderaider/gridiron`
`cd gridiron`
`npm i`
`cd ..`

`git clone https://github.com/noderaider/gridiron-test`
`cd gridiron-test`
`npm i`
`npm link ../gridiron`
`npm test`
