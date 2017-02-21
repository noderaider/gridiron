'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureRouter;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _chai = require('chai');

var _path = require('path');

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _config = require('../../config');

var _cors = require('../cors');

var _configureUnsupportedRouter = require('./configureUnsupportedRouter');

var _configureUnsupportedRouter2 = _interopRequireDefault(_configureUnsupportedRouter);

var _configureSecureRouter = require('./configureSecureRouter');

var _configureSecureRouter2 = _interopRequireDefault(_configureSecureRouter);

var _configureApiRouter = require('./configureApiRouter');

var _configureApiRouter2 = _interopRequireDefault(_configureApiRouter);

var _configureAppRouter = require('./configureAppRouter');

var _configureAppRouter2 = _interopRequireDefault(_configureAppRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cors = (0, _cors.getCors)();

var gzipExtensionFilter = /^(js|css|html|json|ico|eot|otf|ttf)$/;

var contentTypeMap = { 'js': 'text/javascript',
  'json': 'application/json',
  'css': 'text/css',
  'html': 'text/html',
  'xml': 'text/xml',
  'ico': 'image/x-icon',
  'woff': 'application/x-font-woff',
  'woff2': 'application/font-woff2',
  'ttf': 'application/x-font-ttf',
  'otf': 'application/x-font-otf',
  'eot': 'application/vnd.ms-fontobject',
  'svg': 'image/svg+xml',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'tiff': 'image/tiff'
};

/**
 * configureRouter
 * Constructs a router for the application.
 * @module server/lib/routers/configureRouter
 */
function configureRouter(_ref) {
  var isSecure = _ref.isSecure,
      paths = _ref.paths;
  var PUBLIC_ROOT = paths.PUBLIC_ROOT,
      STATIC_ROOT = paths.STATIC_ROOT,
      ASSETS_ROOT = paths.ASSETS_ROOT,
      DATA_ROOT = paths.DATA_ROOT,
      APP_ROOT = paths.APP_ROOT,
      NODE_MODULES_ROOT = paths.NODE_MODULES_ROOT,
      DOC_ROOT = paths.DOC_ROOT;


  var router = _express2.default.Router();

  /** REDIRECT TO HTTPS ROUTE */
  var SECURE_REDIRECTS = [];
  if (!isSecure) router.use((0, _configureSecureRouter2.default)(SECURE_REDIRECTS));

  router.use((0, _serveFavicon2.default)(_config.faviconPath));
  router.use('/img', _express2.default.static((0, _path.join)(PUBLIC_ROOT, 'img')));
  router.use('/data', _express2.default.static((0, _path.join)(DATA_ROOT)));
  /*
  router.use('/node_modules/papaparse', express.static(join(NODE_MODULES_ROOT, 'papaparse')))
  */

  router.use((0, _configureUnsupportedRouter2.default)());
  if (process.env.NODE_ENV !== 'production') router.use('/doc', _express2.default.static(DOC_ROOT));
  router.use('/assets', _express2.default.static(ASSETS_ROOT));
  router.use('/static', _express2.default.static(STATIC_ROOT));
  router.use((0, _configureAppRouter2.default)({ paths: paths, cors: cors }));
  return router;
}