'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxMiddleware = require('redux-middleware');

var _reduxIdleMonitor = require('../modules/redux-idle-monitor');

var _subscribeStore = require('./subscribeStore');

var _subscribeStore2 = _interopRequireDefault(_subscribeStore);

var _reducers = require('../reducers');

var reducers = _interopRequireWildcard(_reducers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(history, initialState) {
  var reducer = (0, _redux.combineReducers)(reducers);
  var middlewares = [_reduxMiddleware.thunk, (0, _reactRouterRedux.routerMiddleware)(history), _reduxIdleMonitor.middleware];
  var enhancer = _redux.applyMiddleware.apply(undefined, middlewares);
  var store = (0, _redux.createStore)(reducer, initialState, enhancer);
  var unsubscribe = (0, _subscribeStore2.default)(store);
  /*
  if(IS_BROWSER)
    store.dispatch(idleActions.start())
  */
  return store;
}