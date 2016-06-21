'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connect = exports.PropTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _CoreGrid = require('./CoreGrid');

var CoreGrid = _interopRequireWildcard(_CoreGrid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Interface factory for <DrillGrid /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return _extends({}, CoreGrid.PropTypes(React), { mapDrill: React.PropTypes.func.isRequired
  });
};

/**
 * Creates a react-redux style connect function tailed for <DrillGrid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
var Connect = exports.Connect = CoreGrid.Connect;