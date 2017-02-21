'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPostAuthorizeSubscriber = undefined;
exports.default = subscribeStore;

var _reduxIdleMonitor = require('../modules/redux-idle-monitor');

var _identity = require('../actions/identity');

var _persistence = require('../../services/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectIsAuthorized = function selectIsAuthorized(state) {
  return state.identity ? state.identity.isAuthorized : false;
};
var selectIsAdmin = function selectIsAdmin(state) {
  return state.identity ? state.identity.isAdmin : false;
};

var createPostAuthorizeSubscriber = exports.createPostAuthorizeSubscriber = function createPostAuthorizeSubscriber(_ref) {
  var getPersisted = _ref.getPersisted;
  return function (store) {
    var dispatch = store.dispatch,
        getState = store.getState;


    var currentIsAuthorized = null;
    var currentIsAdmin = null;

    var autoRefresh = (0, _identity.createAutoRefresh)({ getPersisted: getPersisted });
    var cancelAutoRefresh = function cancelAutoRefresh(dispatch, getState) {};

    return store.subscribe(function () {
      var previousIsAuthorized = currentIsAuthorized;
      var previousIsAdmin = currentIsAdmin;
      var state = store.getState();
      currentIsAuthorized = selectIsAuthorized(state);
      currentIsAdmin = selectIsAdmin(state);

      if (currentIsAuthorized !== previousIsAuthorized) {
        dispatch(cancelAutoRefresh);
        if (currentIsAuthorized) {
          cancelAutoRefresh = dispatch(autoRefresh);
          dispatch(_reduxIdleMonitor.actions.start());
        } else {
          dispatch(_reduxIdleMonitor.actions.stop());
        }
      }
    });
  };
};

function subscribeStore(store) {
  /*
  const { getPersisted } = persistence()
  const subscribePostAuthorize = createPostAuthorizeSubscriber({ getPersisted })
  const unsubscribePostAuthorize = subscribePostAuthorize(store)
  return () => unsubscribePostAuthorize()
  */
  return function () {};
}