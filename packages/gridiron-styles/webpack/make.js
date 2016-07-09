'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = make;

var _config = require('../config');

var _devtool = require('./devtool');

var _devtool2 = _interopRequireDefault(_devtool);

var _target = require('./target');

var _target2 = _interopRequireDefault(_target);

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _resolveLoader = require('./resolveLoader');

var _resolveLoader2 = _interopRequireDefault(_resolveLoader);

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _externals = require('./externals');

var _externals2 = _interopRequireDefault(_externals);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _postcss = require('./postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function make(name) {
  if (typeof name !== 'string') throw new Error('Name is required.');
  return { name: name,
    context: _config.__rootname,
    cache: true,
    target: (0, _target2.default)(name),
    devtool: (0, _devtool2.default)(name),
    entry: (0, _entry2.default)(name),
    output: (0, _output2.default)(name),
    resolve: (0, _resolve2.default)(name),
    resolveLoader: (0, _resolveLoader2.default)(name),
    module: (0, _module2.default)(name),
    externals: (0, _externals2.default)(name),
    plugins: (0, _plugins2.default)(name),
    node: (0, _node2.default)(name),
    postcss: (0, _postcss2.default)(name)
  };
}