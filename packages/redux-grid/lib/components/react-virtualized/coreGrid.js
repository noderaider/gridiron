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

var resolver = (0, _solvent2.default)({ React: 'object',
  connect: 'function',
  ReactVirtualized: 'object',
  Immutable: 'object'
});
function coreGrid(deps) {
  var _resolver = resolver(deps);

  var React = _resolver.React;
  var connect = _resolver.connect;
  var ReactVirtualized = _resolver.ReactVirtualized;
  var Immutable = _resolver.Immutable;
  var getState = deps.getState;

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

      _this.state = {};
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
        var style = _props.style;
        var styles = _props.styles;
        var theme = _props.theme;
        var gridStyle = _props.gridStyle;
        var maxWidth = _props.maxWidth;


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
        var getRowCount = function getRowCount() {
          var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var _ref$rows = _ref.rows;
          var rows = _ref$rows === undefined ? mapRows(state) : _ref$rows;
          return (rows.size || rows.length) + 2;
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

        var gridClass = (0, _classnames2.default)(styles.BodyGrid, theme.BodyGrid);

        var wrapperClass = (0, _classnames2.default)(this.props.isSubGrid === true ? styles.subgrid : null);
        return React.createElement(
          'div',
          { className: styles.Grid__wrap, style: _extends({}, style, { display: 'flex' }) },
          React.createElement(
            'div',
            { style: { flex: '1 1 auto' } },
            React.createElement(
              AutoSizer,
              { style: { width: '100%', height: '100%' }, onResize: function onResize(_ref3) {
                  var height = _ref3.height;
                  var width = _ref3.width;

                  console.info('RESIZED', height, width);
                  _this2.setState({ height: height, width: width });
                } },
              function (dimensions) {
                var width = _this2.state.width || dimensions.width;
                console.info('AUTODIMENSIONS =>', dimensions);
                var height = _this2.state.height || dimensions.height || 100;
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
                  columnWidth: function columnWidth(_ref4) {
                    var index = _ref4.index;

                    var col = cols[index];
                    return colWidths[col.id];
                  },
                  rowHeight: function rowHeight(_ref5) {
                    var index = _ref5.index;

                    return index === 0 ? 50 : 25;
                  },

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

                    for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                      var renderedCells = [];
                      var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                      if (spannedRows.includes(rowIndex - 1)) {
                        var key = rowIndex + '-span';
                        var child = React.createElement(
                          'div',
                          {
                            key: key,
                            className: (0, _classnames2.default)(styles.Grid__span, theme.expanded, 'drill'),
                            style: { width: width
                            }
                          },
                          rows[rowIndex - 1].render()
                        );
                        renderedCells.push(child);
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

                  cellRenderer: function cellRenderer(_ref7) {
                    var columnIndex = _ref7.columnIndex;
                    var rowIndex = _ref7.rowIndex;
                    var isScrolling = _ref7.isScrolling;

                    var col = cols[columnIndex];
                    if (rowIndex === 0) {
                      var headerClass = (0, _classnames2.default)(styles.headerCell, col.className);
                      return React.createElement(
                        'div',
                        { className: headerClass },
                        col.header({ rows: rows })
                      );
                    } else if (rowIndex === rowCount - 1) {
                      var footerClass = (0, _classnames2.default)(styles.footerCell, col.className);
                      return React.createElement(
                        'div',
                        { className: footerClass },
                        col.footer ? col.footer({ rows: rows }) : null
                      );
                    } else {
                      var cellClass = (0, _classnames2.default)(styles.cell, col.className, rowIndex % 2 === 0 ? theme.evenRow : theme.oddRow);
                      return React.createElement(
                        'div',
                        { className: cellClass },
                        rows[rowIndex - 1].render()[columnIndex]
                      );
                    }
                  }
                });
              }
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
  CoreGrid.defaultProps = _reduxGridCore.CoreGrid.DefaultProps(React);

  return _reduxGridCore.CoreGrid.Connect({ connect: connect, getState: getState })(CoreGrid);
}