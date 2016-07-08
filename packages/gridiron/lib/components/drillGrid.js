'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = drillGrid;

var _gridironCore = require('gridiron-core');

var _coreGrid = require('./coreGrid');

var _coreGrid2 = _interopRequireDefault(_coreGrid);

var _expander = require('./expander');

var _expander2 = _interopRequireDefault(_expander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

function drillGrid(deps) {
  var _class, _temp;

  var React = deps.React;
  var Immutable = deps.Immutable;
  var connect = deps.connect;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  var CoreGrid = (0, _coreGrid2.default)(deps);

  var _factories = (0, _gridironCore.factories)(deps);

  var header = _factories.header;

  var Expander = (0, _expander2.default)(deps);

  return _temp = _class = function (_Component) {
    _inherits(DrillGrid, _Component);

    function DrillGrid(props) {
      _classCallCheck(this, DrillGrid);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DrillGrid).call(this, props));

      _this.state = { drilledRows: [] };
      return _this;
    }

    _createClass(DrillGrid, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var styles = _props.styles;
        var theme = _props.theme;
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var mapDrill = _props.mapDrill;

        var rest = _objectWithoutProperties(_props, ['styles', 'theme', 'mapCols', 'mapRows', 'mapDrill']);

        var drilledRows = this.state.drilledRows;

        var onToggleExpand = function onToggleExpand(index) {
          var newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(function (x) {
            return x !== index;
          }) : [].concat(_toConsumableArray(drilledRows), [index]);
          newDrilledRows.sort();
          _this2.setState({ drilledRows: newDrilledRows });
        };

        var spannedRows = [];
        var _mapCols = function _mapCols(state) {
          var _header = header();

          var Header = _header.Header;
          var createSub = _header.createSub;

          return [{ id: 'expander',
            header: function header() {
              return React.createElement(
                Header,
                { theme: theme },
                React.createElement(Expander, { visible: false })
              );
            },
            footer: function footer() {
              return React.createElement(Expander, { visible: false });
            },
            width: 35,
            className: styles.minimal
          }].concat(_toConsumableArray(mapCols(state)));
        };
        var _mapRows = function _mapRows(state) {
          var coreRows = mapRows(state);
          return coreRows.reduce(function (rows, x, i) {
            if (_this2.state.drilledRows.includes(i)) {
              return [].concat(_toConsumableArray(rows), [{ id: x.id,
                render: function render() {
                  return [React.createElement(Expander, { expanded: true, handleExpand: function handleExpand() {
                      return onToggleExpand(i);
                    }, theme: theme })].concat(_toConsumableArray(x.render()));
                }
              }, { id: x.id + '_span',
                span: true,
                render: function render() {
                  return mapDrill(state, x.id);
                }
              }]);
            }
            return [].concat(_toConsumableArray(rows), [{ id: x.id,
              render: function render() {
                return [React.createElement(Expander, { expanded: false, handleExpand: function handleExpand() {
                    return onToggleExpand(i);
                  }, theme: theme })].concat(_toConsumableArray(x.render()));
              }
            }]);
          }, []);
        };

        return React.createElement(CoreGrid, _extends({}, rest, {
          styles: styles,
          theme: theme,
          mapCols: _mapCols,
          mapRows: _mapRows
        }));
      }
    }]);

    return DrillGrid;
  }(Component), _class.propTypes = _gridironCore.DrillGrid.PropTypes(React), _class.defaultProps = _gridironCore.DrillGrid.DefaultProps(React), _temp;
}