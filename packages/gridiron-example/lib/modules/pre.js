'use strict';

Object.defineProperty(exports, "__esModule", {
                                value: true
});
exports.Arrows = exports.Pre = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactPre2 = require('react-pre');

var _reactPre3 = _interopRequireDefault(_reactPre2);

var _reactPreStyles = require('react-pre-styles');

var _reactPreStyles2 = _interopRequireDefault(_reactPreStyles);

var _reactPreThemes = require('react-pre-themes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _reactPre = (0, _reactPre3.default)({ React: _react2.default, shallowCompare: _reactAddonsShallowCompare2.default, Immutable: _immutable2.default }, { styles: _reactPreStyles2.default, theme: _reactPreThemes.carbon }),
    Pre = _reactPre.Pre,
    Arrows = _reactPre.Arrows;

exports.Pre = Pre;
exports.Arrows = Arrows;