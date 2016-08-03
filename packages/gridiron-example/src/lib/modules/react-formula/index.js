import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import Immutable from 'immutable'

import { Pre } from '../react-pre'

import reactFormula from 'react-formula'
import styles from 'react-formula-styles'
import { carbon, sandy, black, mellow } from 'react-formula-themes'

export default reactFormula ( { React, ReactDOM, shallowCompare, Immutable, Pre }
                            , { styles, theme: mellow }
                            )

