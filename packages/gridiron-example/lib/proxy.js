'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = proxy;

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***
 * Proxy Module
 * Responsible for reading proxy config and setting up proxies.
 * @module server/proxy
 */
var proxyListen = function proxyListen(_ref) {
  var name = _ref.name,
      fromPort = _ref.fromPort,
      toHost = _ref.toHost,
      toPort = _ref.toPort;
  return 'proxy ' + name + ' directing from :' + fromPort + ' to ' + toHost + ':' + toPort;
};

function proxy() {
  var cdnBindings = new Map(_config.server.bindings.cdn);
  var hasHttp = cdnBindings.has('http');
  var hasHttps = cdnBindings.has('https');
  //const cors = getCors()
  var proxyConfigs = Array.isArray(_config.server.proxies) ? _config.server.proxies : [_config.server.proxies];
  if (proxyConfigs.length === 0) return;

  /*** Iterate proxy configs and start routing */
  proxyConfigs.forEach(function (config) {
    var options = getProxyOptions(config);
    var proxyServer = _httpProxy2.default.createProxyServer(options);
    var listenMessage = proxyListen(config);

    proxyServer.on('error', function (err, req, res) {
      _config.log.error(err, 'error proxying request');
      res.end();
    });

    proxyServer.on('proxyReq', function (proxyReq, req, res, options) {/* This event fires on proxy requests */});

    createProxyServer(_http2.default.createServer(onProxy));

    var createProxyServer = function createProxyServer(server) {
      if (config.allowWebSockets) server.on('upgrade', function (req, socket, head) {
        return server.ws(req, socket, head);
      });
      server.listen(config.fromPort, function () {
        return _config.log.info(listenMessage);
      });
    };

    var onProxy = function onProxy(req, res) {
      //if(!cors.isOk(req))
      //return cors.handleFailure(req, res)

      if (config.stub && config.stub[req.method]) return proxyStub(req, res);

      if (req.method === 'OPTIONS')
        //return cors.handlePreflight(req, res)

        if (config.latency) setTimeout(function () {
          return proxyServer.web(req, res);
        }, config.latency);else proxyServer.web(req, res);
    };

    var proxyStub = function proxyStub(req, res) {
      var stub = config.stub[req.method];
      res.writeHead(200, stub.headers);
      if (stub.headers['content-length'] === 0) res.end();else res.end(JSON.stringify(stub.body));
    };
  });
}

var getProxyOptions = function getProxyOptions(config) {
  var opts = { target: config.target || config.toScheme + '://' + config.toHost + ':config.toPort',
    xfwd: true
  };
  opts.secure = config.secure;
  return opts;
};