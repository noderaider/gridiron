'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = factories;

var _createPropagator = require('./createPropagator');

var _createPropagator2 = _interopRequireDefault(_createPropagator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function factories(deps) {
  return { propagator: (0, _createPropagator2.default)(deps)
  };
}