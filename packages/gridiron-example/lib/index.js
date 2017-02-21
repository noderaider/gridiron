'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.definePaths = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mkdirp = _bluebird2.default.promisify(require('mkdirp'));

/** Exports a server map of key (schemes) to server startup functions. */

exports.default = function (paths) {
  return (0, _server2.default)({ paths: paths });
};
/** A function to create paths that are used throughout the server. */


var definePaths = exports.definePaths = function definePaths() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$NODE_ROOT = _ref.NODE_ROOT,
      NODE_ROOT = _ref$NODE_ROOT === undefined ? _config.__rootname : _ref$NODE_ROOT,
      _ref$NODE_MODULES_ROO = _ref.NODE_MODULES_ROOT,
      NODE_MODULES_ROOT = _ref$NODE_MODULES_ROO === undefined ? (0, _config.resolveRoot)('node_modules') : _ref$NODE_MODULES_ROO,
      _ref$SERVER_CONFIG_PA = _ref.SERVER_CONFIG_PATH,
      SERVER_CONFIG_PATH = _ref$SERVER_CONFIG_PA === undefined ? (0, _config.resolveRoot)('config-server.json') : _ref$SERVER_CONFIG_PA,
      _ref$CLIENT_CONFIG_PA = _ref.CLIENT_CONFIG_PATH,
      CLIENT_CONFIG_PATH = _ref$CLIENT_CONFIG_PA === undefined ? (0, _config.resolveRoot)('config-client.json') : _ref$CLIENT_CONFIG_PA,
      _ref$PUBLIC_ROOT = _ref.PUBLIC_ROOT,
      PUBLIC_ROOT = _ref$PUBLIC_ROOT === undefined ? (0, _config.resolveRoot)('public') : _ref$PUBLIC_ROOT,
      _ref$ASSETS_ROOT = _ref.ASSETS_ROOT,
      ASSETS_ROOT = _ref$ASSETS_ROOT === undefined ? (0, _config.resolveRoot)('public/assets') : _ref$ASSETS_ROOT,
      _ref$STATIC_ROOT = _ref.STATIC_ROOT,
      STATIC_ROOT = _ref$STATIC_ROOT === undefined ? (0, _config.resolveRoot)('public/static') : _ref$STATIC_ROOT,
      _ref$IMAGES_ROOT = _ref.IMAGES_ROOT,
      IMAGES_ROOT = _ref$IMAGES_ROOT === undefined ? (0, _config.resolveRoot)('public/static/images') : _ref$IMAGES_ROOT,
      _ref$DATA_ROOT = _ref.DATA_ROOT,
      DATA_ROOT = _ref$DATA_ROOT === undefined ? (0, _config.resolveRoot)('data') : _ref$DATA_ROOT,
      _ref$SRC_ROOT = _ref.SRC_ROOT,
      SRC_ROOT = _ref$SRC_ROOT === undefined ? (0, _config.resolveRoot)('src') : _ref$SRC_ROOT,
      _ref$APP_ROOT = _ref.APP_ROOT,
      APP_ROOT = _ref$APP_ROOT === undefined ? (0, _config.resolveRoot)('app') : _ref$APP_ROOT,
      _ref$LIB_ROOT = _ref.LIB_ROOT,
      LIB_ROOT = _ref$LIB_ROOT === undefined ? (0, _config.resolveRoot)('lib') : _ref$LIB_ROOT,
      _ref$BIN_ROOT = _ref.BIN_ROOT,
      BIN_ROOT = _ref$BIN_ROOT === undefined ? (0, _config.resolveRoot)('bin') : _ref$BIN_ROOT,
      _ref$LOG_ROOT = _ref.LOG_ROOT,
      LOG_ROOT = _ref$LOG_ROOT === undefined ? (0, _config.resolveRoot)('log') : _ref$LOG_ROOT,
      _ref$DOC_ROOT = _ref.DOC_ROOT,
      DOC_ROOT = _ref$DOC_ROOT === undefined ? (0, _config.resolveRoot)('doc') : _ref$DOC_ROOT,
      _ref$MOD_ROOT = _ref.MOD_ROOT,
      MOD_ROOT = _ref$MOD_ROOT === undefined ? _path2.default.resolve(_config.server.fs.MOD_ROOT) : _ref$MOD_ROOT;

  var paths = { NODE_ROOT: NODE_ROOT, NODE_MODULES_ROOT: NODE_MODULES_ROOT, SERVER_CONFIG_PATH: SERVER_CONFIG_PATH, CLIENT_CONFIG_PATH: CLIENT_CONFIG_PATH, PUBLIC_ROOT: PUBLIC_ROOT, ASSETS_ROOT: ASSETS_ROOT, STATIC_ROOT: STATIC_ROOT, IMAGES_ROOT: IMAGES_ROOT, DATA_ROOT: DATA_ROOT, SRC_ROOT: SRC_ROOT, APP_ROOT: APP_ROOT, LIB_ROOT: LIB_ROOT, DOC_ROOT: DOC_ROOT, BIN_ROOT: BIN_ROOT, LOG_ROOT: LOG_ROOT, MOD_ROOT: MOD_ROOT };
  Object.keys(paths).forEach(function (x) {
    return _chai.assert.typeOf(paths[x], 'string', 'path ' + x + ' must be a string') && _chai.assert.isAbove(paths[x].length, 0, 'path ' + x + ' must have length greater than 0');
  });
  return mkdirp(paths.LOG_ROOT).then(function () {
    return paths;
  }).catch(function (err) {
    console.error('An error occurred attempting to create log directory.', err);
    process.exit(1);
  });
};