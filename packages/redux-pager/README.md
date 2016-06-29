## redux-pager

**Lightweight composable React / Redux pagination component**

[![Build Status](https://travis-ci.org/noderaider/redux-pager-test.svg?branch=master)](https://travis-ci.org/noderaider/redux-pager-test)
[![codecov](https://codecov.io/gh/noderaider/redux-pager-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/redux-pager-test)

[![NPM](https://nodei.co/npm/redux-pager.png?stars=true&downloads=true)](https://nodei.co/npm/redux-pager/)

## Install

`npm install -S redux-pager`

## Usage

```jsx
import React from 'react'
import reduxPager from 'redux-pager'

const Pager = reduxPager({ connect, React })

export default props => (
  <Pager mapRows={
    (state, indices) => state.entities.users.filter((x, i) => i >= indices[0] && i < indices.slice(-1))
  }>
    {pager => (
      <div>
        <div>
          {pager.data.map(x => (
            <div>
              <pre>{JSON.stringify(x, null, 2)}</pre>
            </div>
          ))}
        </div>
        {/* Do something with pager.mapRows /*}
        <span>
          <pager.Buttons>
            <pager.PageSelect />
          </pager.Buttons>
          <pager.RowInfo />
          <pager.PageInfo />
        </span>
      </div>
    )}
  </Pager>
)
```

## Test

**See redux-pager's test project at [redux-pager-test](https://github.com/noderaider/redux-pager-test)**


**In active development, come back in a few days.**
