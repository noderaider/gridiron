'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxPager = exports.reactMaximize = exports.reactPreThemes = exports.reactPreStyles = exports.reactPre = exports.reactFormulaThemes = exports.reactFormulaStyles = exports.reactFormula = exports.gridironThemes = exports.gridironStyles = exports.gridironReact = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = gridiron;

var _gridironReact = require('gridiron-react');

var _gridironReact2 = _interopRequireDefault(_gridironReact);

var _gridironStyles = require('gridiron-styles');

var _gridironStyles2 = _interopRequireDefault(_gridironStyles);

var _gridironThemes = require('gridiron-themes');

var gridironThemes = _interopRequireWildcard(_gridironThemes);

var _reactFormula = require('react-formula');

var _reactFormula2 = _interopRequireDefault(_reactFormula);

var _reactFormulaStyles = require('react-formula-styles');

var _reactFormulaStyles2 = _interopRequireDefault(_reactFormulaStyles);

var _reactFormulaThemes = require('react-formula-themes');

var reactFormulaThemes = _interopRequireWildcard(_reactFormulaThemes);

var _reactPre = require('react-pre');

var _reactPre2 = _interopRequireDefault(_reactPre);

var _reactPreStyles = require('react-pre-styles');

var _reactPreStyles2 = _interopRequireDefault(_reactPreStyles);

var _reactPreThemes = require('react-pre-themes');

var reactPreThemes = _interopRequireWildcard(_reactPreThemes);

var _reactMaximize = require('react-maximize');

var _reactMaximize2 = _interopRequireDefault(_reactMaximize);

var _reduxPager = require('redux-pager');

var _reduxPager2 = _interopRequireDefault(_reduxPager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.gridironReact = _gridironReact2.default;
exports.gridironStyles = _gridironStyles2.default;
exports.gridironThemes = gridironThemes;
exports.reactFormula = _reactFormula2.default;
exports.reactFormulaStyles = _reactFormulaStyles2.default;
exports.reactFormulaThemes = reactFormulaThemes;
exports.reactPre = _reactPre2.default;
exports.reactPreStyles = _reactPreStyles2.default;
exports.reactPreThemes = reactPreThemes;
exports.reactMaximize = _reactMaximize2.default;
exports.reduxPager = _reduxPager2.default;
function gridiron(deps) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$themeName = _ref.themeName,
      themeName = _ref$themeName === undefined ? 'mellow' : _ref$themeName,
      defaults = _objectWithoutProperties(_ref, ['themeName']);

  var pre = (0, _reactPre2.default)(deps, _extends({}, defaults, { styles: _reactPreStyles2.default, theme: reactPreThemes[themeName] }));
  deps = _extends({}, deps, pre);

  var formula = (0, _reactFormula2.default)(deps, _extends({}, defaults, { styles: _reactFormulaStyles2.default, theme: reactFormulaThemes[themeName] }));
  deps = _extends({}, deps, { formula: formula });

  var args = [deps, _extends({}, defaults, { styles: _gridironStyles2.default, theme: gridironThemes[themeName] })];

  return _extends({}, pre, _gridironReact2.default.apply(undefined, args), { styles: _gridironStyles2.default,
    themes: gridironThemes
  }, _reduxPager2.default.apply(undefined, args), _reactMaximize2.default.apply(undefined, args), { formula: formula,
    reactFormulaStyles: _reactFormulaStyles2.default,
    reactFormulaThemes: reactFormulaThemes,
    reactPreStyles: _reactPreStyles2.default,
    reactPreThemes: reactPreThemes
  });
}