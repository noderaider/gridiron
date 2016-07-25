'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = pager;

var _reactStamp2 = require('react-stamp');

var _reactStamp3 = _interopRequireDefault(_reactStamp2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object', connect: 'function', shallowCompare: 'function', Immutable: 'object' })(deps);

  var React = _solvent.React;
  var connect = _solvent.connect;
  var shallowCompare = _solvent.shallowCompare;
  var Immutable = _solvent.Immutable;
  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var _reactStamp = (0, _reactStamp3.default)(React);

  var compose = _reactStamp.compose;


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
    , sort: Immutable.Map({ cols: Immutable.List(['id', 'key']),
      keys: Immutable.Map({ id: function id(data) {
          return data;
        } }),
      direction: Immutable.Map({ id: 'asc', key: 'desc' })
    }),
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

  return compose({ displayName: 'Pager',
    propTypes: propTypes,
    defaultProps: defaultProps,
    state: { status: Immutable.Map() },
    init: function init() {
      var _this = this;

      var getProps = function getProps() {
        return _this.props;
      };
      var getStatus = function getStatus(status) {
        return _this.state.status;
      };
      var setStatus = function setStatus(status) {
        return _this.setState({ status: status });
      };

      var access = { get page() {
          return getStatus().get('page', getProps().page);
        },
        set page(value) {
          setStatus(getStatus().set('page', value));
        },
        get rowsPerPage() {
          return getStatus().get('rowsPerPage', getProps().rowsPerPage);
        },
        set rowsPerPage(value) {
          setStatus(getStatus().set('rowsPerPage', value));
        },
        get sort() {
          return getStatus().get('sort', getProps().sort);
        },
        set sort(value) {
          getStatus().set('sort', value);
        },
        getSortDirection: function getSortDirection(id) {
          return getStatus().getIn(['sort', 'direction', id], null);
        },
        merge: function merge(value) {
          return setStatus(_this.state.status.merge(value));
        }
      };

      var mapStatus = function mapStatus(state) {
        var _props = _this.props;
        var map = _props.map;
        var mapRows = _props.mapRows;
        var rowsPerPageOptions = _props.rowsPerPageOptions;
        var Filter = _props.Filter;

        var sort = access.sort;
        var page = access.page;
        var rowsPerPage = access.rowsPerPage;
        var data = map.data(state);
        //const filtered = map.rowData(data)
        //const filtered = this.state.filter ? this.state.filter(data) : data
        //console.info('FILTERED DATA', filtered)
        var filtered = _this.state.filter ? _this.state.filter(data) : data;
        var rows = mapRows(filtered, { sort: sort, map: map });

        if (typeof rowsPerPage !== 'number') {
          return { rows: rows,
            startIndex: 0,
            lastIndex: rows.size || rows.length,
            page: page,
            pages: 1,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions: rowsPerPageOptions,
            totalRows: rows.size || rows.length,
            sort: sort
          };
        }

        var startIndex = page * rowsPerPage;
        var endIndex = (page + 1) * rowsPerPage;
        var pages = Math.ceil((rows.size || rows.length) / rowsPerPage);
        var rowSlice = rows.slice(startIndex, endIndex);
        var lastIndex = startIndex + (rowSlice.size || rowSlice.length);

        var filter = function filter(_ref10) {
          var id = _ref10.id;
          return React.createElement(Filter, { id: id, data: data, onChange: function onChange(x) {
              return _this.setState({ filter: x });
            } });
        };

        return { rows: rowSlice,
          page: page,
          pages: pages,
          startIndex: startIndex,
          lastIndex: lastIndex,
          rowsPerPage: rowsPerPage,
          rowsPerPageOptions: rowsPerPageOptions,
          totalRows: rows.size || rows.length,
          sort: sort,
          filter: filter
        };
      };

      this.mapStateToProps = function (state) {
        var status = mapStatus(state);
        var actions = { fastBackward: function fastBackward() {
            access.page = 0;
          },
          stepBackward: function stepBackward() {
            access.page = access.page - 1;
          },
          stepForward: function stepForward() {
            access.page = access.page + 1;
          },
          fastForward: function fastForward() {
            access.page = access.page - 1;
          },
          select: function select(x) {
            access.page = x;
          },
          rowsPerPage: function rowsPerPage(_rowsPerPage) {
            access.merge({ rowsPerPage: _rowsPerPage,
              page: typeof _rowsPerPage === 'number' ? Math.floor(status.startIndex / _rowsPerPage) : 0
            });
          },
          sort: function sort(id) {
            var sort = access.sort;
            var _cols = sort.get('cols');
            var index = _cols.indexOf(id);
            if (index === -1) throw new Error('id ' + id + ' is not a sortable column.');
            var lastDirection = sort.getIn(['direction', id], null);
            var newDirection = nextDirection(lastDirection);
            var direction = sort.get('direction', new Immutable.Map()).set(id, newDirection);
            var cols = newDirection ? _cols.delete(index).unshift(id) : _cols.delete(index).push(id);
            var newSort = sort.merge({ cols: cols, direction: direction });
            access.merge({ sort: newSort });
          }
        };

        var cols = _this.props.mapCols({ status: status, actions: actions });
        return { actions: actions,
          status: status,
          cols: cols
        };
      };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    },
    render: function render() {
      var ReduxPager = connect(this.mapStateToProps)(PagerComponents);
      return React.createElement(ReduxPager, this.props);
    }
  });
}