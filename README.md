## redux-grid

**Lightweight grid framework built on top of react-virtualized / fixed-data-table for easy highly customizable grids generated from redux state.**

[![Build Status](https://travis-ci.org/noderaider/redux-grid-test.svg?branch=master)](https://travis-ci.org/noderaider/redux-grid-test)
[![codecov](https://codecov.io/gh/noderaider/redux-grid-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/redux-grid-test)

[![NPM](https://nodei.co/npm/redux-grid.png?stars=true&downloads=true)](https://nodei.co/npm/redux-grid/)

## Install

`npm install -S redux-grid`

## Usage

**UserGrid.js**

```js
import React from 'react'
import { connect } from 'react-redux'
import ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'

const { DrillGrid } = reduxGrid({ React, connect, ReactVirtualized })

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

**See redux-grid's test project at [redux-grid-test](https://github.com/noderaider/redux-grid-test)**


**In active development, come back in a few days.**
