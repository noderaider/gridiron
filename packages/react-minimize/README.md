## react-minimize

**Composable component minimizer / restorer for React.**

[![Build Status](https://travis-ci.org/noderaider/react-minimize-test.svg?branch=master)](https://travis-ci.org/noderaider/react-minimize-test)
[![codecov](https://codecov.io/gh/noderaider/react-minimize-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-minimize-test)

[![NPM](https://nodei.co/npm/react-minimize.png?stars=true&downloads=true)](https://nodei.co/npm/react-minimize/)

## Install

`npm install -S react-minimize`

## Usage

```jsx
import React from 'react'
import reactMinimize from 'react-minimize'

/** reactMinimize is a factory that exports the maximize component. */
const Maximize = reactMinimize({ React })

export default props => (
  <Maximize
      shouldMaximize={() => true}
      shouldCompress={() => true}
  >
    {maximize => (
      <div>
        <span style={{ float: 'right' }}>
          {maximize.Controls}
        </span>
      </div>
    )}
  </Maximize>
)
```

## Test

**See react-minimize's test project at [react-minimize-test](https://github.com/noderaider/react-minimize-test)**


**In active development, come back in a few days.**
