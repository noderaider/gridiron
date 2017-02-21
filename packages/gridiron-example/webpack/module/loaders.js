'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config');

var _plugins = require('../plugins');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//const getImageLoader = () => server.flags.hot ? 'url-loader?limit=8192' : 'file?hash=sha512&digest=hex&name=[hash].[ext]!image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
var getImageLoader = function getImageLoader(name) {
  return { test: /\.(gif|png|jpe?g|svg)$/i,
    loader: 'url-loader?limit=8192'
  };
};

var getJsLoader = function getJsLoader(name) {
  return { test: /\.jsx?$/,
    loader: 'babel',
    exclude: [/node_modules/, /jquery-.*\.js$/]
  };
};

var getJsonLoader = function getJsonLoader(name) {
  return { test: /\.json$/, loader: 'json' };
};

var inlineStyleLoader = function inlineStyleLoader(preLoaders) {
  return 'universal-style!' + preLoaders;
};
var getStyleLoaders = function getStyleLoaders(name) {
  var useExtract = true; //process.env.NODE_ENV !== 'hot' || name === 'server'
  var cssModulesLoader = 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss';
  var cssLoader = 'css!postcss';
  var lessLoader = cssLoader + '!less';
  return [{ test: /\.css$/, loader: useExtract ? (0, _plugins.extractText)(cssModulesLoader) : inlineStyleLoader(cssModulesLoader) }, { test: /\.gcss$/, loader: useExtract ? (0, _plugins.extractText)(cssLoader) : inlineStyleLoader(cssLoader) }, { test: /\.less$/, loader: useExtract ? (0, _plugins.extractText)(lessLoader) : inlineStyleLoader(lessLoader) }];
};

var getFontLoader = function getFontLoader(name) {
  return { test: /\.(otf|eot|woff|woff2|ttf|svg)(\?\S*)?$/i,
    loader: 'url?limit=100000&name=[name].[ext]'
  };
};

exports.default = function (name) {
  var jsLoader = getJsLoader(name);
  switch (name) {
    case 'server':
      return [jsLoader, getJsonLoader(name)].concat(_toConsumableArray(getStyleLoaders(name)), [getImageLoader(name), getFontLoader(name)]);
    case 'static':
      return [jsLoader];
    default:
      return [jsLoader, getJsonLoader(name)].concat(_toConsumableArray(getStyleLoaders(name)), [{ test: /\.png$/,
        loader: 'url?mimetype=image/png&limit=100000&name=[name].[ext]'
      }, getImageLoader(name), getFontLoader(name)]);
  }
};