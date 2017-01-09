import api from './api'
import data from './data'
import errors from './errors'
import { reducer as form } from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import idle from '../modules/redux-idle-monitor'

export  { api
        , data
        , errors
        , form
        , idle
        , routing
        }
