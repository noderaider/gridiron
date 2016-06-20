'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createDrillGrid;

var _createGrid = require('./createGrid');

var _createGrid2 = _interopRequireDefault(_createGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

function createDrillGrid(_ref) {
  var React = _ref.React;
  var Immutable = _ref.Immutable;


  var rows = [['jim', 26, 'being boring', 'male'], ['tony', 37, 'skydiving', 'male'], ['lisa', 40, 'sleeping', 'female'], ['dan', 20, 'jumping', 'male'], ['sarah', 15, 'eating', 'female'], ['michael', 25, 'nothing', 'unsure'], ['michelle', 35, 'idk', 'female']];

  var list = Immutable.List(rows);
  var getState = function getState() {
    return { rows: rows, list: list };
  };

  var Grid = (0, _createGrid2.default)({ getState: getState, React: React, ReactDOM: ReactDOM, ReactCSSTransitionGroup: ReactCSSTransitionGroup, ReactVirtualized: ReactVirtualized, connect: connect, Immutable: Immutable, ContentBox: ContentBox });

  return function (_Component) {
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
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var mapDrill = _props.mapDrill;

        var rest = _objectWithoutProperties(_props, ['mapCols', 'mapRows', 'mapDrill']);

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

        return React.createElement(Grid, {
          styles: styles,
          mapCols: mapCols,
          mapRows: mapRows,
          expandedRows: this.state.expandedRows,
          expandRowManager: expandRowManager
        });
      }
    }]);

    return DrillGrid;
  }(Component);
}