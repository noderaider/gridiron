'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureSecureRouter;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureSecureRouter(paths) {
  var router = _express2.default.Router();
  router.use(function (req, res, next) {
    if (paths.some(function (x) {
      return req.url.startsWith(x);
    })) return res.redirect('https://' + req.get('Host') + req.url);
    next();
  });
  return router;
}