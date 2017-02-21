'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.clearErrors = exports.dismissError = undefined;

var _reduxActions = require('redux-actions');

var _constants = require('../constants');

/** TODO: DECIDE BETWEEN THIS STYLE GENERIC OR ERRORS CROSS CUTTING EVENTS FROM ALL CATEGORIES */
//export const addError = createAction(ADD_ERROR, (err, category, event) => ({ err, category, event }))
var dismissError = exports.dismissError = (0, _reduxActions.createAction)(_constants.DISMISS_ERROR, function (category, id) {
        return { category: category, id: id };
});
var clearErrors = exports.clearErrors = (0, _reduxActions.createAction)(_constants.CLEAR_ERRORS);