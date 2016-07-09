'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPES = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

exports.default = solvent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();
/**
 * Creates a dependency resolver that will auto check incoming dependencies against a JavaScript type.
 * @param  {Object} dependencyTypes [description]
 * @return {[type]}                 [description]
 */
function solvent() {
  var depTypes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var validTypes = ['object', 'function', 'string', 'number'];
  (0, _values2.default)(depTypes).forEach(function (x) {
    return should.exist(x, 'solvent: all dependency type contraints require values') && x.should.be.a('string', 'solvent: dependency type contraints must be strings') && validTypes.should.include(x, 'dependency type constraints must be a supported type | supported types => ' + (0, _stringify2.default)(validTypes) + ', provided => ' + x);
  });

  return function (arg) {
    return (0, _keys2.default)(depTypes).reduce(function (deps, x) {
      should.exist(arg, 'solvent: dependency object of type ' + (0, _stringify2.default)(depTypes) + ' is required');
      var dep = arg[x];
      should.exist(dep, 'solvent: dependency \'' + x + '\'\' of type \'' + depTypes[x] + '\' is required but was not passed');
      dep.should.be.a(depTypes[x], 'solvent: dependency \'' + x + '\' was found but its type was incorrect | expected type => \'' + depTypes[x] + '\', provided => \'' + (typeof dep === 'undefined' ? 'undefined' : (0, _typeof3.default)(dep)) + '\'');
      return (0, _extends4.default)({}, deps, (0, _defineProperty3.default)({}, x, arg[x]));
    }, {});
  };
}

var TYPES = exports.TYPES = { React: { React: 'object' },
  ReactDOM: { ReactDOM: 'object' },
  connect: { connect: 'function' },
  shallowCompare: { shallowCompare: 'function' }
};