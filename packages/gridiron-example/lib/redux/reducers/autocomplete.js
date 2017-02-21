'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = autocomplete;

var _constants = require('../constants');

var digitsRE = /\(?\d+\)?/g;
var wordsRE = /[\w\(\)]+/ig;

var idFilter = function idFilter(id, value) {
  var inputDigits = value.match(digitsRE);
  if (!inputDigits) return false;
  return inputDigits.some(function (x) {
    return ('(' + id + ')').includes(x);
  });
};

var nameFilter = function nameFilter(name, value) {
  var inputWords = value.match(wordsRE);
  if (!inputWords) return false;
  return inputWords.some(function (x) {
    return name.toLowerCase().includes(x.toLowerCase());
  });
};

var monikerFilter = function monikerFilter(moniker, value) {
  if (!value) return false;
  return nameFilter(moniker.name, value) || idFilter(moniker.id, value);
};

function value() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.UPDATE_INPUT_VALUE:
      var _value = payload.value;

      return _value;
  }
  return state;
}

function suggestions() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.CLEAR_SUGGESTIONS:
      return [];
    case _constants.FILTER_SUGGESTIONS:
      if (state.value === payload.value) return payload.suggestions;
      console.info('FILTER SUGGESTIONS', payload);
      return payload.suggestions.filter(function (moniker) {
        return monikerFilter(moniker, payload.value);
      }).sort(function (a, b) {
        return a.id - b.id;
      }).slice(0, 12);
  }
  return state;
}

function isLoading() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FETCH_SUGGESTIONS:
      return true;
    case _constants.FILTER_SUGGESTIONS:
      return false;
  }
  return state;
}

var initialState = { value: value(),
  suggestions: suggestions(),
  isLoading: isLoading()
};

function autocomplete() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.UPDATE_INPUT_VALUE:
    case _constants.CLEAR_SUGGESTIONS:
    case _constants.FETCH_SUGGESTIONS:
    case _constants.FILTER_SUGGESTIONS:
      return Object.assign({}, state, { value: value(state.value, action),
        suggestions: suggestions(state.suggestions, action),
        isLoading: isLoading(state.isLoading, action)
      });
  }
  return state;
}