'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getSheet(theme) {
  try {
    switch (theme) {
      case 'solarized-dark':
        return function () {
          return require('./css/solarized-dark.gcss');
        };
    }
  } catch (err) {
    console.error(err);
  }
}

exports.default = function (cookieTheme) {
  var sheet = getSheet(cookieTheme);
  return function (theme) {
    return { sheet: sheet };
  };
};