'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCors = getCors;

var _config = require('../config');

var _stream = require('./stream');

var logOriginPass = function logOriginPass(origin, pattern) {
  return log.trace('PASS: origin [' + origin + '] matches pattern [' + pattern + '].');
};
var logOriginFail = function logOriginFail(origin) {
  return log.trace('FAIL: origin [' + origin + '] does not match any patterns.');
};
var logOriginDNE = function logOriginDNE() {
  return log.trace('DNE: origin header does not exist.');
};

var corsValidator = function corsValidator(patterns) {
  return function (req) {
    return typeof req.headers.origin === 'string' ? patterns.filter(function (x) {
      return x.test(req.headers.origin);
    }).map((0, _stream.devStream)(function (x) {
      return logOriginPass(req.headers.origin, x);
    })).length > 0 : true;
  };
};

function getCors() {
  var isOriginOk = _config.origins ? corsValidator(_config.origins.map(function (x) {
    return new RegExp(x);
  })) : true;

  var failureStatus = { code: 403,
    message: '403 Forbidden'
  };

  var getError = function getError(req) {
    return req.headers.origin ? { message: logOriginFail(req.headers.origin), code: 10 } : { message: logOriginDNE(), code: 11 };
  };

  var getOptionsHeaders = function getOptionsHeaders(req) {
    return { 'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Max-Age': 604800 // Specifies how long the preflight response can be cached in seconds
      , 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': true
    };
  };

  var handle = function handle(req, res) {
    var resolvedOrigin = req.headers.origin || req.headers.host;
    if (!isOriginOk(req)) return req.headers.origin ? log.error('proxy -origin [' + resolvedOrigin + '], method [' + req.method + ']') : log.warn('proxy -host [%s], method [%s]', req.headers.host, req.method);
    log.trace('proxy +' + (req.headers.origin ? 'origin' : 'host') + ' [' + resolvedOrigin + '], method [' + req.method + ']');
    res.setHeader('Access-Control-Allow-Origin', resolvedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  };

  var handlePreflight = function handlePreflight(req, res) {
    res.writeHead(200, getOptionsHeaders(req));
    res.end();
  };

  var handleFailure = function handleFailure(req, res) {
    res.writeHead(failureStatus.code);
    res.end(JSON.stringify({ message: failureStatus.message,
      errors: [getError(req)]
    }));
  };

  return { isOriginOk: isOriginOk,
    failureStatus: failureStatus,
    getError: getError,
    getOptionsHeaders: getOptionsHeaders,
    handle: handle,
    handlePreflight: handlePreflight,
    handleFailure: handleFailure
  };
}