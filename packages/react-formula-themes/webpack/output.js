'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config.js');

var _path = require('path');

var getPath = function getPath(name) {
  switch (name) {
    case 'lib':
      return (0, _config.resolveRoot)('.');
    case 'server':
      return (0, _config.resolveRoot)('lib', 'app');
    case 'static':
      return (0, _config.resolveRoot)('public', 'assets');
    default:
      return (0, _config.resolveRoot)('public', 'assets');
  }
};

var getPublicPath = function getPublicPath(name) {
  switch (name) {
    case 'lib':
      return '/';
    case 'server':
      return '/lib/app';
    case 'static':
      return _config.baseUrl + '/assets/';
    default:
      return _config.baseUrl + '/assets/';
  }
};

var getLibrary = function getLibrary(name) {
  return _config.libName;
};

var getLibraryTarget = function getLibraryTarget(name) {
  switch (name) {
    case 'lib':
      return 'umd';
    case 'server':
      return 'commonjs2';
  }
};

var getFilename = function getFilename(name) {
  return '[name].js';
};
var getChunkFilename = function getChunkFilename(name) {
  return '[name].js';
};
var getSourceMapFilename = function getSourceMapFilename(name) {
  return '[file].map';
};
var getDevtoolModuleFilenameTemplate = function getDevtoolModuleFilenameTemplate(name) {
  return 'file:///[absolute-resource-path]';
};
var getHotUpdateChunkFilename = function getHotUpdateChunkFilename(name) {
  return '[id].[hash].hot-update.js';
};
var getHotUpdateMainFilename = function getHotUpdateMainFilename(name) {
  return '[hash].hot-update.json';
};
var getCrossOriginLoading = function getCrossOriginLoading(name) {
  return 'anonymous';
};

exports.default = function (name) {
  var output = { path: getPath(name),
    library: getLibrary(name),
    libraryTarget: getLibraryTarget(name),
    pathinfo: process.env.NODE_ENV === 'hot',
    publicPath: getPublicPath(name),
    filename: getFilename(name),
    chunkFilename: getChunkFilename(name),
    crossOriginLoading: getCrossOriginLoading(name)
    //, devtoolModuleFilenameTemplate: getDevtoolModuleFilenameTemplate(name)
    //, sourceMapFilename: getSourceMapFilename(name)
    //, hotUpdateChunkFilename: getHotUpdateChunkFilename(name)
    //, hotUpdateMainFilename: getHotUpdateMainFilename(name)
  };
  console.warn('OUTPUT', JSON.stringify(output, null, 2));
  return output;
};