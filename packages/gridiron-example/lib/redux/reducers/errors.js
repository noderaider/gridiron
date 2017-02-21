'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = errors;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function errors() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.fromJS({ api: [], identity: [] });
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  // HANDLE NON ERRORS

  if (!error) {
    switch (type) {
      case _constants.DISMISS_ERROR:
        var category = payload.category,
            id = payload.id;

        return state.deleteIn([category, id]);
      case _constants.CLEAR_ERRORS:
      case _constants.RECEIVE_AUTHORIZE_IDENTITY:
      case _constants.RECEIVE_REFRESH_IDENTITY:
      case _constants.RECEIVE_IMPERSONATE_IDENTITY:
      case _constants.SET_IDENTITY:
        return _immutable2.default.fromJS({ api: [], identity: [] });
      case _constants.FETCH_DATA:
        return state.set('identity', _immutable2.default.List());
    }
    return state;
  }

  var err = payload ? payload : new Error('Unknown Error');

  // HANDLE ERRORS
  switch (type) {
    case _constants.AUTHORIZE_MIDDLEWARE:
    case _constants.DISMISS_ERROR:
    case _constants.RECEIVE_AUTHORIZE_IDENTITY:
    case _constants.RECEIVE_REFRESH_IDENTITY:
    case _constants.RECEIVE_IMPERSONATE_IDENTITY:
    case _constants.FETCH_DATA:
    case _constants.RECEIVE_DATA:
    case _constants.KEYED_DATA:
    case _constants.CLEAR_DATA:
      return state.update('api', function (x) {
        return x.unshift(err);
      });
    case _constants.FETCH_IDENTITY:
    case _constants.SET_IDENTITY:
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
    case _constants.IDENTITY_EXPIRED:
    case _constants.AUTHORIZE_MIDDLEWARE:
      return state.update('identity', function (x) {
        return x.unshift(err);
      });
  }
  return state;
}