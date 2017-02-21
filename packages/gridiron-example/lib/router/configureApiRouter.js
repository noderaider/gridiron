'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureApiRouter;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../../config');

var _cors = require('../cors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireQ = function requireQ(path) {
  return new _bluebird2.default(function (resolve, reject) {
    _fs2.default.readFile(path, 'utf8', function (err, data) {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

/**
 * API Router
 * Exposes apis for the application.
 */
function configureApiRouter() {
  var router = _express2.default.Router();
  var cors = (0, _cors.getCors)();
  _config.client.STATIC = true;

  //CORS middleware
  var allowCrossDomain = function allowCrossDomain(req, res, next) {
    if (req.method === 'OPTIONS') {
      cors.handlePreflight(req, res);
    } else {
      cors.handle(req, res);
      next();
    }
  };

  router.use(allowCrossDomain);
  router.get('/env', function (req, res) {
    return res.json({ NODE_ENV: process.env.NODE_ENV });
  });
  router.get('/client-config', function (req, res) {
    requireQ(router.locals.CLIENT_CONFIG_PATH).then(function (clientConfig) {
      if (req.query.pretty === '' || req.query.pretty) return res.send('<html><head><title>tix client config</title></head><body><pre>' + JSON.stringify(clientConfig, null, 4) + '</pre></body></html>');
      res.json(clientConfig);
    }, function (err) {
      _config.log.error(err, 'error occurred during client-config');
      res.json(_config.client);
    });
  });
  return router;
}