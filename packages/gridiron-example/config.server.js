'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientLogger = exports.createServerLogger = exports.resolveRoot = exports.__rootname = exports.origins = exports.baseUrl = exports.client = exports.server = undefined;

var _path = require('path');

var _chai = require('chai');

var _bunyan = require('bunyan');

var _configServer = require('./config-server.json');

var _configServer2 = _interopRequireDefault(_configServer);

var _config = require('./config.client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var origins = _configServer2.default.cors.origins.map(function (x) {
  (0, _chai.assert)(typeof x === 'string', 'cors origins must be array of static or regex strings of hosts that should be cors authorized (preflight + headers)');
  return x.replace(/{{HOSTNAME}}/g, _config.client.hostname);
});

var __rootname = __dirname;
var resolveRoot = function resolveRoot() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _path.resolve.apply(undefined, [__rootname].concat(args));
};

var createServerLogger = function createServerLogger(name) {
  return (0, _bunyan.createLogger)({ name: _config.appKey,
    level: 'debug'
  });
};

exports.server = _configServer2.default;
exports.client = _config.client;
exports.baseUrl = _config.baseUrl;
exports.origins = origins;
exports.__rootname = __rootname;
exports.resolveRoot = resolveRoot;
exports.createServerLogger = createServerLogger;
exports.createClientLogger = _config.createClientLogger;
