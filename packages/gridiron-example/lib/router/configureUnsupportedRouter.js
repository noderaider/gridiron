'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureUnsupportedRouter;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _config = require('../../config');

var _browserDetective = require('browser-detective');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HTML = function HTML(_ref) {
  var name = _ref.name,
      title = _ref.title,
      version = _ref.version,
      emulatedVersion = _ref.emulatedVersion,
      platform = _ref.platform,
      platformVersion = _ref.platformVersion;
  return _react2.default.createElement(
    'html',
    { lang: 'en' },
    _react2.default.createElement(
      'head',
      null,
      _react2.default.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=Edge' }),
      _react2.default.createElement('meta', { charSet: 'utf-8' }),
      _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
      _react2.default.createElement('base', { href: '/' }),
      _react2.default.createElement(
        'title',
        null,
        'Unsupported'
      ),
      _react2.default.createElement('link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' })
    ),
    _react2.default.createElement(
      'body',
      null,
      _react2.default.createElement(
        'h1',
        null,
        'Unsupported Browser Detected'
      ),
      _react2.default.createElement(
        'div',
        null,
        'Use a modern browser instead.'
      )
    )
  );
};

var getHTML = function getHTML(props) {
  return '<!doctype html>\n' + (0, _server.renderToString)(_react2.default.createElement(HTML, props));
};

function configureUnsupportedRouter() {
  var router = (0, _router2.default)();
  router.use(function (req, res, next) {
    var userAgent = req.headers['user-agent'];
    if (!userAgent) next();
    var browser = (0, _browserDetective.detectBrowser)(userAgent);
    var name = browser.name,
        title = browser.title,
        version = browser.version,
        emulatedVersion = browser.emulatedVersion,
        platform = browser.platform,
        platformVersion = browser.platformVersion;


    if (name !== 'ie') return next();

    if (version >= 10) {
      _config.log.debug('supported IE version => Actual[' + version + '] Emulated[' + emulatedVersion + ']');
      return next();
    }
    _config.log.debug('unsupported IE version => Actual[' + version + '] Emulated[' + emulatedVersion + ']');
    res.send(getHTML(browser));
  });
  return router;
}