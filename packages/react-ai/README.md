## react-ai

**Lightweight grid framework built on top of react-virtualized / fixed-data-table for easy highly customizable grids generated from redux state.**

[![Build Status](https://travis-ci.org/noderaider/react-ai-test.svg?branch=master)](https://travis-ci.org/noderaider/react-ai-test)
[![codecov](https://codecov.io/gh/noderaider/react-ai-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-ai-test)

[![NPM](https://nodei.co/npm/react-ai.png?stars=true&downloads=true)](https://nodei.co/npm/react-ai/)

## Install

`npm i -S react-ai`

## Usage

**UserGrid.js**

```js
import React from 'react'
import { connect } from 'react-redux'
import ReactVirtualized from 'react-virtualized'
import { createGrid } from 'react-ai'

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

**See react-ai's test project at [react-ai-test](https://github.com/noderaider/react-ai-test)**


**In active development, come back in a few days.**
