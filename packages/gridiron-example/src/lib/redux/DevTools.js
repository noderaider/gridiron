import React from 'react'

import { createDevTools, ActionCreators } from 'redux-devtools'
//import LogMonitor from 'redux-devtools-log-monitor'
import { createGridMonitor } from 'redux-devtools-grid-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import MultipleMonitors from 'redux-devtools-multiple-monitors'

const GridMonitor = createGridMonitor({ React, ActionCreators })

export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" defaultIsVisible={false}>
    <GridMonitor />
  {/*
    <MultipleMonitors>
      <LogMonitor />
      <GridMonitor />
    </MultipleMonitors>
  */}
  </DockMonitor>
)
