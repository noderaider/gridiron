'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInitialState = exports.deserialize = exports.serialize = exports.fromHydrant = exports.toHydrant = undefined;

var _createFireHydrant2 = require('./createFireHydrant');

var _createFireHydrant3 = _interopRequireDefault(_createFireHydrant2);

var _createImmutableSerializer = require('./serializers/createImmutableSerializer');

var _createImmutableSerializer2 = _interopRequireDefault(_createImmutableSerializer);

var _createInitialState = require('./react/createInitialState');

var _createInitialState2 = _interopRequireDefault(_createInitialState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createFireHydrant = (0, _createFireHydrant3.default)({ serializers: [(0, _createImmutableSerializer2.default)()] });

var toHydrant = _createFireHydrant.toHydrant;
var fromHydrant = _createFireHydrant.fromHydrant;
var serialize = _createFireHydrant.serialize;
var deserialize = _createFireHydrant.deserialize;
exports.toHydrant = toHydrant;
exports.fromHydrant = fromHydrant;
exports.serialize = serialize;
exports.deserialize = deserialize;
exports.createInitialState = _createInitialState2.default;