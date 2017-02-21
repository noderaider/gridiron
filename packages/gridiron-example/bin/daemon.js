#! /usr/bin/env node
'use strict';

var _name = require('../lib/package/name');

var _name2 = _interopRequireDefault(_name);

var _pm = require('pm2');

var _pm2 = _interopRequireDefault(_pm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var script = 'bin/run.js';
var max_memory_restart = '100M';
//const exec_mode = 'cluster'

_pm2.default.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  var opts = { name: _name2.default,
    script: script,
    max_memory_restart: max_memory_restart
  };
  _pm2.default.start(opts, function (err, apps) {
    if (err) console.error(err);
    _pm2.default.disconnect();
  });
});