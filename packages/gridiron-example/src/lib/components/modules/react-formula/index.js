import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import Immutable from 'immutable'

import * as reactPre from '../react-pre'

import reactFormula from 'react-formula'
import styles from 'react-formula-styles'
import { carbon, sandy, black } from 'react-formula-themes'

const formula = reactFormula( { React, ReactDOM, shallowCompare, Immutable, reactPre }
                            , { styles, theme: carbon }
                            )

const { createForm } = formula('context')

export { createForm }
