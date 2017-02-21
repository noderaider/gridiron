#! /usr/bin/env node
'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _bunyan = require('bunyan');

var _config = require('../config');

var _bunyanPmx = require('bunyan-pmx');

var _bunyanPmx2 = _interopRequireDefault(_bunyanPmx);

var _chokidar = require('chokidar');

var _pmx = require('pmx');

var _pmx2 = _interopRequireDefault(_pmx);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//import BunyanSlack from 'bunyan-slack'


var readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);

_pmx2.default.http();

var createPmxLogger = function createPmxLogger() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$name = _ref.name,
      name = _ref$name === undefined ? 'pmx' : _ref$name,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? 'info' : _ref$level,
      _ref$streams = _ref.streams,
      streams = _ref$streams === undefined ? [] : _ref$streams,
      data = _ref.data,
      res = _ref.res;

  var stream = new _bunyanPmx2.default({ data: data, res: res, hijackLoggers: [_config.log] });
  var pmxStream = { level: level, stream: stream };
  return (0, _bunyan.createLogger)({ name: name, streams: [pmxStream].concat(_toConsumableArray(streams)) });
};

var forked = null;

var startServer = function startServer(_ref2) {
  var log = _ref2.log;

  process.stdin.setEncoding('utf8');
  var stdinData = '';
  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk !== null) stdinData += chunk;
  });
  process.stdin.on('end', function () {
    log.info('stdin => ' + stdinData);
    stdinData = '';
  });
  forked = (0, _child_process.fork)('bin/run.js');
  forked.on('close', function () {
    return log.info('server emitted close event');
  });
  forked.on('disconnect', function () {
    return log.info('server emitted disconnect event');
  });
  forked.on('error', function (err) {
    return log.error(err, 'server emitted error event');
  });
  forked.on('exit', function () {
    return log.info('server emitted exit event');
  });
  forked.on('message', function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return log.info({ args: args }, 'server emitted message event');
  });
  log.info('process forked');
};

var stopServer = function stopServer(_ref3) {
  var log = _ref3.log;

  log.warn('sending SIGHUP signal to kill server');
  if (forked) forked.kill('SIGHUP');
};

_pmx2.default.scopedAction('js:start', function (data, res) {
  var log = createPmxLogger({ data: data, res: res, level: 'trace' });
  log.info('starting @tixinc/js');
  startServer({ log: log });
});

_pmx2.default.scopedAction('js:stop', function (data, res) {
  var log = createPmxLogger({ data: data, res: res, level: 'trace' });
  log.info('stopping @tixinc/js');
  stopServer({ log: log });
  process.exit(0);
});

/*
pmx.scopedAction('app:start-hot', (data, res) => {
  const log = createPmxLogger({ data, res })

  let watcher = watch(['.', '../lib/**'], { persistent: true, usePolling: true, interval: 1000 })
  log.warn('waiting until app is built to start server...')
  let stop = null
  const startServer = () => require('./run').then(x => { stop = x })
  const renewServer = () => (stop ? stop().then(startServer) : startServer()).catch(err => {
    log.error(err, 'could not renew server')
  })
  watcher.on('all', path => {
    try {
      log.warn('app changed, starting server')
      renewServer()
    } catch(startErr) {
      log.error(startErr, 'A fatal error occurred starting.')
    }
  })
})
*/

var probe = _pmx2.default.probe();
var measure = probe.histogram({ name: 'Mean Save',
  unit: 'ms',
  measurement: 'mean',
  alert: { mode: 'threshold-avg',
    value: 500,
    interval: 30
  }
});
setInterval(function () {
  return measure.update(Math.floor(Math.random() * 1000));
}, 1000);