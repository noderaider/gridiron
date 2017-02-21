'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mkdirp = _bluebird2.default.promisify(require('mkdirp'));
var writeFile = _bluebird2.default.promisify(require('fs').writeFile);

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$logDirectory = _ref.logDirectory,
      logDirectory = _ref$logDirectory === undefined ? (0, _config.resolveRoot)('log') : _ref$logDirectory;

  return mkdirp(logDirectory).then(function () {
    var logFile = function logFile(name, content) {
      var filePath = _path2.default.join(logDirectory, name);
      return writeFile(filePath, content, 'utf8').then(function () {
        return _config.log.debug('logging => ' + name + ' written to log directory');
      });
    };
    return { logFile: logFile };
  });
};