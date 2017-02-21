'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.disposeTooltip = exports.registerTooltip = exports.toggleExpander = exports.setExpander = exports.setText = exports.setTheme = exports.setVisibility = exports.toggleVisibility = undefined;

var _reduxActions = require('redux-actions');

var _constants = require('../constants');

var toggleVisibility = exports.toggleVisibility = (0, _reduxActions.createAction)(_constants.TOGGLE_VISIBILITY, function (componentID) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [false, true];
        return { componentID: componentID, value: value, options: options };
});
var setVisibility = exports.setVisibility = (0, _reduxActions.createAction)(_constants.SET_VISIBILITY, function (componentID, value) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [false, true];
        return { componentID: componentID, value: value, options: options };
});
var setTheme = exports.setTheme = (0, _reduxActions.createAction)(_constants.SET_THEME, function (name) {
        return { name: name };
});
var setText = exports.setText = (0, _reduxActions.createAction)(_constants.SET_TEXT);

var setExpander = exports.setExpander = (0, _reduxActions.createAction)(_constants.SET_EXPANDER, function (componentID, value) {
        return { componentID: componentID, value: value };
});
var toggleExpander = exports.toggleExpander = (0, _reduxActions.createAction)(_constants.TOGGLE_EXPANDER, function (componentID) {
        var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return { componentID: componentID, initialValue: initialValue };
});

var registerTooltip = exports.registerTooltip = (0, _reduxActions.createAction)(_constants.REGISTER_TOOLTIP, function (componentID, props) {
        return { componentID: componentID, props: props };
});
var disposeTooltip = exports.disposeTooltip = (0, _reduxActions.createAction)(_constants.DISPOSE_TOOLTIP, function (componentID) {
        return { componentID: componentID };
});