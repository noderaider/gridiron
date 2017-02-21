'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

var _config = require('../../../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cookieNames = _config.client.cookieNames;

exports.default = function (_ref) {
  var url = _ref.url;

  /** UNCOMMENT THIS OUT FOR DARK THEME */
  /*
  if(IS_DEV && cookieNames.theme) {
    let cookieTheme = cookie.load(cookieNames.theme)
    if(cookieTheme) return require('./theme').default(cookieTheme)
  }
  */
  switch (url) {
    case '/management/quicksaletouchscreen.asp':
    case '/management/tendertouchscreen.asp':
    case '/management/eventselectiontouchscreen.asp':
    case '/management/actselectiontouchscreen.asp':
      return require('./touchscreen').default;
  }
};