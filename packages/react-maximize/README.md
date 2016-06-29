## react-maximize

**Composable component maximizer / compressor for React.**

[![Build Status](https://travis-ci.org/noderaider/react-maximize-test.svg?branch=master)](https://travis-ci.org/noderaider/react-maximize-test)
[![codecov](https://codecov.io/gh/noderaider/react-maximize-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-maximize-test)

[![NPM](https://nodei.co/npm/react-maximize.png?stars=true&downloads=true)](https://nodei.co/npm/react-maximize/)

## Install

`npm install -S react-maximize`

## Usage

```jsx
import React from 'react'
import reactMaximize from 'react-maximize'

/** reactMaximize is a factory that exports the maximize component. */
const Maximize = reactMaximize({ React })

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

**See react-maximize's test project at [react-maximize-test](https://github.com/noderaider/react-maximize-test)**


**In active development, come back in a few days.**
