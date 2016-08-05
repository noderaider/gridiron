import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Immutable from 'immutable'

import reactPre from 'react-pre'
import styles from 'react-pre-styles'
import { carbon, sandy, black } from 'react-pre-themes'

const { Pre, Arrows } = reactPre( { React, shallowCompare, Immutable }
                                , { styles, theme: carbon }
                                )

export { Pre, Arrows }
