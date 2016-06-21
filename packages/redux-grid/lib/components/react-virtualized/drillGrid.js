'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = drillGrid;

var _reduxGridCore = require('redux-grid-core');

var _coreGrid = require('./coreGrid');

var _coreGrid2 = _interopRequireDefault(_coreGrid);

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
        var mapDrill = _props.mapDrill;

        var rest = _objectWithoutProperties(_props, ['styles', 'mapCols', 'mapRows', 'mapDrill']);

        var drilledRows = this.state.drilledRows;

        var isExpanded = function isExpanded(index) {
          return drilledRows.includes(index);
        };

        var getExpandedIndices = function getExpandedIndices() {
          return _this2.state.drilledRows;
        };
        var isExpandable = function isExpandable(index) {
          return index > 0;
        };
        var getClassName = function getClassName(index) {
          return styles.expandedRow;
        };
        var getExpanderClassName = function getExpanderClassName(index) {
          return styles.expander;
        };
        var getExpanderWidth = function getExpanderWidth(index) {
          return 25;
        };
        var onToggleExpand = function onToggleExpand(index) {
          var newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(function (x) {
            return x !== index;
          }) : [].concat(_toConsumableArray(drilledRows), [index]);
          newDrilledRows.sort();
          _this2.setState({ drilledRows: newDrilledRows });
        };

        var expandRowManager = { getExpandedIndices: getExpandedIndices,
          isExpandable: isExpandable,
          getContent: mapDrill,
          getClassName: getClassName,
          getExpanderClassName: getExpanderClassName,
          getExpanderWidth: getExpanderWidth,
          onToggleExpand: onToggleExpand,
          rowStyle: styles.rowStyle,
          totalHeight: 0
        };

        return React.createElement(CoreGrid, {
          styles: styles,
          mapCols: mapCols,
          mapRows: mapRows,
          expandedRows: this.state.expandedRows,
          expandRowManager: expandRowManager
        });
      }
    }]);

    return DrillGrid;
  }(Component), _class.propTypes = _reduxGridCore.DrillGrid.PropTypes(React), _temp;
}