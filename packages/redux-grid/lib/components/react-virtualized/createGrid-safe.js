'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = createGrid;

var _createGrid = require('../createGrid');

var _createExpander = require('../createExpander');

var _createExpander2 = _interopRequireDefault(_createExpander);

var _createExpandableCellRangeRenderer = require('./internal/createExpandableCellRangeRenderer');

var _createExpandableCellRangeRenderer2 = _interopRequireDefault(_createExpandableCellRangeRenderer);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();
var IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';

function createGrid(_ref) {
  var getState = _ref.getState;
  var React = _ref.React;
  var connect = _ref.connect;
  var ReactVirtualized = _ref.ReactVirtualized;
  var Immutable = _ref.Immutable;
  var ContentBox = _ref.ContentBox;

  should.exist(React);
  should.exist(connect);
  should.exist(ReactVirtualized);
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;
  var AutoSizer = ReactVirtualized.AutoSizer;
  var FlexTable = ReactVirtualized.FlexTable;
  var FlexColumn = ReactVirtualized.FlexColumn;
  var SortDirection = ReactVirtualized.SortDirection;
  var SortIndicator = ReactVirtualized.SortIndicator;
  var Grid = ReactVirtualized.Grid;

  var Expander = (0, _createExpander2.default)({ React: React });

  var ReduxGrid = function (_Component) {
    _inherits(ReduxGrid, _Component);

    function ReduxGrid(props) {
      _classCallCheck(this, ReduxGrid);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReduxGrid).call(this, props));

      _this.state = {
        disableHeader: false,
        headerHeight: 30,
        height: 600,
        hideIndexRow: false,
        overscanRowCount: 10,
        rowHeight: 40,
        rowCount: 1000,
        scrollToIndex: undefined,
        sortBy: 'index',
        sortDirection: SortDirection.ASC,
        useDynamicRowHeight: false
      };
      return _this;
    }

    _createClass(ReduxGrid, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var state = _props.state;
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var maxHeight = _props.maxHeight;
        var styles = _props.styles;
        var expandRowManager = _props.expandRowManager;
        var _state = this.state;
        var disableHeader = _state.disableHeader;
        var headerHeight = _state.headerHeight;
        var height = _state.height;
        var hideIndexRow = _state.hideIndexRow;
        var overscanRowCount = _state.overscanRowCount;
        var rowHeight
        //, rowCount
        = _state.rowHeight;
        var scrollToIndex = _state.scrollToIndex;
        var sortBy = _state.sortBy;
        var sortDirection = _state.sortDirection;
        var useDynamicRowHeight = _state.useDynamicRowHeight;


        should.exist(mapCols);
        should.exist(mapRows);
        mapCols.should.be.a('function');
        mapRows.should.be.a('function');
        var cols = mapCols(state);
        var rows = mapRows(state);
        should.exist(cols);
        should.exist(rows);
        cols.should.be.an('object');
        rows.should.be.instanceof(Array);
        var colKeys = Object.keys(cols);
        var mapRow = function mapRow() {
          var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var index = _ref2.index;
          var _ref2$rows = _ref2.rows;
          var rows = _ref2$rows === undefined ? mapRows(state) : _ref2$rows;
          return rows.size ? rows.get(index) : rows[index];
        };
        var getRowCount = function getRowCount() {
          var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var _ref3$rows = _ref3.rows;
          var rows = _ref3$rows === undefined ? mapRows(state) : _ref3$rows;
          return rows.size || rows.length;
        };

        return React.createElement(
          ContentBox,
          null,
          React.createElement(
            'div',
            null,
            React.createElement(
              AutoSizer,
              { disableHeight: true },
              function (_ref4) {
                var width = _ref4.width;
                return React.createElement(Grid, {
                  className: styles.BodyGrid,
                  width: width,
                  height: height,
                  columnWidth: function columnWidth(_ref5) {
                    var index = _ref5.index;
                    return width / colKeys.length;
                  },
                  rowHeight: function rowHeight(_ref6) {
                    var index = _ref6.index;
                    return index === 0 ? 50 : 19;
                  },
                  columnCount: colKeys.length,
                  rowCount: getRowCount({ rows: rows }),

                  cellRangeRenderer: function cellRangeRenderer() {
                    var _ref7 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                    var cellCache = _ref7.cellCache;
                    var cellRenderer = _ref7.cellRenderer;
                    var columnSizeAndPositionManager = _ref7.columnSizeAndPositionManager;
                    var columnStartIndex = _ref7.columnStartIndex;
                    var columnStopIndex = _ref7.columnStopIndex;
                    var horizontalOffsetAdjustment = _ref7.horizontalOffsetAdjustment;
                    var isScrolling = _ref7.isScrolling;
                    var rowSizeAndPositionManager = _ref7.rowSizeAndPositionManager;
                    var rowStartIndex = _ref7.rowStartIndex;
                    var rowStopIndex = _ref7.rowStopIndex;
                    var scrollLeft = _ref7.scrollLeft;
                    var scrollTop = _ref7.scrollTop;
                    var verticalOffsetAdjustment = _ref7.verticalOffsetAdjustment;

                    var expandedIndices = expandRowManager.getExpandedIndices();
                    var renderedRows = [];

                    var _loop = function _loop(rowIndex) {
                      var renderedCells = [];
                      var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                      var isExpandable = expandRowManager.isExpandable(rowIndex);
                      var isExpanded = expandedIndices.includes(rowIndex);

                      var expanderOffset = 0;

                      /** STATIC HEIGHT ELEMENT */
                      if (!isExpandable) {
                        var expanderKey = rowIndex + '-noexpander';
                        renderedCells.push(React.createElement('div', { key: expanderKey }));
                      } else {
                        var _expanderKey = rowIndex + '-expander';
                        expanderOffset = expandRowManager.getExpanderWidth(rowIndex);
                        var expander = React.createElement(
                          'div',
                          {
                            key: _expanderKey,
                            style: { height: rowDatum.size,
                              left: horizontalOffsetAdjustment,
                              width: expanderOffset
                            },
                            className: expandRowManager.getExpanderClassName(rowIndex)
                          },
                          React.createElement(Expander, { expanded: isExpanded, handleExpand: function handleExpand() {
                              return expandRowManager.onToggleExpand(rowIndex);
                            } })
                        );
                        renderedCells.push(expander);
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

                        /** STATIC HEIGHT ELEMENT */
                        var child = React.createElement(
                          'div',
                          {
                            key: key,
                            className: 'Grid__cell',
                            style: { height: rowDatum.size,
                              left: isExpandable && columnIndex === 0 ? columnDatum.offset + horizontalOffsetAdjustment + expanderOffset : columnDatum.offset + horizontalOffsetAdjustment,
                              width: isExpandable && columnIndex === 0 ? columnDatum.size - expanderOffset : columnDatum.size
                            }
                          },
                          renderedCell
                        );

                        renderedCells.push(child);
                      }

                      var rowStyle = { height: rowDatum.size
                        //, clear: 'both'
                      };

                      renderedRows.push(React.createElement(
                        'div',
                        { key: rowIndex + '-row', id: rowIndex + '-row', className: expandRowManager.rowStyle, style: rowStyle },
                        renderedCells
                      ));

                      if (isExpanded) {
                        var _key = rowIndex + '-expanded';
                        var expanded = cloneElement(expandRowManager.getContent(rowIndex, state), { key: _key, id: _key, className: 'drill' });
                        renderedRows.push(expanded);
                      }
                    };

                    for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                      _loop(rowIndex);
                    }
                    return renderedRows;
                  },

                  cellRenderer: function cellRenderer(_ref8) {
                    var columnIndex = _ref8.columnIndex;
                    var rowIndex = _ref8.rowIndex;
                    var isScrolling = _ref8.isScrolling;

                    if (rowIndex === 0) {
                      return React.createElement(
                        'div',
                        { className: styles.headerCell },
                        cols[colKeys[columnIndex]]
                      );
                    }
                    return React.createElement(
                      'div',
                      { className: rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow },
                      rows[rowIndex][columnIndex]
                    );
                  }
                });
              }
            )
          )
        );
      }
    }]);

    return ReduxGrid;
  }(Component);

  ReduxGrid.propTypes = (0, _createGrid.createPropTypes)(React);
  ReduxGrid.defaultProps = { maxHeight: 800,
    styles: {}
  };

  return (0, _createGrid.createConnect)({ connect: connect, getState: getState })(ReduxGrid);
}