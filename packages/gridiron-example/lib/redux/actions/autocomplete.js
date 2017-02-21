'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterSuggestionsError = exports.filterSuggestions = exports.fetchSuggestions = exports.clearSuggestions = exports.updateInputValue = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.loadSuggestions = loadSuggestions;

var _reduxActions = require('redux-actions');

var _api = require('./api');

var _constants = require('../constants');

var updateInputValue = exports.updateInputValue = (0, _reduxActions.createAction)(_constants.UPDATE_INPUT_VALUE, function (_ref, value) {
  var _ref2 = _slicedToArray(_ref, 2),
      apiName = _ref2[0],
      actionName = _ref2[1];

  return { apiName: apiName, actionName: actionName, value: value };
});
var clearSuggestions = exports.clearSuggestions = (0, _reduxActions.createAction)(_constants.CLEAR_SUGGESTIONS, function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      apiName = _ref4[0],
      actionName = _ref4[1];

  return { apiName: apiName, actionName: actionName };
});
var fetchSuggestions = exports.fetchSuggestions = (0, _reduxActions.createAction)(_constants.FETCH_SUGGESTIONS, function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      apiName = _ref6[0],
      actionName = _ref6[1];

  return { apiName: apiName, actionName: actionName };
});
var filterSuggestions = exports.filterSuggestions = (0, _reduxActions.createAction)(_constants.FILTER_SUGGESTIONS, function (_ref7, suggestions, value) {
  var _ref8 = _slicedToArray(_ref7, 2),
      apiName = _ref8[0],
      actionName = _ref8[1];

  return { apiName: apiName, actionName: actionName, suggestions: suggestions, value: value };
});
var filterSuggestionsError = exports.filterSuggestionsError = (0, _reduxActions.createAction)(_constants.FILTER_SUGGESTIONS);

function loadSuggestions(_ref9, value) {
  var _ref10 = _slicedToArray(_ref9, 2),
      apiName = _ref10[0],
      actionName = _ref10[1];

  return function (dispatch, getState) {
    var _getState = getState(),
        api = _getState.api;

    var suggestions = api.entities.getIn([apiName, actionName]);
    if (suggestions) return Promise.resolve(dispatch(filterSuggestions([apiName, actionName], suggestions, value)));
    dispatch(fetchSuggestions([apiName, actionName]));
    return dispatch((0, _api.apiAction)([apiName, actionName])).then(function (data) {
      return dispatch(filterSuggestions([apiName, actionName], data, value));
    }).catch(function (err) {
      return dispatch(filterSuggestionsError(err));
    });
  };
}