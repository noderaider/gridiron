'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = drillGrid;

var _reduxGridCore = require('redux-grid-core');

var _coreGrid = require('./coreGrid');

var _coreGrid2 = _interopRequireDefault(_coreGrid);

var _expander = require('../expander');

var _expander2 = _interopRequireDefault(_expander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

function drillGrid(dependencies) {
  var _class, _temp;

  var React = dependencies.React;
  var Immutable = dependencies.Immutable;
  var connect = dependencies.connect;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  var rows = [['jim', 26, 'being boring', 'male'], ['tony', 37, 'skydiving', 'male'], ['lisa', 40, 'sleeping', 'female'], ['dan', 20, 'jumping', 'male'], ['sarah', 15, 'eating', 'female'], ['michael', 25, 'nothing', 'unsure'], ['michelle', 35, 'idk', 'female']];

  var list = Immutable.List(rows);
  var getState = function getState() {
    return { rows: rows, list: list };
  };
  var CoreGrid = (0, _coreGrid2.default)(dependencies);
  var Expander = (0, _expander2.default)(dependencies);

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
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var mapIds = _props.mapIds;
        var mapDrill = _props.mapDrill;

        var rest = _objectWithoutProperties(_props, ['styles', 'mapCols', 'mapRows', 'mapIds', 'mapDrill']);

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
          return [{ id: 'expander', render: function render() {
              return React.createElement(Expander, { visible: false });
            }, width: 25, className: styles.minimal }].concat(_toConsumableArray(mapCols(state)));
        };
        var _mapRows = function _mapRows(state) {
          var coreRows = mapRows(state);
          return coreRows.reduce(function (rows, x, i) {
            if (_this2.state.drilledRows.includes(i)) return [].concat(_toConsumableArray(rows), [[React.createElement(Expander, { expanded: true, handleExpand: function handleExpand() {
                return onToggleExpand(i);
              } })].concat(_toConsumableArray(x))
            /** TODO: FINISH ID MAPPING FUNCTIONALITY */
            , { span: true, render: function render() {
                return mapDrill(state, i);
              } /*, mapIds(state, i))*/ }]);
            return [].concat(_toConsumableArray(rows), [[React.createElement(Expander, { expanded: false, handleExpand: function handleExpand() {
                return onToggleExpand(i);
              } })].concat(_toConsumableArray(x))]);
          }, []);
        };

        return React.createElement(CoreGrid, _extends({}, rest, {
          styles: styles,
          mapCols: _mapCols,
          mapRows: _mapRows
        }));
      }
    }]);

    return DrillGrid;
  }(Component), _class.propTypes = _reduxGridCore.DrillGrid.PropTypes(React), _class.defaultProps = _reduxGridCore.DrillGrid.DefaultProps(React), _temp;
}