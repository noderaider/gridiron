# solvent

**Simple dependency resolver designed for validating typed dependency contraints.**

[![Build Status](https://travis-ci.org/noderaider/solvent.svg?branch=master)](https://travis-ci.org/noderaider/solvent)
[![codecov](https://codecov.io/gh/noderaider/solvent/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/solvent)

[![NPM](https://nodei.co/npm/solvent.png?stars=true&downloads=true)](https://nodei.co/npm/solvent/)

## Install

`npm i -S solvent`

## Usage

```js
import solvent from 'solvent'

export default function (dependencies) {
  const { React, connect } = solvent( { React: 'object'
                                      , connect: 'function'
                                      } )(dependencies)

  /** DO SOMETHING */
}
```
