'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = pager;

var _reactStamp = require('react-stamp');

var _reactStamp2 = _interopRequireDefault(_reactStamp);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var should = require('chai').should();

function nextDirection(direction) {
  switch (direction) {
    case 'asc':
      return 'desc';
    case 'desc':
      return null;
    default:
      return 'asc';
  }
}

function pager() {
  var _class, _temp;

  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object', connect: 'function', shallowCompare: 'function' })(deps);

  var React = _solvent.React;
  var connect = _solvent.connect;
  var shallowCompare = _solvent.shallowCompare;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  var PagerComponents = function PagerComponents(pagerProps) {
    var children = pagerProps.children;
    var status = pagerProps.status;
    var cols = pagerProps.cols;
    var actions = pagerProps.actions;
    var content = pagerProps.content;
    var styles = pagerProps.styles;
    var theme = pagerProps.theme;

    should.exist(status.page, 'page should exist');
    status.page.should.be.a('number', 'page must be a number');

    return children({ status: status,
      rows: status.rows,
      cols: cols,
      actions: actions,
      Controls: function Controls(props) {
        return React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.controls) },
          React.createElement(
            'button',
            { onClick: actions.fastBackward, className: (0, _classnames2.default)(styles.control), disabled: status.page === 0 },
            React.createElement(content.FastBackward, _extends({}, pagerProps, props))
          ),
          ' ',
          React.createElement(
            'button',
            { onClick: actions.stepBackward, className: (0, _classnames2.default)(styles.control), disabled: status.page === 0 },
            React.createElement(content.StepBackward, _extends({}, pagerProps, props))
          ),
          ' ',
          props.children ? React.createElement(
            'span',
            { className: (0, _classnames2.default)(styles.controlsChildren) },
            props.children
          ) : null,
          ' ',
          React.createElement(
            'button',
            { onClick: actions.stepForward, className: (0, _classnames2.default)(styles.control), disabled: status.page === status.pages - 1 },
            React.createElement(content.StepForward, _extends({}, pagerProps, props))
          ),
          ' ',
          React.createElement(
            'button',
            { onClick: actions.fastForward, className: (0, _classnames2.default)(styles.control), disabled: status.page === status.pages - 1 },
            React.createElement(content.FastForward, _extends({}, pagerProps, props))
          )
        );
      },
      Select: function Select(props) {
        return typeof status.rowsPerPage === 'number' && status.rowsPerPage > 0 ? React.createElement(
          'select',
          {
            value: status.page,
            onChange: function onChange(x) {
              return actions.select(parseInt(x.target.value));
            },
            className: (0, _classnames2.default)(styles.select, theme.select)
          },
          Array.from(Array(status.pages).keys()).map(function (x) {
            return React.createElement(
              'option',
              { key: x, value: x },
              content.selectOption(_extends({}, pagerProps, props, { index: x }))
            );
          })
        ) : React.createElement(
          'span',
          null,
          'All'
        );
      },
      RowsPerPage: function RowsPerPage(props) {
        return React.createElement(
          'span',
          null,
          props.label ? React.createElement(
            'label',
            null,
            props.label
          ) : null,
          ' ',
          React.createElement(
            'select',
            {
              value: status.rowsPerPage,
              onChange: function onChange(x) {
                var value = x.target.value;

                if (typeof value === 'string' && value.toLowerCase() === 'all') actions.rowsPerPage(value);else actions.rowsPerPage(parseInt(value));
              },
              className: (0, _classnames2.default)(styles.select, theme.select)
            },
            status.rowsPerPageOptions.map(function (x) {
              return React.createElement(
                'option',
                { key: x, value: x },
                content.rowsPerPageOption(_extends({}, pagerProps, props, { index: x }))
              );
            })
          )
        );
      },
      PageStatus: function PageStatus(props) {
        return React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.pageStatus) },
          React.createElement(content.PageStatus, _extends({}, pagerProps, props))
        );
      },
      RowStatus: function RowStatus(props) {
        return React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.rowStatus) },
          React.createElement(content.RowStatus, _extends({}, pagerProps, props))
        );
      },
      RowCount: function RowCount(props) {
        return React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.rowCount) },
          React.createElement(content.RowCount, _extends({}, pagerProps, props))
        );
      }
    });
  };

  var contentShape = { FastBackward: PropTypes.any.isRequired,
    StepBackward: PropTypes.any.isRequired,
    StepForward: PropTypes.any.isRequired,
    FastForward: PropTypes.any.isRequired,
    PageStatus: PropTypes.any.isRequired,
    RowStatus: PropTypes.any.isRequired,
    RowCount: PropTypes.any.isRequired,
    selectOption: PropTypes.func.isRequired,
    rowsPerPageOption: PropTypes.func.isRequired
  };

  var propTypes = { children: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.any.isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
    mapRows: PropTypes.func.isRequired,
    mapCellData: PropTypes.func.isRequired,
    typeSingular: PropTypes.string.isRequired,
    typePlural: PropTypes.string.isRequired,
    content: PropTypes.shape(contentShape).isRequired
  };

  var defaultProps = _extends({ styles: { controls: 'pagerControls',
      controlsChildren: 'pagerControlsChildren',
      control: 'pagerControl',
      select: 'pagerSelect'
    },
    theme: { select: 'pagerSelect' }
    /** TODO: MAKE THIS DEFAULT AN ARRAY (COLUMN SORTS) */
    , sort: { cols: ['id', 'key'],
      keys: { id: function id(data) {
          return data;
        } },
      direction: { id: 'asc', key: 'desc' }
    },
    mapCellData: function mapCellData(rowID, rowData) {
      return rowData;
    },
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [1, 2, 3, 4, 5, 10, 25, 50, 100, 500, 1000, 'All'],
    typeSingular: 'record',
    typePlural: 'records',
    content: { FastBackward: function FastBackward(_ref) {
        var status = _ref.status;

        var props = _objectWithoutProperties(_ref, ['status']);

        return React.createElement('i', { className: 'fa fa-fast-backward' });
      },
      StepBackward: function StepBackward(_ref2) {
        var status = _ref2.status;

        var props = _objectWithoutProperties(_ref2, ['status']);

        return React.createElement('i', { className: 'fa fa-step-backward' });
      },
      StepForward: function StepForward(_ref3) {
        var status = _ref3.status;

        var props = _objectWithoutProperties(_ref3, ['status']);

        return React.createElement('i', { className: 'fa fa-step-forward' });
      },
      FastForward: function FastForward(_ref4) {
        var status = _ref4.status;

        var props = _objectWithoutProperties(_ref4, ['status']);

        return React.createElement('i', { className: 'fa fa-fast-forward' });
      },
      PageStatus: function PageStatus(_ref5) {
        var status = _ref5.status;

        var props = _objectWithoutProperties(_ref5, ['status']);

        return React.createElement(
          'span',
          null,
          'Page ',
          (status.page + 1).toLocaleString(),
          ' of ',
          status.pages
        );
      },
      RowStatus: function RowStatus(_ref6) {
        var status = _ref6.status;

        var props = _objectWithoutProperties(_ref6, ['status']);

        return React.createElement(
          'span',
          null,
          'Showing ',
          props.typePlural,
          ' ',
          (status.startIndex + 1).toLocaleString(),
          ' through ',
          status.lastIndex.toLocaleString(),
          ' (',
          status.totalRows.toLocaleString(),
          ' total)'
        );
      },
      RowCount: function RowCount(_ref7) {
        var status = _ref7.status;

        var props = _objectWithoutProperties(_ref7, ['status']);

        return React.createElement(
          'span',
          null,
          status.totalRows.toLocaleString(),
          ' ',
          status.totalRows === 1 ? props.typeSingular : props.typePlural
        );
      },
      selectOption: function selectOption(_ref8) {
        var index = _ref8.index;

        var props = _objectWithoutProperties(_ref8, ['index']);

        return (index + 1).toLocaleString();
      },
      rowsPerPageOption: function rowsPerPageOption(_ref9) {
        var index = _ref9.index;

        var props = _objectWithoutProperties(_ref9, ['index']);

        return typeof index === 'number' ? index.toLocaleString() : index;
      }
    }
  }, defaults);

  return _temp = _class = function (_Component) {
    _inherits(Pager, _Component);

    function Pager(props) {
      _classCallCheck(this, Pager);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pager).call(this, props));

      _this.state = { page: props.page,
        rowsPerPage: props.rowsPerPage,
        sort: props.sort,
        filter: {}
      };
      return _this;
    }

    _createClass(Pager, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        if (this.props.onChange) this.props.onChange(this.state);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var map = _props.map;
        var mapCols = _props.mapCols;
        var mapRows = _props.mapRows;
        var rowsPerPageOptions = _props.rowsPerPageOptions;
        var mapCellData = _props.mapCellData;
        var filter = _props.filter;
        var _state = this.state;
        var page = _state.page;
        var rowsPerPage = _state.rowsPerPage;
        var _sort = _state.sort;


        var mapStatus = function mapStatus(state) {
          var data = map.data(state);
          var filtered = filter ? filter({ data: data, filterState: _this2.state.filter }) : { data: data, state: {} };
          var rows = mapRows(data, { sort: _sort, map: map, filter: filtered.status });

          if (typeof rowsPerPage !== 'number') {
            return { rows: rows,
              startIndex: 0,
              lastIndex: rows.length,
              page: page,
              pages: 1,
              rowsPerPage: rowsPerPage,
              rowsPerPageOptions: rowsPerPageOptions,
              totalRows: rows.size || rows.length,
              sort: _sort,
              filter: filtered.status
            };
          }

          var startIndex = page * rowsPerPage;
          var endIndex = (page + 1) * rowsPerPage;
          var pages = Math.ceil(rows.length / rowsPerPage);
          var rowSlice = rows.slice(startIndex, endIndex);
          var lastIndex = startIndex + rowSlice.length;

          return { rows: rowSlice,
            page: page,
            pages: pages,
            startIndex: startIndex,
            lastIndex: lastIndex,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions: rowsPerPageOptions,
            totalRows: rows.size || rows.length,
            sort: _sort,
            filter: filtered.status
          };
        };

        var mapStateToProps = function mapStateToProps(state) {
          var status = mapStatus(state);
          var actions = { fastBackward: function fastBackward() {
              return _this2.setState({ page: 0 });
            },
            stepBackward: function stepBackward() {
              return _this2.setState({ page: page - 1 });
            },
            stepForward: function stepForward() {
              return _this2.setState({ page: page + 1 });
            },
            fastForward: function fastForward() {
              return _this2.setState({ page: status.pages - 1 });
            },
            select: function select(x) {
              return _this2.setState({ page: x });
            },
            rowsPerPage: function rowsPerPage(x) {
              return _this2.setState({ rowsPerPage: x, page: typeof x === 'number' ? Math.floor(status.startIndex / x) : 0 });
            },
            sort: function sort(id) {
              var index = _sort.cols.indexOf(id);
              if (!index === -1) throw new Error('id ' + id + ' is not a sortable column.');
              var lastDirection = _sort.direction && _sort.direction[id] ? _sort.direction[id] : null;
              var newDirection = nextDirection(lastDirection);
              var direction = _extends({}, _sort.direction, _defineProperty({}, id, newDirection));
              var remaining = [].concat(_toConsumableArray(_sort.cols.slice(0, index)), _toConsumableArray(_sort.cols.slice(index + 1)));
              if (remaining.includes(id)) throw new Error('internal sort error: id \'' + id + '\' should not exist in ' + JSON.stringify(remaining) + '!');
              var cols = newDirection ? [id].concat(_toConsumableArray(remaining)) : [].concat(_toConsumableArray(remaining), [id]);
              _this2.setState({ sort: _extends({}, _sort, { cols: cols, direction: direction }) });
            },
            filter: function filter(x) {
              return _this2.setState({ filter: x });
            }
          };

          var cols = mapCols({ status: status, actions: actions });
          return { actions: actions,
            status: status,
            cols: cols
          };
        };
        var ConnectedPager = connect(mapStateToProps)(PagerComponents);
        return React.createElement(ConnectedPager, this.props);
      }
    }]);

    return Pager;
  }(Component), _class.propTypes = propTypes, _class.defaultProps = defaultProps, _temp;
}