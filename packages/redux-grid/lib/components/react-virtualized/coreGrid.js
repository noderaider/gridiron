'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = coreGrid;

var _reduxGridCore = require('redux-grid-core');

var _solvent = require('solvent');

var _solvent2 = _interopRequireDefault(_solvent);

var _expander = require('../expander');

var _expander2 = _interopRequireDefault(_expander);

var _createExpandableCellRangeRenderer = require('./internal/createExpandableCellRangeRenderer');

var _createExpandableCellRangeRenderer2 = _interopRequireDefault(_createExpandableCellRangeRenderer);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();
var IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';

var resolver = (0, _solvent2.default)({ getState: 'function',
  React: 'object',
  connect: 'function',
  ReactVirtualized: 'object',
  Immutable: 'object',
  ContentBox: 'function'
});
function coreGrid(dependencies) {
  var _resolver = resolver(dependencies);

  var getState = _resolver.getState;
  var React = _resolver.React;
  var connect = _resolver.connect;
  var ReactVirtualized = _resolver.ReactVirtualized;
  var Immutable = _resolver.Immutable;
  var ContentBox = _resolver.ContentBox;

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

  var Expander = (0, _expander2.default)({ React: React });

  var CoreGrid = function (_Component) {
    _inherits(CoreGrid, _Component);

    function CoreGrid(props) {
      _classCallCheck(this, CoreGrid);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CoreGrid).call(this, props));

      _this.state = { disableHeader: false,
        headerHeight: 30
        //, height: 600
        , hideIndexRow: false,
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

    _createClass(CoreGrid, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var state = _props.state;
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var maxHeight = _props.maxHeight;
        var styles = _props.styles;
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
        var spannedRows = rows.reduce(function (spanned, x, i) {
          if (x.span === true) return [].concat(_toConsumableArray(spanned), [i]);
          return spanned;
        }, []);
        should.exist(cols);
        should.exist(rows);
        cols.should.be.instanceof(Array);
        rows.should.be.instanceof(Array);
        var colCount = cols.length;
        var mapRow = function mapRow() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var index = _ref.index;
          var _ref$rows = _ref.rows;
          var rows = _ref$rows === undefined ? mapRows(state) : _ref$rows;
          return rows.size ? rows.get(index) : rows[index];
        };
        var getRowCount = function getRowCount() {
          var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var _ref2$rows = _ref2.rows;
          var rows = _ref2$rows === undefined ? mapRows(state) : _ref2$rows;
          return rows.size || rows.length;
        };

        var rowPadding = 2;
        var cellPadding = 4;

        var resolveColWidth = function resolveColWidth(calculated) {
          var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          var minWidth = _ref3.minWidth;
          var maxWidth = _ref3.maxWidth;

          console.debug('RESOLVE COL WIDTH', calculated, minWidth, maxWidth);
          if (minWidth && calculated < minWidth) {
            console.debug('OVERRIDING CALCULATED WIDTH FOR MIN', calculated, minWidth);
            return minWidth;
          }
          if (maxWidth && calculated > maxWidth) {
            console.debug('OVERRIDING CALCULATED WIDTH FOR MAX', calculated, maxWidth);
            return maxWidth;
          }
          return calculated;
        };

        console.info('USE BEZEL ?', this.props.useBezel, styles.noBezel);

        var wrapperClass = (0, _classnames2.default)(this.props.isSubGrid === true ? styles.subgrid : null);
        return React.createElement(
          ContentBox,
          { className: wrapperClass },
          React.createElement(
            'div',
            { style: { display: 'flex' } },
            React.createElement(
              'div',
              { style: { flex: '1 1 auto' } },
              React.createElement(
                AutoSizer,
                { disableHeight: true, onResize: function onResize(_ref4) {
                    var height = _ref4.height;
                    var width = _ref4.width;

                    console.info('RESIZED', height, width);
                    _this2.setState({ height: height, width: width });
                  } },
                function (dimensions) {
                  var width = _this2.state.width || dimensions.width;
                  var height = _this2.state.height || dimensions.height;
                  var fixedCols = cols.filter(function (x) {
                    return x.width && typeof x.width === 'number';
                  });

                  var fixedWidth = fixedCols.reduce(function (sum, x) {
                    return sum += x.width;
                  }, 0);
                  var variableWidth = width - fixedWidth;
                  var variableColCount = cols.length - fixedCols.length;
                  var colWidths = cols.reduce(function (widthMap, x) {
                    return _extends({}, widthMap, _defineProperty({}, x.id, resolveColWidth(x.width ? x.width : variableWidth / variableColCount, x)));
                  }, {});
                  return React.createElement(Grid, {
                    ref: function ref(x) {
                      return _this2.grid = x;
                    },
                    className: styles.BodyGrid,
                    width: _this2.state.width || dimensions.width,
                    height: _this2.state.height || dimensions.height,
                    columnCount: colCount,
                    rowCount: getRowCount({ rows: rows }),
                    columnWidth: function columnWidth(_ref5) {
                      var index = _ref5.index;

                      var col = cols[index];
                      return colWidths[col.id];
                    },
                    rowHeight: function rowHeight(_ref6) {
                      var index = _ref6.index;

                      return index === 0 ? 50 : 25;
                    },

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

                      var renderedRows = [];
                      var width = _this2.state.width || dimensions.width;

                      for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                        var renderedCells = [];
                        var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                        if (spannedRows.includes(rowIndex)) {
                          var key = rowIndex + '-span';
                          var child = React.createElement(
                            'div',
                            {
                              key: key,
                              className: 'Grid__span',
                              style: { width: width
                              }
                            },
                            rows[rowIndex].render()
                          );
                          renderedCells.push(child);
                          console.info('SPANNED ROW', rowIndex);
                        } else {
                          for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                            var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

                            var _key = rowIndex + '-' + columnIndex;
                            var renderedCell = void 0;

                            // Avoid re-creating cells while scrolling.
                            // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
                            // If a scroll is in progress- cache and reuse cells.
                            // This cache will be thrown away once scrolling completes.
                            if (isScrolling) {
                              if (!cellCache[_key]) {
                                cellCache[_key] = cellRenderer({ columnIndex: columnIndex,
                                  isScrolling: isScrolling,
                                  rowIndex: rowIndex
                                });
                              }
                              renderedCell = cellCache[_key];
                              // If the user is no longer scrolling, don't cache cells.
                              // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
                            } else {
                                renderedCell = cellRenderer({ columnIndex: columnIndex,
                                  isScrolling: isScrolling,
                                  rowIndex: rowIndex
                                });
                              }

                            if (renderedCell === null || renderedCell === false) continue;

                            /** STATIC HEIGHT ELEMENT */
                            var _child = React.createElement(
                              'div',
                              {
                                key: _key,
                                className: 'Grid__cell',
                                style: { height: rowDatum.size
                                  //, left: columnDatum.offset + horizontalOffsetAdjustment
                                  , width: columnDatum.size
                                }
                              },
                              renderedCell
                            );
                            renderedCells.push(_child);
                          }
                        }
                        var rowStyle = {//height: rowDatum.size
                        };
                        renderedRows.push(React.createElement(
                          'div',
                          { key: rowIndex + '-row', id: rowIndex + '-row', className: styles.rowStyle, style: rowStyle },
                          renderedCells
                        ));
                      }
                      return renderedRows;
                    },

                    cellRenderer: function cellRenderer(_ref8) {
                      var columnIndex = _ref8.columnIndex;
                      var rowIndex = _ref8.rowIndex;
                      var isScrolling = _ref8.isScrolling;

                      var col = cols[columnIndex];
                      if (rowIndex === 0) {
                        var headerClass = (0, _classnames2.default)(styles.headerCell, col.className);
                        return React.createElement(
                          'div',
                          { className: headerClass },
                          col.render()
                        );
                      } else {
                        var cellClass = (0, _classnames2.default)(styles.cell, col.className, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow);
                        return React.createElement(
                          'div',
                          { className: cellClass },
                          rows[rowIndex][columnIndex]
                        );
                      }
                    }
                  });
                }
              )
            )
          )
        );
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        if (prevState.width !== this.state.width || prevState.height !== this.state.height) this.grid.recomputeGridSize();
      }
    }]);

    return CoreGrid;
  }(Component);

  CoreGrid.propTypes = _reduxGridCore.CoreGrid.PropTypes(React);
  CoreGrid.defaultProps = { maxHeight: 800,
    styles: {}
  };

  return _reduxGridCore.CoreGrid.Connect({ connect: connect, getState: getState })(CoreGrid);
}