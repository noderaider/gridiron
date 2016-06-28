## react-ai

**Intelligent React Toolset**

[![Build Status](https://travis-ci.org/noderaider/react-ai-test.svg?branch=master)](https://travis-ci.org/noderaider/react-ai-test)
[![codecov](https://codecov.io/gh/noderaider/react-ai-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-ai-test)

[![NPM](https://nodei.co/npm/react-ai.png?stars=true&downloads=true)](https://nodei.co/npm/react-ai/)

## Install

`npm install -S react-ai`

## Usage

```js
import React from 'react'
import { connect } from 'react-redux'
import reactAI from 'react-ai'

const AI = reactAI({ React, connect, ReactVirtualized })

/** Create a grid to show users first name, last name, and age from redux */
export default props => (
  <button onClick={AI.execute}>
    Feeling brave?
  </button>
)
```

## Test

**See react-ai's test project at [react-ai-test](https://github.com/noderaider/react-ai-test)**


**In active development, come back in a few days.**
