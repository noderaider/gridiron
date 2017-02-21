'use strict';

Object.defineProperty(exports, "__esModule", {
                                    value: true
});
exports.schemeNames = exports.getTheme = undefined;

var _theme = require('./theme');

Object.defineProperty(exports, 'getTheme', {
                                    enumerable: true,
                                    get: function get() {
                                                                        return _theme.getTheme;
                                    }
});
Object.defineProperty(exports, 'schemeNames', {
                                    enumerable: true,
                                    get: function get() {
                                                                        return _theme.schemeNames;
                                    }
});

var _react = require('react');

var paletteShape = _react.PropTypes.shape({ scheme: _react.PropTypes.string,
                                    base03: _react.PropTypes.string,
                                    base02: _react.PropTypes.string,
                                    base01: _react.PropTypes.string,
                                    base00: _react.PropTypes.string,
                                    base0: _react.PropTypes.string,
                                    base1: _react.PropTypes.string,
                                    base2: _react.PropTypes.string,
                                    base3: _react.PropTypes.string,
                                    yellow: _react.PropTypes.string,
                                    orange: _react.PropTypes.string,
                                    red: _react.PropTypes.string,
                                    magenta: _react.PropTypes.string,
                                    violet: _react.PropTypes.string,
                                    blue: _react.PropTypes.string,
                                    cyan: _react.PropTypes.string,
                                    green: _react.PropTypes.string
});

var colorShape = _react.PropTypes.shape({ primary: _react.PropTypes.string.isRequired,
                                    secondary: _react.PropTypes.string.isRequired,
                                    accent: _react.PropTypes.string.isRequired
});

var brandShape = _react.PropTypes.shape({ default: _react.PropTypes.string.isRequired,
                                    primary: _react.PropTypes.string.isRequired,
                                    info: _react.PropTypes.string.isRequired,
                                    success: _react.PropTypes.string.isRequired,
                                    warning: _react.PropTypes.string.isRequired,
                                    danger: _react.PropTypes.string.isRequired
});

var panelStyleShape = _react.PropTypes.shape({ backgroundColor: _react.PropTypes.string.isRequired,
                                    borderColor: _react.PropTypes.string.isRequired,
                                    borderStyle: _react.PropTypes.string.isRequired,
                                    borderWidth: _react.PropTypes.number.isRequired,
                                    margin: _react.PropTypes.number.isRequired,
                                    borderRadius: _react.PropTypes.number.isRequired,
                                    fontFamily: _react.PropTypes.string.isRequired,
                                    fontWeight: _react.PropTypes.number.isRequired
});

var boldShape = _react.PropTypes.shape({ fontWeight: _react.PropTypes.number.isRequired });

var inputShape = _react.PropTypes.shape({ color: _react.PropTypes.string.isRequired,
                                    backgroundColor: _react.PropTypes.string.isRequired,
                                    borderColor: _react.PropTypes.string.isRequired,
                                    borderWidth: _react.PropTypes.number.isRequired,
                                    borderStyle: _react.PropTypes.string.isRequired
});

var styleShape = _react.PropTypes.shape({ app: _react.PropTypes.object.isRequired,
                                    footer: _react.PropTypes.object.isRequired,
                                    panel: panelStyleShape,
                                    bold: boldShape,
                                    input: inputShape
});

var themeShape = _react.PropTypes.shape({ palette: paletteShape,
                                    color: colorShape,
                                    brand: brandShape,
                                    style: styleShape
});

var contextTypes = { theme: themeShape
};

exports.default = contextTypes;