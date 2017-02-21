'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = visual;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _config = require('../../../config');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REDUX_FORM_CHANGE = 'redux-form/CHANGE';

var nextValue = function nextValue(current) {
  var value = current.get('value');
  var options = current.get('options');
  var nextIndex = options.indexOf(value) + 1;
  return nextIndex >= options.size ? options.first() : options.get(nextIndex);
};

function visibility() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error || !payload) return state;
  var componentID = payload.componentID,
      value = payload.value,
      options = payload.options;

  switch (type) {
    case _constants.TOGGLE_VISIBILITY:
      var current = state.get(componentID);
      if (current) {
        var next = nextValue(current);
        return state.setIn([componentID, 'value'], next);
      }
      return state.set(componentID, _immutable2.default.fromJS({ options: options, value: value }));
    case _constants.SET_VISIBILITY:
      if (state.has(componentID)) return state.setIn([componentID, 'value'], value);
      return state.set(componentID, _immutable2.default.fromJS({ options: options, value: value }));
  }
  return state;
}

function expanders() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error || !payload) return state;
  var componentID = payload.componentID,
      value = payload.value,
      initialExpanders = payload.initialExpanders;

  switch (type) {
    case _constants.SET_EXPANDER:
      return state.set(componentID, value);
    case _constants.TOGGLE_EXPANDER:
      return state.update(componentID, initialExpanders, function (x) {
        return !x;
      });
  }
  return state;
}

function tooltip() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map();
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error || !payload) return state;
  var componentID = payload.componentID,
      props = payload.props;

  switch (type) {
    case _constants.REGISTER_TOOLTIP:
      state.set(componentID, props);
    case _constants.DISPOSE_TOOLTIP:
      state.remove(componentID);
  }
  return state;
}

var initialText = {};
function text() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _immutable2.default.Map({ title: _config.title, subtitle: _config.subtitle, packageName: _config.packageName });
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error) return state;
  switch (type) {
    case _constants.SET_TEXT:
      return state.merge(payload);
    case REDUX_FORM_CHANGE:
      var field = action.field,
          value = action.value,
          form = action.form;

      if (form !== 'page') return state;
      return state.set(field, value);
  }
  return state;
}

var initialTheme = _config.defaultThemeName;
function theme() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialTheme;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error || !payload) return state;
  switch (type) {
    case _constants.SET_THEME:
      return payload.name;
  }
  return state;
}

var initialState = { visibility: visibility(), theme: theme(), expanders: expanders(), tooltip: tooltip(), text: text() };

function visual() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.TOGGLE_VISIBILITY:
    case _constants.SET_VISIBILITY:
      return Object.assign({}, state, { visibility: visibility(state.visibility, action) });
    case _constants.SET_THEME:
      return Object.assign({}, state, { theme: theme(state.theme, action) });
    case _constants.TOGGLE_EXPANDER:
    case _constants.SET_EXPANDER:
      return Object.assign({}, state, { expanders: expanders(state.expanders, action) });
    case _constants.REGISTER_TOOLTIP:
    case _constants.DISPOSE_TOOLTIP:
      return Object.assign({}, state, { tooltip: tooltip(state.tooltip, action) });
    case _constants.SET_TEXT:
    case REDUX_FORM_CHANGE:
      return Object.assign({}, state, { text: text(state.text, action) });
  }
  return state;
}