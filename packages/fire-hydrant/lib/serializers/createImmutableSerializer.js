'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImmutableSerializer;

var _chai = require('chai');

var _constants = require('../constants');

var _createSerializer = require('./createSerializer');

var _createSerializer2 = _interopRequireDefault(_createSerializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createImmutableSerializer() {
  var test = function test(x, _ref) {
    var Immutable = _ref.Immutable;
    return Immutable.Iterable.isIterable(x);
  };
  var fire = function fire(x, _ref2) {
    var Immutable = _ref2.Immutable;
    return x.toJS();
  };
  var hydrant = '(function (x, d) { return d.Immutable.fromJS(x) })';
  var validate = function validate(d) {
    if (_constants.IS_DEV) {
      _chai.assert.ok(d.Immutable);
      _chai.assert.typeOf(d.Immutable, 'object');
    }
  };
  return (0, _createSerializer2.default)(test, fire, hydrant, validate);
}