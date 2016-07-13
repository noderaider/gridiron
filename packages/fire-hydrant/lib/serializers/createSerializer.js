'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSerializer;

var _chai = require('chai');

var _constants = require('../constants');

/** fire function burns it down (serializes), hydrant string evaluates to a function that builds it back up (deserializes) */
function createSerializer(test, fire, hydrant) {
  var validate = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];

  if (_constants.IS_DEV) {
    _chai.assert.ok(test);
    _chai.assert.typeOf(test, 'function');
    _chai.assert.ok(fire);
    _chai.assert.typeOf(fire, 'function');
    _chai.assert.ok(hydrant);
    _chai.assert.typeOf(hydrant, 'string');
    _chai.assert.ok(validate);
    _chai.assert.typeOf(validate, 'function');
  }
  return { test: test, fire: fire, hydrant: hydrant, validate: validate };
}