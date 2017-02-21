'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = undefined;
exports.default = api;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function entities() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error || !payload) return state;
  var apiName = payload.apiName,
      actionName = payload.actionName,
      actionKey = payload.actionKey,
      data = payload.data;

  switch (type) {
    case _constants.KEYED_DATA:
      return state.setIn([apiName, actionKey], data);
    case _constants.RECEIVE_DATA:
      return state.setIn([apiName, actionName], data);
    case _constants.CLEAR_DATA:
      return state.deleteIn([apiName, actionName]);
  }
  return state;
}

function isFetching() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (!type || !payload) return state;
  var apiName = payload.apiName,
      actionName = payload.actionName,
      actionKey = payload.actionKey,
      inputData = payload.inputData,
      data = payload.data;

  switch (type) {
    case _constants.FETCH_DATA:
      return state.setIn([apiName, actionName], !error);
    case _constants.RECEIVE_DATA:
    case _constants.CLEAR_DATA:
      return state.setIn([apiName, actionName], false);
    case _constants.KEYED_DATA:
      return state.setIn([apiName, actionKey], false);
  }
  return state;
}

var initialState = exports.initialState = { entities: entities(),
  isFetching: isFetching()
};

function api() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FETCH_DATA:
      return Object.assign({}, state, { isFetching: isFetching(state.isFetching, action) });
    case _constants.RECEIVE_DATA:
    case _constants.KEYED_DATA:
    case _constants.CLEAR_DATA:
      return Object.assign({}, state, { entities: entities(state.entities, action),
        isFetching: isFetching(state.isFetching, action)
      });
  }
  return state;
}