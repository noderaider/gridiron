'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractText = undefined;

var _webpack = require('webpack');

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpackStatsPlugin = require('webpack-stats-plugin');

var _config = require('../config.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommonsChunkPlugin = _webpack.optimize.CommonsChunkPlugin,
    OccurenceOrderPlugin = _webpack.optimize.OccurenceOrderPlugin,
    DedupePlugin = _webpack.optimize.DedupePlugin,
    UglifyJsPlugin = _webpack.optimize.UglifyJsPlugin;


var NODE_ENV = process.env.NODE_ENV || 'production';
var getDefinePlugin = function getDefinePlugin(name) {
  return new _webpack.DefinePlugin({ __CLIENT__: true,
    __SERVER__: false,
    __SHIM__: name === 'shim',
    __HOT__: _config.IS_HOT,
    __BASEURL__: _config.baseUrl,
    __DEV__: _config.server.flags.dev,
    __PROD__: _config.server.flags.prod,
    'process.env.NODE_ENV': '"' + (name === 'server' ? 'hot' : NODE_ENV || 'development') + '"'
  });
};

var extractText = exports.extractText = function extractText(loaders, options) {
  return _extractTextWebpackPlugin2.default.extract('universal-style', loaders, options);
};

exports.default = function (name) {
  var plugins = [];

  //if((name === 'app' && !IS_HOT))// || name === 'server')
  plugins.push(new _extractTextWebpackPlugin2.default('[name].css', { allChunks: true, disable: false }));

  if (/^win/.test(process.platform)) plugins.push(new _webpack.IgnorePlugin(/dtrace-provider/i));

  plugins.push(getDefinePlugin(name));
  if (!_config.IS_HOT) plugins.push(new DedupePlugin());
  plugins.push(new OccurenceOrderPlugin());

  if (name === 'app') plugins.push(new CommonsChunkPlugin('commons', 'commons.js'));

  if (name === 'app' && _config.IS_HOT) {
    plugins.push(new _webpack.HotModuleReplacementPlugin());
    plugins.push(new _webpack.NoErrorsPlugin());
    //plugins.push(new SourceMapDevToolPlugin('[file].map', null, '[absolute-resource-path]'))
  }

  if (_config.server.flags.minify) {
    //|| name === 'server') {
    plugins.push(new UglifyJsPlugin({ compress: { warnings: false } }));
    //  plugins.push(new CompressionPlugin( { asset: 'gz/{file}'
    //, algorithm: 'gzip'
    //, regExp: /\.(js|css|html|json|ico|eot|otf|ttf)$/
    //, threshold: 10240
    //, minRatio: 0.8
    //, minRatio: 100
    //} ))
  }
  /*
  if(name === 'server') // Write out stats.json file to build directory.
    plugins.push(new StatsWriterPlugin({ transform: ({ assetsByChunkName }) => ({ main: assetsByChunkName.main[0], css: assetsByChunkName.main[1] }) }))
  */
  return plugins;
};