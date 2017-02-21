'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeForUrl = exports.getTheme = exports.schemeNames = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _config = require('../../../config');

var _base = require('base16');

var _overrides = require('./overrides');

var _overrides2 = _interopRequireDefault(_overrides);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalizeScheme = function normalizeScheme(scheme) {
  return { scheme: scheme.scheme,
    base03: scheme.base00,
    base02: scheme.base01,
    base01: scheme.base02,
    base00: scheme.base03,
    base0: scheme.base04,
    base1: scheme.base05,
    base2: scheme.base06,
    base3: scheme.base07,
    red: scheme.base08,
    orange: scheme.base09,
    yellow: scheme.base0A,
    green: scheme.base0B,
    cyan: scheme.base0C,
    blue: scheme.base0D,
    magenta: scheme.base0E,
    violet: scheme.base0F
  };
};

function getOthers() {
  return { flat: _base.flat,
    grayscale: _base.grayscale,
    railscasts: _base.railscasts,
    solarized: _base.solarized,
    monokai: _base.monokai
  };
}

function getScheme(name) {
  return normalizeScheme(getOthers()[name]);
}

var appClass = (0, _classnames2.default)('body-content', 'container');

var invertPalette = function invertPalette(palette) {
  return _extends({}, palette, { base03: palette.base3,
    base02: palette.base2,
    base01: palette.base1,
    base00: palette.base0,
    base0: palette.base00,
    base1: palette.base01,
    base2: palette.base02,
    base3: palette.base03
  });
};

var buildTheme = function buildTheme(name, palette) {
  var inverted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var p = inverted ? invertPalette(palette) : palette;

  var color = { primary: p['base3'],
    secondary: p['base00'],
    tertiary: p['base1'],
    accent: p['blue'],
    emphasized: p['base01']
  };

  var brand = { default: p['base2'],
    primary: p['yellow'],
    info: p['cyan'],
    success: p['green'],
    warning: p['orange'],
    danger: p['red']
  };

  return { name: name,
    palette: p,
    color: color,
    brand: brand
    /** body styles are set directly on the html (should not be react shorthands) */
    , style: { app: { width: '80%',
        height: '100%',
        color: color.secondary,
        marginLeft: '10%'
      },
      body: { /*backgroundColor: p['base3']
              ,*/backgroundColor: 'rgb(100, 100, 100)',
        padding: 0,
        margin: 0
      },
      content: { width: '100%',
        backgroundColor: p['base2'],
        float: 'left',
        marginTop: 10,
        marginBottom: 30,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 5,
        border: '1px solid ' + p['base0']
      },
      header: { wrapper: { display: 'flex',
          flexDirection: 'row',
          flex: '1 0 300px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10
        },
        hamburger: { backgroundColor: '#fff' //p['base01']
          , borderRadius: 4,
          border: '2px dashed ' + color.accent //p['base2']}`
          , height: 32,
          width: 32,
          cursor: 'pointer'
        },
        title: { fontSize: '1.8em',
          fontFamily: 'Lato',
          fontWeight: 'bold',
          marginLeft: 20,
          marginRight: 'auto'
        },
        subtitle: { fontSize: 9, marginLeft: 10, marginTop: 0, paddingTop: 0 },
        anchor: { color: color.accent, textDecoration: 'none' },
        banner: { marginRight: 20, marginTop: 3 },
        settings: {},
        settingsImage: { height: 45, textShadow: '-1px -1px 0 #000' }
      },
      footer: { wrapper: { display: 'flex',
          flexDirection: 'row',
          flex: '0 1 10px',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'fixed',
          bottom: 5,
          width: '80%'
        },
        left: { display: 'flex',
          flexDirection: 'column'
        },
        right: { display: 'flex',
          flexDirection: 'column'
        },
        row: { display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'nowrap'
        },
        anchor: { color: color.accent, textDecoration: 'none' }
      },
      panel: { backgroundColor: brand.default,
        borderColor: color.tertiary,
        borderStyle: 'solid',
        borderWidth: 1,
        margin: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        fontFamily: 'Lato',
        fontWeight: 400
      },
      bold: { fontWeight: 700 },
      link: { color: p['blue'],
        cursor: 'pointer'
      },
      label: { color: color.secondary,
        backgroundColor: brand.default,
        borderColor: color.secondary,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 2,
        margin: 2,
        padding: 2,
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: ['Lato'],
        whiteSpace: 'nowrap',
        display: 'inline',
        cursor: 'default'
      },
      ul: { marginLeft: '15%',
        marginRight: '15%',
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: 2
      },
      paragraph: {
        //, margin: 15
        padding: 10
      },
      form: {
        //, margin: 15
        padding: 10
      },
      input: { color: p['base03'],
        backgroundColor: p['base3'],
        fontSize: '1.1em',
        padding: 10,
        minWidth: 300,
        borderColor: color.tertiary,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid'
      }
    }
  };
};

var schemeNames = exports.schemeNames = ['flat', 'grayscale', 'railscasts', 'solarized', 'monokai'];

var getTheme = exports.getTheme = function getTheme() {
  var themeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _config.defaultTheme;

  if (!themeName.includes('-')) throw new Error('Incorrect format provided => \'' + themeName + '\', must be of format \'scheme-(light|dark)\'');

  var _themeName$split = themeName.split('-'),
      _themeName$split2 = _slicedToArray(_themeName$split, 2),
      schemeName = _themeName$split2[0],
      lightOrDark = _themeName$split2[1];

  var inverted = lightOrDark === 'dark';

  var palette = getScheme(schemeName);
  if (!palette) throw new Error('No theme exists for scheme \'' + schemeName + '\', options are [' + schemeNames.join(',') + ']');
  return buildTheme(schemeName + '-' + (inverted ? 'dark' : 'light'), palette, inverted);
};

var getThemeForUrl = exports.getThemeForUrl = function getThemeForUrl() {
  var themeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _config.defaultTheme;
  var url = arguments[1];

  var theme = getTheme(themeName);
  var override = (0, _overrides2.default)({ url: url });
  if (override) return _extends({}, theme, override(theme), { isFallback: true });
  return theme;
};