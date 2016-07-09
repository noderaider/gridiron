'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _config = require('../config.js');

var CommonsChunkPlugin = _webpack.optimize.CommonsChunkPlugin;
//import CompressionPlugin from 'compression-webpack-plugin'
//import ExtractTextPlugin from 'extract-text-webpack-plugin'

var OccurenceOrderPlugin = _webpack.optimize.OccurenceOrderPlugin;
var DedupePlugin = _webpack.optimize.DedupePlugin;
var UglifyJsPlugin = _webpack.optimize.UglifyJsPlugin;


var NODE_ENV = process.env.NODE_ENV || 'production';
var getDefinePlugin = function getDefinePlugin(name) {
  return new _webpack.DefinePlugin({ __HOT__: process.env.NODE_ENV === 'hot',
    __BASEURL__: _config.baseUrl,
    'process.env.NODE_ENV': '"' + (NODE_ENV || 'development') + '"'
  });
};

//export const extractText = (loaders, options) => ExtractTextPlugin.extract('style', loaders, options)

exports.default = function (name) {
  var plugins = [];

  //if((name === 'app' && !IS_HOT))// || name === 'server')
  //plugins.push(new ExtractTextPlugin('[name].css', { allChunks: true, disable: false }))

  if (/^win/.test(process.platform)) plugins.push(new _webpack.IgnorePlugin(/dtrace-provider/i));

  plugins.push(getDefinePlugin(name));
  plugins.push(new OccurenceOrderPlugin());

  /*
    if(name === 'app')
      plugins.push(new CommonsChunkPlugin('commons', 'commons.js'))
    */

  if (name === 'app' && IS_HOT) {}
  //plugins.push(new HotModuleReplacementPlugin())
  //plugins.push(new NoErrorsPlugin())
  //plugins.push(new SourceMapDevToolPlugin('[file].map', null, '[absolute-resource-path]'))


  //if(server.flags.minify) { //|| name === 'server') {
  //plugins.push(new UglifyJsPlugin({ compress: { warnings: false } }))
  //  plugins.push(new CompressionPlugin( { asset: 'gz/{file}'
  //, algorithm: 'gzip'
  //, regExp: /\.(js|css|html|json|ico|eot|otf|ttf)$/
  //, threshold: 10240
  //, minRatio: 0.8
  //, minRatio: 100
  //} ))
  //}
  /*
  if(name === 'server') // Write out stats.json file to build directory.
    plugins.push(new StatsWriterPlugin({ transform: ({ assetsByChunkName }) => ({ main: assetsByChunkName.main[0], css: assetsByChunkName.main[1] }) }))
  */
  return plugins;
};