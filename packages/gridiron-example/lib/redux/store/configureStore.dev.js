'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = configureStore;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxMiddleware = require('redux-middleware');

var _config = require('../../../config');

var _reduxIdleMonitor = require('../modules/redux-idle-monitor');

var _data = require('../actions/data');

var _subscribeStore = require('./subscribeStore');

var _subscribeStore2 = _interopRequireDefault(_subscribeStore);

var _reducers = require('../reducers');

var reducers = _interopRequireWildcard(_reducers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(history, initialState) {
  var reducer = (0, _redux.combineReducers)(reducers);
  var middlewares = [_reduxMiddleware.thunk, (0, _reactRouterRedux.routerMiddleware)(history), _reduxIdleMonitor.middleware, (0, _reduxMiddleware.createLogger)({ logger: _config.IS_BROWSER ? console : _config.log })];
  var enhancer = (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, middlewares), (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : function (f) {
    return f;
  });
  var store = (0, _redux.createStore)(reducer, initialState, enhancer);
  var unsubscribe = (0, _subscribeStore2.default)(store);

  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') store.dispatch((0, _data.streamData)(['openflights', 'airlines']));
  /*
  if(IS_BROWSER)
    store.dispatch(idleActions.start())
  */
  if (module.hot) module.hot.accept('../reducers', function () {
    return store.replaceReducer(require('../reducers').default);
  });
  return store;
}