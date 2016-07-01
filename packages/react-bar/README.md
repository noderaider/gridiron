## react-bar

**Composable component maximizer / compressor for React.**

[![Build Status](https://travis-ci.org/noderaider/react-bar-test.svg?branch=master)](https://travis-ci.org/noderaider/react-bar-test)
[![codecov](https://codecov.io/gh/noderaider/react-bar-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-bar-test)

[![NPM](https://nodei.co/npm/react-bar.png?stars=true&downloads=true)](https://nodei.co/npm/react-bar/)

## Install

`npm install -S react-bar`

## Usage

```jsx
import React from 'react'
import reactBar from 'react-bar'

/** reactBar is a factory that exports the maximize component. */
const Maximize = reactBar({ React })

export default props => (
  <Maximize
      shouldComponentMaximize={() => true}
      shouldComponentCompress={() => true}
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

**See react-bar's test project at [react-bar-test](https://github.com/noderaider/react-bar-test)**


**In active development, come back in a few days.**
