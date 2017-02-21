'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gotoIdleStatus = exports.stop = exports.start = exports.middleware = exports.actions = exports.idleStatusAction = exports.activeStatusAction = exports.idleStatusDelay = exports.IDLE_STATUSES = exports.IDLESTATUS_INACTIVE = undefined;

var _reduxIdleMonitor2 = require('redux-idle-monitor');

var _reduxIdleMonitor3 = _interopRequireDefault(_reduxIdleMonitor2);

var _reactRouterRedux = require('react-router-redux');

var _config = require('../../../config');

var _visual = require('../actions/visual');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IDLESTATUS_INACTIVE = exports.IDLESTATUS_INACTIVE = 'INACTIVE';

var IDLE_STATUSES = exports.IDLE_STATUSES = [IDLESTATUS_INACTIVE];

var idleStatusDelay = exports.idleStatusDelay = function idleStatusDelay(idleStatus) {
  return function (dispatch, getState) {
    return 30000;
  };
};

var activeStatusAction = exports.activeStatusAction = function activeStatusAction(dispatch, getState) {
  dispatch((0, _visual.setText)({ subtitle: _config.subtitle }));
};

var idleStatusAction = exports.idleStatusAction = function idleStatusAction(idleStatus) {
  return function (dispatch, getState) {
    dispatch((0, _visual.setText)({ subtitle: _config.subtitle }));
  };
};

var opts = { appName: _config.title, IDLE_STATUSES: IDLE_STATUSES, idleStatusDelay: idleStatusDelay, activeStatusAction: activeStatusAction, idleStatusAction: idleStatusAction };

var _reduxIdleMonitor = (0, _reduxIdleMonitor3.default)(opts),
    reducer = _reduxIdleMonitor.reducer,
    actions = _reduxIdleMonitor.actions,
    middleware = _reduxIdleMonitor.middleware;

var start = actions.start,
    stop = actions.stop,
    gotoIdleStatus = actions.gotoIdleStatus;
exports.default = reducer;
exports.actions = actions;
exports.middleware = middleware;
exports.start = start;
exports.stop = stop;
exports.gotoIdleStatus = gotoIdleStatus;