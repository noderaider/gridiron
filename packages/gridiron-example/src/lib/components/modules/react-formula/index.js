import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Immutable from 'immutable'

import reactFormula from 'react-formula'
import styles from 'react-formula-styles'
import { carbon, sandy, black } from 'react-formula-themes'

export default reactFormula ( { React, shallowCompare, Immutable }
                            , { styles, theme: carbon }
                            )
