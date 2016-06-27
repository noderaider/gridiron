## react-pre

**Lightweight grid framework built on top of react-virtualized / fixed-data-table for easy highly customizable grids generated from redux state.**

[![Build Status](https://travis-ci.org/noderaider/react-pre-test.svg?branch=master)](https://travis-ci.org/noderaider/react-pre-test)
[![codecov](https://codecov.io/gh/noderaider/react-pre-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-pre-test)

[![NPM](https://nodei.co/npm/react-pre.png?stars=true&downloads=true)](https://nodei.co/npm/react-pre/)

## Install

`npm i -S react-pre`

## Usage

**UserGrid.js**

```js
import React from 'react'
import { connect } from 'react-redux'
import ReactVirtualized from 'react-virtualized'
import { createGrid } from 'react-pre'

const { Grid } = createGrid({ React, connect, ReactVirtualized })

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

**See react-pre's test project at [react-pre-test](https://github.com/noderaider/react-pre-test)**


**In active development, come back in a few days.**
