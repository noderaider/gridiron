'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CellSizeAndPositionManager = require('./utils/CellSizeAndPositionManager');

var _CellSizeAndPositionManager2 = _interopRequireDefault(_CellSizeAndPositionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */
function createExpandableCellRangeRenderer(_ref) {
  var React = _ref.React;
  var _onResize = _ref.onResize;
  var AutoSizer = _ref.AutoSizer;
  var Expander = _ref.Expander;
  var expandRowManager = _ref.expandRowManager;
  var state = _ref.state;
  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var ExpandedArea = function (_Component) {
    _inherits(ExpandedArea, _Component);

    function ExpandedArea() {
      _classCallCheck(this, ExpandedArea);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ExpandedArea).apply(this, arguments));
    }

    _createClass(ExpandedArea, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        console.warn('EXPANDED CLIENT HEIGHT', this.container.childNodes[0].clientHeight);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return React.createElement('div', _extends({
          ref: function ref(x) {
            return _this2.container = x;
          }
        }, this.props));
      }
    }]);

    return ExpandedArea;
  }(Component);

  return function () {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var cellCache = _ref2.cellCache;
    var cellRenderer = _ref2.cellRenderer;
    var columnSizeAndPositionManager = _ref2.columnSizeAndPositionManager;
    var columnStartIndex = _ref2.columnStartIndex;
    var columnStopIndex = _ref2.columnStopIndex;
    var horizontalOffsetAdjustment = _ref2.horizontalOffsetAdjustment;
    var isScrolling = _ref2.isScrolling;
    var rowSizeAndPositionManager = _ref2.rowSizeAndPositionManager;
    var rowStartIndex = _ref2.rowStartIndex;
    var rowStopIndex = _ref2.rowStopIndex;
    var scrollLeft = _ref2.scrollLeft;
    var scrollTop = _ref2.scrollTop;
    var verticalOffsetAdjustment = _ref2.verticalOffsetAdjustment;


    var expandedOffset = 0;

    var expandedIndices = expandRowManager.getExpandedIndices();

    var renderedCells = [];

    var _loop = function _loop(rowIndex) {
      var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

      var isExpandable = expandRowManager.isExpandable(rowIndex);
      var isExpanded = expandedIndices.includes(rowIndex);

      var expanderOffset = 0;
      if (isExpandable) {
        var expanderKey = rowIndex + '-expander';
        expanderOffset = expandRowManager.getExpanderWidth(rowIndex);
        var expander = React.createElement(
          'div',
          {
            key: expanderKey,
            style: { height: rowDatum.size,
              left: horizontalOffsetAdjustment,
              top: rowDatum.offset + verticalOffsetAdjustment + expandedOffset,
              width: expanderOffset
            },
            className: expandRowManager.getExpanderClassName(rowIndex)
          },
          React.createElement(Expander, { expanded: isExpanded, handleExpand: function handleExpand() {
              return expandRowManager.onToggleExpand(rowIndex);
            } })
        );
        renderedCells.push(expander);
      } else {
        var _expanderKey = rowIndex + '-noexpander';
        renderedCells.push(React.createElement('div', { key: _expanderKey }));
      }

      for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

        var key = rowIndex + '-' + columnIndex;
        var renderedCell = void 0;

        // Avoid re-creating cells while scrolling.
        // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
        // If a scroll is in progress- cache and reuse cells.
        // This cache will be thrown away once scrolling completes.
        if (isScrolling) {
          if (!cellCache[key]) {
            cellCache[key] = cellRenderer({
              columnIndex: columnIndex,
              isScrolling: isScrolling,
              rowIndex: rowIndex
            });
          }
          renderedCell = cellCache[key];
          // If the user is no longer scrolling, don't cache cells.
          // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
        } else {
            renderedCell = cellRenderer({
              columnIndex: columnIndex,
              isScrolling: isScrolling,
              rowIndex: rowIndex
            });
          }

        if (renderedCell == null || renderedCell === false) continue;

        var style = { height: rowDatum.size,
          left: isExpandable && columnIndex === 0 ? columnDatum.offset + horizontalOffsetAdjustment + expanderOffset : columnDatum.offset + horizontalOffsetAdjustment,
          top: rowDatum.offset + verticalOffsetAdjustment + expandedOffset,
          width: isExpandable && columnIndex === 0 ? columnDatum.size - expanderOffset : columnDatum.size
        };
        var child = React.createElement(
          'div',
          {
            key: key,
            className: 'Grid__cell',
            style: style
          },
          renderedCell
        );

        renderedCells.push(child);
      }

      if (isExpanded) {
        var _key = rowIndex + '-expanded';
        var _style = { /*height: expandRowManager.getHeight(rowIndex)
                       ,*/left: horizontalOffsetAdjustment,
          top: rowDatum.offset + rowDatum.size + verticalOffsetAdjustment + expandedOffset,
          width: '100%'
        };
        var content = expandRowManager.getContent(rowIndex, state);
        var expanded = React.createElement(
          AutoSizer,
          { key: _key, onResize: function onResize(dimensions, eventArgs) {
              console.warn('attempting to resize gridSizer to', dimensions);
              _onResize(dimensions);
            }, traverseSource: function traverseSource(x) {
              return x.childNodes[0];
            }, direction: 'up' },
          React.createElement(
            ExpandedArea,
            {
              style: _style,
              className: expandRowManager.getClassName(rowIndex)
            },
            expandRowManager.getContent(rowIndex, state)
          )
        );
        renderedCells.push(expanded);
        //expandedOffset += height
      }
    };

    for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      _loop(rowIndex);
    }

    return renderedCells;
  };
}
exports.default = createExpandableCellRangeRenderer;