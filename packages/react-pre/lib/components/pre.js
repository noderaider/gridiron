'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = pre;

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

/**
 * Factory that creates <Pre /> elements for code blocks
 */
function pre(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  var immutableListKeys = ['_root', '__ownerID', '__hash', '__altered', '_origin', '_capacity', '_level', '_tail'];
  var immutableMapKeys = ['_root', '__ownerID', '__hash', '__altered'];

  var preStyle = { fontFamily: 'monospace',
    fontSize: '0.8em',
    lineHeight: 1.55,
    display: 'flex',
    padding: 2,
    border: '2px solid rgba(100, 100, 255, 0.1)',
    borderRadius: 2,
    margin: 0
  };
  var labelStyle = { borderRadius: 2,
    color: 'rgb(255, 255, 255)',
    padding: '1px 2px',
    fontSize: '0.9em'
  };
  var numberStyle = _extends({}, labelStyle, { color: 'rgb(0, 148, 177)',
    border: '1px dotted rgba(0, 148, 177, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 600
  });
  var stringStyle = _extends({}, labelStyle, { backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'rgb(190, 219, 57)'
  });
  var functionStyle = _extends({}, labelStyle, { backgroundColor: 'rgba(200, 50, 50, 0.2)',
    color: '#000'
  });
  var boolStyle = _extends({}, labelStyle, { backgroundColor: 'rgba(226, 255, 92, 0.5)',
    color: 'rgb(159, 57, 219)',
    border: '1px dotted rgba(121, 143, 23, 0.6)',
    fontWeight: 'bold'
  });
  var symbolStyle = _extends({}, labelStyle, { backgroundColor: 'rgb(200, 100, 110)'
  });
  var nullStyle = _extends({}, labelStyle, { backgroundColor: 'rgba(90, 111, 255, 1)',
    color: 'rgb(255, 225, 26)',
    opacity: 0.6
  });

  var undefinedStyle = _extends({}, labelStyle, { backgroundColor: 'rgba(134, 153, 77, 0.8)',
    color: 'rgb(255, 225, 26)'
  });

  var immutableCommon = _extends({}, labelStyle, { fontSize: '0.95em',
    position: 'relative',
    minHeight: 22,
    color: 'rgb(0, 0, 0)'
  });
  var immutableListStyle = _extends({}, immutableCommon, { backgroundColor: 'rgba(31, 138, 112, 0.3)',
    border: '2px dashed rgba(31, 138, 112, 0.6)',
    marginBottom: 0
  });
  var immutableMapStyle = _extends({}, immutableCommon, { backgroundColor: 'rgba(0, 67, 88, 0.3)',
    border: '2px dashed rgba(0, 67, 88, 0.6)'
  });
  var immutableWatermark = { transform: 'rotate(0.25turn)',
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    top: 6,
    right: 0,
    pointerEvents: 'none'
  };
  var floats = { float: 'left', clear: 'left' };
  var inlineTable = { display: 'table',
    width: '80%'
  };
  return function (_Component) {
    _inherits(Pre, _Component);

    function Pre() {
      var _Object$getPrototypeO;

      var _temp, _this, _ret;

      _classCallCheck(this, Pre);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Pre)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.parseJS = function (obj) {
        var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var _ref$inArray = _ref.inArray;
        var inArray = _ref$inArray === undefined ? false : _ref$inArray;
        var _ref$isImmutableMap = _ref.isImmutableMap;
        var isImmutableMap = _ref$isImmutableMap === undefined ? false : _ref$isImmutableMap;
        var _ref$isImmutableList = _ref.isImmutableList;
        var isImmutableList = _ref$isImmutableList === undefined ? false : _ref$isImmutableList;

        var _ret2 = function () {

          switch (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) {
            case 'object':
              if (obj === null) return {
                  v: React.createElement(
                    'span',
                    { style: nullStyle },
                    'null'
                  )
                };

              if (Array.isArray(obj)) {
                return {
                  v: _this.parseArray(obj, level, { inArray: inArray })
                };
              }

              var objKeys = Object.keys(obj);
              var objStyle = { marginLeft: level * 1.1 + 'em',
                marginRight: level * 1.1 + 'em',
                marginTop: inArray ? '-1.4em' : 0,
                marginBottom: inArray ? '-1.4em' : 0,
                width: '100%'
              };
              var inlineObjStyle = _extends({}, objStyle, { marginLeft: 0,
                color: 'rgb(200, 50, 50)'
              });

              if (immutableListKeys.every(function (x) {
                return objKeys.includes(x);
              })) {
                var _ret3 = function () {
                  var visibleKeys = objKeys.filter(function (x) {
                    return !immutableListKeys.includes(x);
                  });
                  var size = obj.size;
                  var _root = obj._root;

                  return {
                    v: {
                      v: React.createElement(
                        'div',
                        { className: 'js-immutable-list', style: _extends({}, objStyle, immutableListStyle) },
                        React.createElement(
                          'span',
                          { key: -1, className: 'js-immutable-watermark', style: immutableWatermark },
                          'List'
                        ),
                        visibleKeys.map(function (x, i) {
                          return React.createElement(
                            'div',
                            { key: i, style: inlineTable },
                            React.createElement(
                              'div',
                              { style: floats },
                              i > 0 ? ', ' : '{ '
                            ),
                            x,
                            ': ',
                            _this.parseJS(obj[x], level + 1, { isImmutableList: true }),
                            '\n',
                            size > 0 && i === visibleKeys.length - 1 ? React.createElement(
                              'div',
                              null,
                              ', entries: ',
                              _this.parseJS(obj._root.entries, level, { isImmutableList: true })
                            ) : null,
                            i === visibleKeys.length - 1 ? React.createElement(
                              'div',
                              { style: floats },
                              '}'
                            ) : ''
                          );
                        })
                      )
                    }
                  };
                }();

                if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
              }

              if (immutableMapKeys.every(function (x) {
                return objKeys.includes(x);
              })) {
                var _ret4 = function () {
                  var visibleKeys = objKeys.filter(function (x) {
                    return !immutableMapKeys.includes(x);
                  });
                  var size = obj.size;
                  var _root = obj._root;

                  return {
                    v: {
                      v: React.createElement(
                        'div',
                        { className: 'js-immutable-map', style: _extends({}, objStyle, immutableMapStyle) },
                        React.createElement(
                          'span',
                          { key: -1, className: 'js-immutable-watermark', style: immutableWatermark },
                          'Map'
                        ),
                        visibleKeys.map(function (x, i) {
                          return React.createElement(
                            'div',
                            { key: i, style: inlineTable },
                            React.createElement(
                              'div',
                              { style: floats },
                              i > 0 ? ', ' : '{ '
                            ),
                            x,
                            ': ',
                            _this.parseJS(obj[x], level + 1, { isImmutableMap: true }),
                            '\n',
                            size > 0 && i === visibleKeys.length - 1 ? React.createElement(
                              'div',
                              { style: floats },
                              ', entries: ',
                              _this.parseJS(obj._root.entries, level, { isImmutableMap: true })
                            ) : null,
                            i === visibleKeys.length - 1 ? React.createElement(
                              'div',
                              { style: floats },
                              '}'
                            ) : ''
                          );
                        })
                      )
                    }
                  };
                }();

                if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
              }

              return {
                v: objKeys.length === 0 ? React.createElement(
                  'span',
                  { className: 'js-object', style: inlineObjStyle },
                  '{}'
                ) : React.createElement(
                  'div',
                  { className: 'js-object', style: objStyle },
                  objKeys.map(function (x, i) {
                    return React.createElement(
                      'div',
                      { key: i, style: inlineTable },
                      React.createElement(
                        'div',
                        { style: floats },
                        i > 0 ? ', ' : '{ '
                      ),
                      x,
                      ': ',
                      _this.parseJS(obj[x], level + 1),
                      '\n',
                      i === objKeys.length - 1 ? React.createElement(
                        'div',
                        { style: floats },
                        '}'
                      ) : ''
                    );
                  })
                )
              };

            case 'number':
              return {
                v: React.createElement(
                  'span',
                  { style: numberStyle },
                  obj.toLocaleString()
                )
              };
            case 'string':
              return {
                v: React.createElement(
                  'span',
                  { style: stringStyle },
                  '\'',
                  obj.toString(),
                  '\''
                )
              };
            case 'boolean':
              return {
                v: React.createElement(
                  'span',
                  { style: boolStyle },
                  obj.toString()
                )
              };
            case 'symbol':
              return {
                v: React.createElement(
                  'span',
                  { style: symbolStyle },
                  obj.toString()
                )
              };
            case 'function':
              return {
                v: React.createElement(
                  'div',
                  { style: functionStyle },
                  obj.toString().replace(/[ \n]+/g, ' ').replace(/function \(\) \{ return (.*); \}/, '() => $1')
                )
              };
            case 'undefined':
              return {
                v: React.createElement(
                  'span',
                  { style: undefinedStyle },
                  'undefined'
                )
              };
          }
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      }, _this.parseArray = function (arr, level) {
        var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var _ref2$inArray = _ref2.inArray;
        var inArray = _ref2$inArray === undefined ? false : _ref2$inArray;

        var arrayStyle = { marginLeft: level * 1.1 + 'em',
          marginTop: inArray ? '-1.4em' : 0,
          marginBottom: inArray ? '-1.4em' : 0
        };
        var inlineArrayStyle = _extends({}, arrayStyle, { marginLeft: 0,
          color: 'rgb(200, 50, 50)'
        });
        return arr.length === 0 ? React.createElement(
          'span',
          { className: 'js-array', style: inlineArrayStyle },
          '[]'
        ) : React.createElement(
          'div',
          { className: 'js-array', style: arrayStyle },
          arr.map(function (x, i) {
            return React.createElement(
              'span',
              { key: i },
              i > 0 ? ', ' : '[ ',
              _this.parseJS(x, level + 1, { inArray: true }),
              '\n',
              i === arr.length - 1 ? ']' : ''
            );
          })
        );
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Pre, [{
      key: 'render',
      value: function render() {
        var parsed = this.parseJS(this.props.children);
        return React.createElement(
          'pre',
          { style: preStyle },
          parsed
        );
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
      }
    }]);

    return Pre;
  }(Component);
}