import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import Immutable from 'immutable'

import reactFormula from 'react-formula'
import styles from 'react-formula-styles'
import { carbon, sandy, black } from 'react-formula-themes'

const { FormsContext, formula } = reactFormula( { React, ReactDOM, shallowCompare, Immutable }
                                              , { styles, theme: carbon }
                                              )

export { FormsContext, formula }
