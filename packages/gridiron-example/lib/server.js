'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
//import { readPfx } from './tls'


var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _configureRouter = require('./router/configureRouter');

var _configureRouter2 = _interopRequireDefault(_configureRouter);

var _chai = require('chai');

var _webpack = require('../webpack.config');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _start = function _start(_ref) {
  var app = _ref.app,
      scheme = _ref.scheme,
      binding = _ref.binding,
      opts = _ref.opts;
  return new _bluebird2.default(function (resolve, reject) {
    _chai.assert.ok(binding, 'bindings must be specified');
    _chai.assert.typeOf(binding.port, 'number', 'binding port must be a valid port number');
    _chai.assert.ok(scheme, 'must specify scheme');
    (0, _chai.assert)(scheme === 'http', 'only http scheme supported at this time');
    var port = binding.port;

    var s = _http2.default.createServer(app);
    s.listen(binding.port, function (err) {
      if (err) return reject(err);
      _config.log.info('STARTED @ http://:::' + port);
    });
    resolve(function () {
      return new _bluebird2.default(function (resolve, reject) {
        return s.close(function (err) {
          if (err) return reject(err);
          _config.log.info('STOPPED @ http://:::' + port);
          resolve();
        });
      });
    });
  });
};

var getCdnBinding = function getCdnBinding() {
  return new Map(_config.server.bindings.cdn);
};

/** Which config name to use when hot reloading */
var hotConfigName = 'app';
var configureServer = function configureServer(_ref2) {
  var paths = _ref2.paths;

  var serverMap = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var _step$value = _slicedToArray(_step.value, 2),
          scheme = _step$value[0],
          binding = _step$value[1];

      var app = Object.assign((0, _express2.default)(), { settings: _config.server, locals: paths });

      /** Enable proxying */
      app.set('trust proxy', true);

      if (process.env.NODE_ENV === 'hot') {
        _config.log.info('SERVER STARTING HOT');
        var hotConfig = Array.isArray(_webpack2.default) ? _webpack2.default.filter(function (x) {
          return x.name === hotConfigName;
        })[0] : _webpack2.default;

        var compiler = require('webpack')(hotConfig);
        _config.log.info(hotConfig, 'HOT CONFIG');
        var output = hotConfig.output;

        app.use(require('webpack-dev-middleware')(compiler, { noInfo: true,
          publicPath: output.publicPath
          //, quiet: false
          //, headers: { 'Access-Control-Allow-Origin': '*' }
          //, stats: { colors: true }
        }));
        app.use(require('webpack-hot-middleware')(compiler));
      } else {
        _config.log.info('SERVER STARTING COLD');
      }

      var isSecure = scheme === 'https';
      app.use((0, _configureRouter2.default)({ isSecure: isSecure, paths: paths }));

      var environment = { NODE_ENV: process.env.NODE_ENV };
      _config.log.info({ environment: environment }, 'ENVIRONMENT');

      serverMap.set(scheme, { app: app,
        start: function start() {
          return _start({ app: app, scheme: scheme, binding: binding });
        }
      });
    };

    for (var _iterator = getCdnBinding().entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
    //proxy()
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return serverMap;
};

exports.default = configureServer;