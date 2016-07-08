## gridiron-example

**Example webpack project for gridiron and related components. Showcases what can be done with gridiron.**

[![Build Status](https://travis-ci.org/noderaider/gridiron-test.svg?branch=master)](https://travis-ci.org/noderaider/gridiron-test)
[![codecov](https://codecov.io/gh/noderaider/gridiron-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/gridiron-test)

[![NPM](https://nodei.co/npm/gridiron.png?stars=true&downloads=true)](https://nodei.co/npm/gridiron/)

## Philosophy

Redux grid is a lerna monorepo that consists of multiple small projects. Each project only uses the dependencies it needs. This allows gridiron to not depend (npm) on React, Redux, or other heavyweight libraries but still allow testing of it with those libraries.


## How to use

`git clone https://github.com/noderaider/gridiron`
`cd gridiron`
`lerna bootstrap`
`lerna run start`


**This project is in *very* active development. It is not (quite) ready yet for primetime use. Check back shortly.**
