'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcssModules = require('postcss-modules');

var _postcssModules2 = _interopRequireDefault(_postcssModules);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _postcssUrl = require('postcss-url');

var _postcssUrl2 = _interopRequireDefault(_postcssUrl);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

var _postcssFontMagician = require('postcss-font-magician');

var _postcssFontMagician2 = _interopRequireDefault(_postcssFontMagician);

var _postcssBrowserReporter = require('postcss-browser-reporter');

var _postcssBrowserReporter2 = _interopRequireDefault(_postcssBrowserReporter);

var _postcssReporter = require('postcss-reporter');

var _postcssReporter2 = _interopRequireDefault(_postcssReporter);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name) {
  return function (webpack) {

    var prodPostcss = [(0, _postcssImport2.default)({ addDependencyTo: webpack }), (0, _postcssUrl2.default)({ url: 'inline'
      //, basePath: '../src/app'
      , assetsPath: '../images'
    }), (0, _postcssCssnext2.default)(), (0, _postcssFontMagician2.default)({ hosted: '../public/fonts'
    })
    /*
    , postcssModules( { scopeBehaviour: 'global'
                      } )
                      */
    ];
    if (!_config.IS_DEV) return prodPostcss;

    var messagesStyle = { color: 'rgb(255, 255, 255)',
      'background-color': 'rgb(255, 100, 100)',
      position: 'fixed',
      'font-family': 'Lato',
      'z-index': 1000000,
      top: '70px',
      width: '500px',
      'margin-left': 'auto',
      'margin-right': 'auto'
    };
    return [].concat(prodPostcss, [(0, _postcssBrowserReporter2.default)({ styles: messagesStyle }), (0, _postcssReporter2.default)()]);
  };
};