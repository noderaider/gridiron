## gridiron

**Feature-Packed Grid Framework**

[![Build Status](https://travis-ci.org/noderaider/gridiron-test.svg?branch=master)](https://travis-ci.org/noderaider/gridiron-test)
[![codecov](https://codecov.io/gh/noderaider/gridiron-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/gridiron-test)

[![NPM](https://nodei.co/npm/gridiron.png?stars=true&downloads=true)](https://nodei.co/npm/gridiron/)

## Install

`npm install -S gridiron`

## Usage

**UserGrid.js**

```js
import React from 'react'
import { connect } from 'react-redux'
import ReactVirtualized from 'react-virtualized'
import gridiron from 'gridiron'

const { DrillGrid } = gridiron({ React, connect, ReactVirtualized })

/** Create a grid to show users first name, last name, and age from redux */
export default props => (
  <Grid
    mapCols={
      /** Map redux state to object with column name keys and header component values */
      state => ({ first: <div>First Name</div>
                , last: <div>Last Name</div>
                , age: { render: <div>Age</div>, width: 100 }
                })
    }
    mapRows={
      /** Map redux state to grid rows. */
      state => state.users.map(x => [x.first, x.last, x.age])
    }
  />
)
```

## Test

**See gridiron's test project at [gridiron-test](https://github.com/noderaider/gridiron-test)**


**In active development, come back in a few days.**
