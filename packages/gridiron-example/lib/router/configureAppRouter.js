'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureAppRouter;

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _serveFile = require('serve-file');

var _serveFile2 = _interopRequireDefault(_serveFile);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactStamp = require('react-stamp');

var _reactStamp2 = _interopRequireDefault(_reactStamp);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

var _fireHydrant = require('fire-hydrant');

var _theme = require('../context/theme');

var _context = require('../context');

var _config = require('../../config');

var _identity = require('../redux/actions/identity');

var _minify = require('../services/minify');

var _minify2 = _interopRequireDefault(_minify);

var _logging = require('../services/logging');

var _logging2 = _interopRequireDefault(_logging);

var _persistence = require('../services/persistence');

var _configureStore = require('../redux/store/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

var _routes = require('../app/routes');

var _routes2 = _interopRequireDefault(_routes);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _universalStyles = require('universal-styles');

var _ErrorPage = require('../components/ErrorPage');

var _ErrorPage2 = _interopRequireDefault(_ErrorPage);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _postcssUrl = require('postcss-url');

var _postcssUrl2 = _interopRequireDefault(_postcssUrl);

var _postcssCssnext = require('postcss-cssnext');

var _postcssCssnext2 = _interopRequireDefault(_postcssCssnext);

var _postcssFontMagician = require('postcss-font-magician');

var _postcssFontMagician2 = _interopRequireDefault(_postcssFontMagician);

var _cssnano = require('cssnano');

var _cssnano2 = _interopRequireDefault(_cssnano);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var cssProcessor = (0, _postcss2.default)([(0, _postcssImport2.default)(), (0, _postcssUrl2.default)({ url: 'inline',
  assetsPath: '../images'
}), (0, _postcssCssnext2.default)(), (0, _postcssFontMagician2.default)(), (0, _cssnano2.default)()]);

function processCSS(css) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$meta = _ref.meta,
      meta = _ref$meta === undefined ? {} : _ref$meta;

  return cssProcessor.process(css, { from: meta.resourcePath }).then(function (x) {
    return x.css;
  });
}

var WarnGTM = function WarnGTM(_ref2) {
  _objectDestructuringEmpty(_ref2);

  return _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: 'if(!window.google_tag_manager) console.info("GTM BLOCKED => consider disabling ad block so we can see how much usage we\'re getting")' } });
};

var BodyInit = function BodyInit(_ref3) {
  var theme = _ref3.theme;
  var style = theme.style;
  var _style$body = style.body,
      backgroundColor = _style$body.backgroundColor,
      margin = _style$body.margin,
      padding = _style$body.padding;

  var __html = (0, _minify2.default)('\n  document.body.style.backgroundColor = \'' + backgroundColor + '\'\n  document.body.style.margin = \'' + margin + '\'\n  document.body.style.padding = \'' + padding + '\'\n');
  return _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: __html } });
};

var InitialState = (0, _fireHydrant.createInitialState)({ React: _react2.default, Immutable: _immutable2.default });

var renderMarkup = function renderMarkup(html) {
  return '<!doctype html>\n' + (0, _server.renderToStaticMarkup)(html);
};

function configureAppRouter(_ref4) {
  var cors = _ref4.cors,
      paths = _ref4.paths;
  var SRC_ROOT = paths.SRC_ROOT,
      APP_ROOT = paths.APP_ROOT,
      LIB_ROOT = paths.LIB_ROOT,
      STATIC_ROOT = paths.STATIC_ROOT,
      ASSETS_ROOT = paths.ASSETS_ROOT;

  var universalMiddleware = (0, _universalStyles.reactStyles)(_react2.default, { processCSS: processCSS });

  return universalMiddleware(function (req) {
    return new _promise2.default(function (resolve, reject) {
      var memoryHistory = (0, _reactRouter.createMemoryHistory)(req.path);
      var store = (0, _configureStore2.default)(memoryHistory);
      var history = (0, _reactRouterRedux.syncHistoryWithStore)(memoryHistory, store);
      (0, _reactRouter.match)({ history: history,
        routes: _routes2.default,
        location: req.url
      }, function (error, redirectLocation, renderProps) {
        var renderBody = function renderBody() {
          if (error) {
            return reject(new _universalStyles.RoutingError({ status: 500,
              statusMessage: 'Body rendering error occurred.',
              error: error
            }));
          } else if (redirectLocation) {
            return reject(new _universalStyles.RoutingError({ status: 302,
              redirect: redirectLocation.pathname + redirectLocation.search
            }));
          } else if (renderProps) {
            var state = store.getState();
            var theme = (0, _theme.getThemeForUrl)(state.visual.theme, req.url);

            var appMarkup = _config.server.flags.render ? (0, _server.renderToString)(_react2.default.createElement(
              _reactRedux.Provider,
              { store: store },
              _react2.default.createElement(_reactRouter.RouterContext, renderProps)
            )) : null;
            return _react2.default.createElement(
              'body',
              null,
              _react2.default.createElement(BodyInit, { theme: theme }),
              _config.server.flags.render ? _react2.default.createElement(InitialState, { globalKey: _config.packageKey, state: state, serialize: _fireHydrant.serialize }) : null,
              _config.server.flags.render ? _react2.default.createElement('div', { id: 'root', dangerouslySetInnerHTML: { __html: appMarkup } }) : _react2.default.createElement('div', { id: 'root' }),
              _react2.default.createElement('script', { src: '/assets/app.js' })
            );
          } else {
            reject(false);
          }
        };

        var renderHead = function renderHead(styles) {
          var title = 'gridiron-example' + (_config.IS_HOT ? ' is so hot right now...' : _config.IS_DEV ? ' is so dev right now...' : '');
          var items = [_react2.default.createElement('meta', { charSet: 'utf-8' }), _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }), _react2.default.createElement(
            'title',
            null,
            title
          ), _react2.default.createElement('link', { rel: 'icon', href: _config.faviconUrl, type: 'image/x-icon' })].concat(_toConsumableArray(_config.server.flags.render ? styles : []), [_react2.default.createElement('link', { rel: 'stylesheet', href: '/assets/app.css', type: 'text/css' }), _react2.default.createElement('script', { dangerouslySetInnerHTML: { __html: '(function(d) {\n                          var config = { kitId: \'xsj1dhs\', scriptTimeout: 3000, async: true },\n                          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src=\'https://use.typekit.net/\'+config.kitId+\'.js\';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)\n                          })(document)\n                          ' } }), _react2.default.createElement('script', { src: '/assets/polyfill.js' }), _react2.default.createElement('script', { src: '/assets/vendor.js' }), _react2.default.createElement('script', { src: '/assets/commons.js' })]);
          return _react2.default.createElement(
            'head',
            null,
            items.map(function (x, key) {
              return _react2.default.cloneElement(x, { key: key });
            })
          );
        };

        var renderPage = function renderPage(_ref5) {
          var head = _ref5.head,
              body = _ref5.body;
          return renderMarkup(_react2.default.createElement(
            'html',
            null,
            head,
            body
          ));
        };
        return resolve({ renderBody: renderBody, renderHead: renderHead, renderPage: renderPage });
      });
    });
  }, function (promise, res, next) {
    return promise.then(function (page) {
      return res.send(page);
    }).catch(function (err) {
      if (err === false) {
        return next();
      }
      console.error(err, 'AN ERROR OCCURRED');
      try {
        if (err instanceof _universalStyles.RoutingError) {
          var status = err.status,
              statusMessage = err.statusMessage,
              redirect = err.redirect,
              innerError = err.innerError;

          if (status === 302) return res.redirect(302, redirect);
          return res.status(status).send(renderMarkup(_react2.default.createElement(
            _ErrorPage2.default,
            { status: status, statusMessage: statusMessage },
            innerError
          )));
        } else {
          return res.status(500).send(renderMarkup(_react2.default.createElement(
            _ErrorPage2.default,
            { statusMessage: err.message || error },
            err
          )));
        }
      } catch (internalError) {
        console.error(internalError, 'REALLY BAD ERROR OCCURRED');
      }
    });
  });
}