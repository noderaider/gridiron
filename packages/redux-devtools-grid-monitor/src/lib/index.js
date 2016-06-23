import gridMonitor from './gridMonitor'

function imports () {
  try {
    const React = require('react')
    const { ActionCreators } = require('redux-devtools')
    return { React, ActionCreators }
  } catch(err) {
    console.warn('redux-devtools-grid-monitor: could not import dependencies. If working in linked mode with createGridMonitor factory, you may disregard this message.')
    return  { React:  { Component: () => {}
                      , PropTypes:  { shape: () => { isRequired: false }
                                    , func: { isRequired: false }
                                    , oneOfType: () => { isRequired: false }
                                    }
                      }
            , ActionCreators: {}
            }
  }
}
export default gridMonitor(imports())
export const createGridMonitor = gridMonitor
