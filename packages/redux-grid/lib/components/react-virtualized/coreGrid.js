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

var resolver = (0, _solvent2.default)({ React: 'object',
  connect: 'function',
  ReactVirtualized: 'object',
  Immutable: 'object'
  //, Maximize: 'function'
});
function coreGrid(deps) {
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _resolver = resolver(deps);

  var React = _resolver.React;
  var connect = _resolver.connect;
  var ReactVirtualized = _resolver.ReactVirtualized;
  var Immutable = _resolver.Immutable;
  var Maximize = _resolver.Maximize;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;
  var getState = defaults.getState;

  should.exist(React);
  should.exist(connect);
  should.exist(ReactVirtualized);
  var AutoSizer = ReactVirtualized.AutoSizer;
  var FlexTable = ReactVirtualized.FlexTable;
  var FlexColumn = ReactVirtualized.FlexColumn;
  var SortDirection = ReactVirtualized.SortDirection;
  var SortIndicator = ReactVirtualized.SortIndicator;
  var Grid = ReactVirtualized.Grid;

  var Expander = (0, _expander2.default)({ React: React });

  var wideStyle = { display: 'flex',
    flexDirection: 'row',
    flex: '1 0 auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto',
    padding: 5
  };

  var CoreGrid = function (_Component) {
    _inherits(CoreGrid, _Component);

    function CoreGrid(props) {
      _classCallCheck(this, CoreGrid);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CoreGrid).call(this, props));

      _this.state = {};
      return _this;
    }

    _createClass(CoreGrid, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var cols = _props.cols;
        var rows = _props.rows;
        var maxHeight = _props.maxHeight;
        var style = _props.style;
        var styles = _props.styles;
        var theme = _props.theme;
        var gridStyle = _props.gridStyle;
        var maxWidth = _props.maxWidth;
        var header = _props.header;
        var footer = _props.footer;
        var pager = _props.pager;
        var maximize = _props.maximize;

        var spannedRows = rows.reduce(function (spanned, x, i) {
          if (x.span === true) return [].concat(_toConsumableArray(spanned), [i]);
          return spanned;
        }, []);
        should.exist(cols);
        should.exist(rows);
        cols.should.be.instanceof(Array);
        rows.should.be.instanceof(Array);
        var colCount = cols.length;
        var getRowCount = function getRowCount() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? /*= mapRows(state)*/{} : arguments[0];

          var _ref$rows = _ref.rows;
          var rows = _ref$rows === undefined ? rows : _ref$rows;
          return rows.size || rows.length;
        }; // 2 more than index for header and footer

        var resolveColWidth = function resolveColWidth(calculated) {
          var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          var minWidth = _ref2.minWidth;
          var maxWidth = _ref2.maxWidth;

          //console.debug('RESOLVE COL WIDTH', calculated, minWidth, maxWidth)
          if (minWidth && calculated < minWidth) {
            //console.debug('OVERRIDING CALCULATED WIDTH FOR MIN', calculated, minWidth)
            return minWidth;
          }
          if (maxWidth && calculated > maxWidth) {
            //console.debug('OVERRIDING CALCULATED WIDTH FOR MAX', calculated, maxWidth)
            return maxWidth;
          }
          return calculated;
        };

        var containerClass = (0, _classnames2.default)(styles.container, theme.container);
        var innerContainerClass = (0, _classnames2.default)(styles.innerContainer, theme.innerContainer);
        var gridClass = (0, _classnames2.default)(styles.BodyGrid, theme.BodyGrid);

        var renderGrid = function renderGrid() {
          var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var preHeader = _ref3.preHeader;
          var postHeader = _ref3.postHeader;
          return React.createElement(
            'div',
            { className: containerClass, style: style },
            React.createElement(
              'div',
              { className: innerContainerClass },
              React.createElement(
                AutoSizer,
                { onResize: function onResize(_ref4) {
                    var height = _ref4.height;
                    var width = _ref4.width;

                    _this2.setState({ height: height, width: width });
                  } },
                function (dimensions) {
                  var width = _this2.state.width || dimensions.width;
                  var height = _this2.state.height || dimensions.height || 100;
                  var fixedWidthIndices = [];
                  var fixedCols = cols.filter(function (x, i) {
                    var isFixed = x.width && typeof x.width === 'number';
                    if (isFixed) fixedWidthIndices.push(i);
                    return isFixed;
                  });

                  var fixedWidth = fixedCols.reduce(function (sum, x) {
                    return sum += x.width;
                  }, 0);
                  var variableWidth = width - fixedWidth;
                  var variableColCount = cols.length - fixedCols.length;
                  var colWidths = cols.reduce(function (widthMap, x) {
                    return _extends({}, widthMap, _defineProperty({}, x.id, resolveColWidth(x.width ? x.width : variableWidth / variableColCount, x)));
                  }, {});
                  var rowCount = getRowCount({ rows: rows });
                  return React.createElement(Grid, {
                    ref: function ref(x) {
                      return _this2.grid = x;
                    },
                    className: gridClass,
                    style: gridStyle,
                    width: _this2.props.maxWidth || _this2.state.width || dimensions.width,
                    height: _this2.state.height || dimensions.height || 100,
                    columnCount: colCount,
                    rowCount: rowCount,
                    columnWidth: function columnWidth(_ref5) {
                      var index = _ref5.index;

                      var col = cols[index];
                      return colWidths[col.id];
                    },
                    rowHeight: 1,

                    cellRangeRenderer: function cellRangeRenderer() {
                      var _ref6 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                      var cellCache = _ref6.cellCache;
                      var cellRenderer = _ref6.cellRenderer;
                      var columnSizeAndPositionManager = _ref6.columnSizeAndPositionManager;
                      var columnStartIndex = _ref6.columnStartIndex;
                      var columnStopIndex = _ref6.columnStopIndex;
                      var horizontalOffsetAdjustment = _ref6.horizontalOffsetAdjustment;
                      var isScrolling = _ref6.isScrolling;
                      var rowSizeAndPositionManager = _ref6.rowSizeAndPositionManager;
                      var rowStartIndex = _ref6.rowStartIndex;
                      var rowStopIndex = _ref6.rowStopIndex;
                      var scrollLeft = _ref6.scrollLeft;
                      var scrollTop = _ref6.scrollTop;
                      var verticalOffsetAdjustment = _ref6.verticalOffsetAdjustment;

                      var renderedRows = [];
                      var width = _this2.state.width || dimensions.width;

                      /** GRID ROW HEADER */
                      if (header) renderedRows.push(React.createElement(
                        'div',
                        { key: 'grid-header', className: (0, _classnames2.default)(styles.headerGrid, theme.headerGrid) },
                        preHeader ? preHeader : null,
                        typeof header === 'function' ? header() : header,
                        postHeader ? postHeader : null
                      ));

                      var gridRow = function gridRow(rowKey, cells, _ref7) {
                        var _ref7$rowClass = _ref7.rowClass;
                        var rowClass = _ref7$rowClass === undefined ? 'Grid__row' : _ref7$rowClass;
                        var _ref7$rowStyle = _ref7.rowStyle;
                        var rowStyle = _ref7$rowStyle === undefined ? {} : _ref7$rowStyle;
                        var _ref7$cellClass = _ref7.cellClass;
                        var cellClass = _ref7$cellClass === undefined ? 'Grid__cell' : _ref7$cellClass;
                        var _ref7$cellStyle = _ref7.cellStyle;
                        var cellStyle = _ref7$cellStyle === undefined ? {} : _ref7$cellStyle;

                        should.exist(rowKey, 'rowKey is required');
                        return React.createElement(
                          'div',
                          { key: rowKey, id: rowKey + '-row', className: styles.rowStyle, style: rowStyle },
                          cells.map(function (x, i) {
                            var computedStyle = typeof cellStyle === 'function' ? cellStyle(i) : cellStyle;
                            if (fixedWidthIndices.includes(i)) {
                              var datum = columnSizeAndPositionManager.getSizeAndPositionOfCell(i);
                              computedStyle = _extends({}, computedStyle, { flex: '0 1 ' + datum.size + 'px' });
                            }
                            return React.createElement(
                              'div',
                              {
                                key: rowKey + '-' + i,
                                className: typeof cellClass === 'function' ? cellClass(i) : cellClass,
                                style: computedStyle
                              },
                              React.createElement(
                                'span',
                                { className: (0, _classnames2.default)(styles.innerCell, theme.innerCell) },
                                x
                              )
                            );
                          })
                        );
                      };

                      /** COLUMN HEADERS */
                      renderedRows.push(gridRow('col-headers', cols.map(function (x) {
                        return x.header({ rows: rows, theme: theme });
                      }), { rowClass: styles.rowStyle, cellClass: function cellClass(i) {
                          return (0, _classnames2.default)(styles.headerCell, theme.headerCell, cols[i].className);
                        } }));

                      var _loop = function _loop(rowIndex) {
                        var renderedCells = [];

                        if (spannedRows.includes(rowIndex)) {
                          var key = rowIndex + '-span';
                          var child = React.createElement(
                            'div',
                            {
                              key: key
                              //style={wideStyle}
                              , className: (0, _classnames2.default)(styles.Grid__span, theme.expanded, 'drill')
                            },
                            rows[rowIndex].render()
                          );
                          renderedRows.push(child);
                        } else {
                          for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                            var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

                            var _key = rowIndex + '-' + columnIndex;
                            var renderedCell = void 0;

                            // Avoid re-creating cells while scrolling.
                            // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
                            // If a scroll is in progress- cache and reuse cells.
                            // This cache will be thrown away once scrolling completes.
                            if (false) {
                              //isScrolling) {
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
                            renderedCells.push(renderedCell);
                          }
                        }
                        var cellClass = function cellClass(i) {
                          return (0, _classnames2.default)(styles.cell, theme.cell, cols[i].className, rowIndex % 2 === 0 ? theme.evenRow : theme.oddRow);
                        };
                        renderedRows.push(gridRow(rowIndex, renderedCells, { rowClass: styles.rowStyle, cellClass: cellClass }));
                      };

                      for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                        _loop(rowIndex);
                      }

                      renderedRows.push(gridRow('col-footers', cols.map(function (x) {
                        return x.footer ? x.footer({ rows: rows, theme: theme }) : null;
                      }), { rowClass: styles.rowStyle, cellClass: function cellClass(i) {
                          return (0, _classnames2.default)(styles.footerCell, theme.footerCell, cols[i].className);
                        } }));

                      if (footer) {
                        renderedRows.push(React.createElement(
                          'div',
                          { key: 'grid-footer', style: wideStyle, className: (0, _classnames2.default)(styles.footerGrid, theme.footerGrid) },
                          typeof footer === 'function' ? footer() : footer
                        ));
                      }
                      return renderedRows;
                    },

                    cellRenderer: function cellRenderer(_ref8) {
                      var columnIndex = _ref8.columnIndex;
                      var rowIndex = _ref8.rowIndex;
                      var isScrolling = _ref8.isScrolling;

                      var col = cols[columnIndex];
                      return rows[rowIndex].render()[columnIndex];
                    }
                  });
                }
              )
            )
          );
        };

        return renderGrid();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        if (prevState.width !== this.state.width || prevState.height !== this.state.height) {
          this.grid.recomputeGridSize();
        }
      }
    }]);

    return CoreGrid;
  }(Component);

  CoreGrid.propTypes = _reduxGridCore.CoreGrid.PropTypes(React);
  CoreGrid.defaultProps = _reduxGridCore.CoreGrid.DefaultProps(React);

  return _reduxGridCore.CoreGrid.Connect({ connect: connect }, { getState: getState })(CoreGrid);
}