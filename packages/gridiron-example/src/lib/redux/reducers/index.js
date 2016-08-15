import identity from './identity'
import api from './api'
import data from './data'
import autocomplete from './autocomplete'
import visual from './visual'
import errors from './errors'
import { reducer as form } from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import idle from '../modules/redux-idle-monitor'

export  { identity
        , api
        , data
        , autocomplete
        , visual
        , errors
        , form
        , idle
        , routing
        }
