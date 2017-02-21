'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToCleanUrl = exports.goToPath = exports.goToUrl = exports.cleanUrl = exports.title = exports.query = exports.path = exports.host = exports.port = exports.hostname = exports.protocol = exports.scheme = undefined;

var _config = require('../../config');

var scheme = exports.scheme = _config.IS_BROWSER ? window.location.protocol.slice(0, -1) : 'https';
var protocol = exports.protocol = _config.IS_BROWSER ? window.location.protocol : scheme + ':';
var hostname = exports.hostname = _config.IS_BROWSER ? window.location.hostname : 'SERVERNAME';
var port = exports.port = _config.IS_BROWSER ? parseInt(window.location.port) : 443;
var host = exports.host = _config.IS_BROWSER ? window.location.host : 'SERVER';
var path = exports.path = _config.IS_BROWSER ? window.location.pathname : '/SERVER';
var query = exports.query = _config.IS_BROWSER ? window.location.search.replace('?', '') : '?SERVER=true';
var title = exports.title = _config.IS_BROWSER ? window.document.title : 'SERVER';
var cleanUrl = exports.cleanUrl = protocol + '//' + host + path;
var goToUrl = exports.goToUrl = function goToUrl(newUrl, doPostback) {
  if (!_config.IS_BROWSER) return;
  if (!doPostback) window.history.pushState({ url: newUrl }, null, newUrl);else window.location.replace(newUrl);
};
var goToPath = exports.goToPath = function goToPath(newPath, doPostback) {
  return goToUrl(protocol + '//' + host + newPath, doPostback);
};
var goToCleanUrl = exports.goToCleanUrl = function goToCleanUrl(doPostback) {
  return goToUrl(cleanUrl, doPostback);
};