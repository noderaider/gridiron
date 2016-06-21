'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.dependencyResolver = dependencyResolver;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var should = require('chai').should();

/**
 * Creates a dependency resolver that will auto check incoming dependencies against a JavaScript type.
 * @param  {Object} dependencyTypes [description]
 * @return {[type]}                 [description]
 */
function dependencyResolver() {
  var depTypes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var validTypes = ['object', 'function', 'string', 'number'];
  Object.values(depTypes).forEach(function (x) {
    return should.exist(x) && x.should.be.a('string', 'dependency type contraints must be strings') && validTypes.should.include(x, 'dependency type constraints must be valid JavaScript types | passed => ' + x);
  });

  return function (arg) {
    return Object.keys(depTypes).reduce(function (deps, x) {
      should.exist(arg, 'A dependency object of type ' + JSON.stringify(depTypes) + ' is required');
      var dep = arg[x];
      should.exist(dep, 'Dependency \'' + x + '\'\' of type \'' + depTypes[x] + '\' is required but was not passed');
      dep.should.be.a(depTypes[x], 'Dependency \'' + x + '\' was found but its type was incorrect | expected type => \'' + depTypes[x] + '\', passed => \'' + (typeof dep === 'undefined' ? 'undefined' : _typeof(dep)) + '\'');
      return _extends({}, deps, _defineProperty({}, x, arg[x]));
    }, {});
  };
}