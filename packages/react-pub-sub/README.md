## react-pub-sub

**Factory for creating prop and state propagation between 1:N React components.**

[![Build Status](https://travis-ci.org/noderaider/react-pub-sub-test.svg?branch=master)](https://travis-ci.org/noderaider/react-pub-sub-test)
[![codecov](https://codecov.io/gh/noderaider/react-pub-sub-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/react-pub-sub-test)

[![NPM](https://nodei.co/npm/react-pub-sub.png?stars=true&downloads=true)](https://nodei.co/npm/react-pub-sub/)

## Install

`npm i -S react-pub-sub`

## How it works

**This library makes use of [react-stamp](https://npmjs.com/package/react-stamp) to compose components and internally emits events for propagating props and state from a Pub component to 1 or more Sub components. Sub components receive the updates on `pub` and `sub` properties of their state object. To track differences between when a publisher may have propagated an event and when a subscriber last updated a related property, the pub and sub objects contain a time stamp for when they were last updated.

## Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import reactPubSub from 'react-pub-sub'

const pubSub = reactPubSub({ React })

/** Create factories to link publishers and subscribers based on prop or state changes of the pub component. */
const { createPub, createSub } = pubSub({ propNames: [ 'active' ]
                                        , stateNames: [ 'checked' ]
                                        })

const Pub = createPub({ state: { checked: false }
                      , render() {
                          const { active } = this.props
                          const { checked } = this.state
                          return (
                            <span style={{ display: active ? 'block' : 'none' }}>
                              <input type="checkbox" id={checkbox.id} onChange={e => this.setState({ checked: e.target.checked })} checked={checked} />
                            </span>
                          )
                        }
                      }

const Sub = createSub({ render() { <span>Propagated: {JSON.stringify(this.state.pub)}</span> }})

render((
  <div>
    <h1>Pub: <Pub active={true} /></h1>
    <ul>
      <li><Sub /></li>
      <li><Sub /></li>
      <li><Sub /></li>
    </ul>
  </div>
), document.getElementById('root'))
```

**In active development, come back in a few days.**
