'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readCertificate = readCertificate;
exports.readPfx = readPfx;

var _config = require('../config');

var _gracefulFs = require('graceful-fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDefaultCertificateRoot = _path2.default.resolve(__dirname, '..', 'etc', 'certificates');

function readCertificate(_ref) {
  var _ref$certificateRoot = _ref.certificateRoot,
      certificateRoot = _ref$certificateRoot === undefined ? getDefaultCertificateRoot() : _ref$certificateRoot,
      filename = _ref.filename;

  var certificatePath = _path2.default.resolve(certificateRoot, filename);
  return new Promise(function (resolve, reject) {
    (0, _gracefulFs.readFile)(certificatePath, function (err, certificate) {
      if (err) return reject(err);
      resolve(certificate);
    });
  });
}

function readPfx(_ref2) {
  var _ref2$certificateRoot = _ref2.certificateRoot,
      certificateRoot = _ref2$certificateRoot === undefined ? getDefaultCertificateRoot() : _ref2$certificateRoot,
      filename = _ref2.filename,
      passphrase = _ref2.passphrase;

  _chai.assert.typeOf(filename, 'string', 'filename for pfx must be specified');
  _chai.assert.isAbove(filename.length, 0, 'filename must not be empty');
  _chai.assert.typeOf(passphrase, 'string', 'passphrase must be a string');
  _chai.assert.isAbove(passphrase.length, 0, 'passphrase must not be empty');
  return readCertificate({ certificateRoot: certificateRoot, filename: filename }).then(function (pfx) {
    return { pfx: pfx, passphrase: passphrase };
  });
}