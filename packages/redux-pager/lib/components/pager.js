'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = pager;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent = require('solvent');

var _solvent2 = _interopRequireDefault(_solvent);

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

function pager(pure) {
  var React = pure.React;
  var PropTypes = pure.PropTypes;
  var cloneElement = pure.cloneElement;
  var connect = pure.connect;
  var shallowCompare = pure.shallowCompare;
  var Immutable = pure.Immutable;
  var defaults = pure.defaults;
  var styles = defaults.styles;
  var theme = defaults.theme;

  var desktopStyles = [styles.desktop, theme.desktop];
  var mobileStyles = [styles.mobile, theme.mobile];

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
    sort: PropTypes.object,
    createSortKeys: PropTypes.func.isRequired,
    createSortKeyComparator: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.any.isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
    typeSingular: PropTypes.string.isRequired,
    typePlural: PropTypes.string.isRequired,
    content: PropTypes.shape(contentShape).isRequired
  };
  /** CREATES SORT KEYS FOR A ROW */
  var defaultProps = _extends({ createSortKeys: function createSortKeys(cellData, access) {
      var sort = access.sort;
      return sort.get('cols').filter(function (columnID) {
        return typeof sort.getIn(['direction', columnID]) === 'string';
      }).map(function (columnID) {
        var sortKey = sort.getIn(['keys', columnID], null);
        var cellDatum = cellData.get(columnID);
        var currentKey = sortKey ? sortKey(cellDatum) : cellDatum;
        return typeof currentKey === 'string' ? currentKey : currentKey.toString();
      });
    }
    /** COMPARES SORT KEYS OF TWO ROWS */
    , createSortKeyComparator: function createSortKeyComparator(access) {
      var sort = access.sort;
      var multipliers = sort.get('direction') ? sort.get('cols').map(function (columnID) {
        return sort.getIn(['direction', columnID]) === 'desc' ? -1 : 1;
      }) : [];
      return function (sortKeysA, sortKeysB) {
        for (var colIndex = 0; colIndex < sortKeysA.size; colIndex++) {
          var result = sortKeysA.get(colIndex).localeCompare(sortKeysB.get(colIndex)) * multipliers.get(colIndex);
          if (result !== 0) return result;
        }
        return 0;
      };
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
          { className: _classnames2.default.apply(undefined, [styles.pageStatus, theme.pageStatus].concat(desktopStyles)) },
          'Page ',
          (status.get('page') + 1).toLocaleString(),
          ' of ',
          status.get('pages')
        );
      },
      PageStatusMobile: function PageStatusMobile(_ref6) {
        var status = _ref6.status;

        var props = _objectWithoutProperties(_ref6, ['status']);

        return React.createElement(
          'span',
          { className: _classnames2.default.apply(undefined, [styles.pageStatus, theme.pageStatus].concat(mobileStyles)) },
          (status.get('page') + 1).toLocaleString(),
          ' / ',
          status.get('pages')
        );
      },
      RowStatus: function RowStatus(_ref7) {
        var status = _ref7.status;

        var props = _objectWithoutProperties(_ref7, ['status']);

        return React.createElement(
          'span',
          { className: _classnames2.default.apply(undefined, [styles.rowStatus, theme.rowStatus].concat(desktopStyles)) },
          'Showing ',
          props.typePlural,
          ' ',
          (status.get('startIndex') + 1).toLocaleString(),
          ' through ',
          status.get('lastIndex').toLocaleString(),
          ' (',
          status.get('totalRows').toLocaleString(),
          ' total)'
        );
      },
      RowStatusMobile: function RowStatusMobile(_ref8) {
        var status = _ref8.status;

        var props = _objectWithoutProperties(_ref8, ['status']);

        return React.createElement(
          'span',
          { className: _classnames2.default.apply(undefined, [styles.rowStatus, theme.rowStatus].concat(mobileStyles)) },
          (status.get('startIndex') + 1).toLocaleString(),
          ' - ',
          status.get('lastIndex').toLocaleString(),
          ' / ',
          status.get('totalRows').toLocaleString()
        );
      },
      RowCount: function RowCount(_ref9) {
        var status = _ref9.status;

        var props = _objectWithoutProperties(_ref9, ['status']);

        return React.createElement(
          'span',
          { className: _classnames2.default.apply(undefined, [styles.rowCount, theme.rowCount].concat(desktopStyles)) },
          status.totalRows.toLocaleString(),
          ' ',
          status.get('totalRows') === 1 ? props.typeSingular : props.typePlural
        );
      },
      RowCountMobile: function RowCountMobile(_ref10) {
        var status = _ref10.status;

        var props = _objectWithoutProperties(_ref10, ['status']);

        return React.createElement(
          'span',
          { className: _classnames2.default.apply(undefined, [styles.rowCount, theme.rowCount].concat(mobileStyles)) },
          status.totalRows.toLocaleString(),
          ' ',
          status.get('totalRows') === 1 ? props.typeSingular : props.typePlural
        );
      },
      selectOption: function selectOption(_ref11) {
        var index = _ref11.index;

        var props = _objectWithoutProperties(_ref11, ['index']);

        return (index + 1).toLocaleString();
      },
      rowsPerPageOption: function rowsPerPageOption(_ref12) {
        var index = _ref12.index;

        var props = _objectWithoutProperties(_ref12, ['index']);

        return typeof index === 'number' ? index.toLocaleString() : index;
      }
    }
  }, defaults);

  /** PRE REDUX (CONFIG) */
  var PagerContext = pure({ displayName: 'PagerContext',
    propTypes: propTypes,
    defaultProps: defaultProps,
    render: function render() {
      var _this = this;

      var _props = this.props;
      var map = _props.map;
      var rowsPerPageOptions = _props.rowsPerPageOptions;
      var createSortKeys = _props.createSortKeys;
      var createSortKeyComparator = _props.createSortKeyComparator;

      var childProps = _objectWithoutProperties(_props, ['map', 'rowsPerPageOptions', 'createSortKeys', 'createSortKeyComparator']);

      return React.createElement(PagerDataFilter, _extends({}, childProps, {

        mapStateToRowData: function mapStateToRowData(state) {
          var rowData = map.rowData(state);
          if (!Immutable.Map.isMap(rowData)) {
            console.warn('redux-pager: map.rowData() should return an Immutable Map for best performance (converting...).');
            return Immutable.Map(rowData);
          }
          return rowData;
        },
        mapColumnData: function mapColumnData(rowData) {
          return rowData.map(function (rowDatum, rowID) {
            return map.cellData(rowID, rowDatum);
          });
        }
        /** CALLED BY FILTER STREAM */
        , filterRowData: this.props.filterStream ? function (rowData, filterState) {
          if (filterState) {
            var anyFiltered = false;
            var filtered = rowData.filter(function (rowDatum, rowID) {
              var value = Object.keys(filterState).some(function (columnID) {
                return filterState[columnID](rowID) === true;
              });
              console.info('FILTERING ROW DATA', filterState, rowDatum, rowID, value);

              if (value) anyFiltered = true;
              return value;
            });
            //console.warn('FILTERED =>', filterState, filtered)
            return anyFiltered ? filtered : rowData;
          }
          return rowData;
        } : null
        /** MAP CELL AND SORT DATA AND ADD TO DATA CONSTRUCT */

        , mapData: function mapData(rowData, columnData, access) {
          var rows = rowData.map(function (rowDatum, rowID) {
            var cellData = columnData.get(rowID);
            var sortKeys = _this.props.sort ? createSortKeys(cellData, access) : null;
            return Immutable.Map({ rowDatum: rowDatum, cellData: cellData, sortKeys: sortKeys });
          });
          var columns = rows.first().get('cellData').keySeq();
          return Immutable.Map({ rows: rows, columns: columns });
        },
        sortData: this.props.sort ? function (data, access) {
          var comparator = createSortKeyComparator(access);
          return data.set('rows', data.get('rows').sortBy(function (context, rowID) {
            return context.get('sortKeys');
          }, comparator));
        } : null,
        mapDataToStatus: function mapDataToStatus(data, access) {
          var sort = access.sort;
          var page = access.page;
          var rowsPerPage = access.rowsPerPage;
          var rows = data.get('rows');

          if (typeof rowsPerPage !== 'number') {
            return Immutable.Map({ data: data,
              startIndex: 0,
              lastIndex: rows.size,
              page: page,
              pages: 1,
              rowsPerPage: rowsPerPage,
              rowsPerPageOptions: rowsPerPageOptions,
              totalRows: rows.size,
              sort: sort
            });
          }

          var startIndex = page * rowsPerPage;
          var endIndex = (page + 1) * rowsPerPage;
          var pages = Math.ceil(rows.size / rowsPerPage);
          var rowSlice = rows.slice(startIndex, endIndex);
          var lastIndex = startIndex + (rowSlice.size || rowSlice.length);

          return Immutable.Map({ data: data.set('rows', rowSlice),
            page: page,
            pages: pages,
            startIndex: startIndex,
            lastIndex: lastIndex,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions: rowsPerPageOptions,
            totalRows: rows.size,
            sort: sort
          });
        },
        mapStatusToActions: function mapStatusToActions(status, access) {
          return { fastBackward: function fastBackward() {
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
                page: typeof _rowsPerPage === 'number' ? Math.floor(status.get('startIndex') / status.get('rowsPerPage')) : 0
              });
            },
            sort: function sort(id) {
              var sort = access.sort;
              var _cols = sort.get('cols');
              var index = _cols.indexOf(id);
              if (index === -1) throw new Error('id ' + id + ' is not a sortable column.');
              var lastDirection = sort.getIn(['direction', id], null);
              var newDirection = nextDirection(lastDirection);
              var direction = sort.get('direction', Immutable.Map()).set(id, newDirection);
              var cols = newDirection ? _cols.delete(index).unshift(id) : _cols.delete(index).push(id);
              var newSort = sort.merge({ cols: cols, direction: direction });
              access.merge({ sort: newSort });
            }
          };
        }
      }));
    }
  });

  var PagerDataFilter = connect(function (state) {
    return { state: state };
  })(pure({ displayName: 'PagerDataFilter',
    propTypes: { state: PropTypes.object.isRequired,
      mapStateToRowData: PropTypes.func.isRequired,
      mapColumnData: PropTypes.func.isRequired,
      filterStream: PropTypes.func,
      filterRowData: PropTypes.func
    },
    render: function render() {
      var _props2 = this.props;
      var mapStateToRowData = _props2.mapStateToRowData;
      var mapColumnData = _props2.mapColumnData;
      var mapEarlyProps = _props2.mapEarlyProps;

      var childProps = _objectWithoutProperties(_props2, ['mapStateToRowData', 'mapColumnData', 'mapEarlyProps']);

      var rowData = mapStateToRowData(this.props.state);
      var columnData = mapColumnData(rowData);
      var earlyProps = mapEarlyProps ? mapEarlyProps({ rowData: rowData, columnData: columnData }) : null;

      return React.createElement(PagerRowFilter, _extends({}, childProps, {
        earlyProps: earlyProps,
        rowData: rowData,
        columnData: columnData
      }));
    }
  }));

  var PagerRowFilter = pure({ displayName: 'PagerRowFilter',
    propTypes: { rowData: PropTypes.object.isRequired,
      columnData: PropTypes.object.isRequired,
      mapData: PropTypes.func.isRequired,
      sortData: PropTypes.func,
      mapDataToStatus: PropTypes.func.isRequired,
      mapStatusToActions: PropTypes.func.isRequired
    },
    state: { status: Immutable.Map(),
      filterState: null
    },
    init: function init() {
      var _this2 = this;

      var getProps = function getProps() {
        return _this2.props;
      };
      var getStatus = function getStatus(status) {
        return _this2.state.status;
      };
      var setStatus = function setStatus(status) {
        return _this2.setState({ status: status });
      };

      this.access = { get page() {
          return getStatus().get('page', getProps().page);
        },
        set page(value) {
          setStatus(getStatus().set('page', value));
        },
        get rowsPerPage() {
          return getStatus().get('rowsPerPage', getProps().rowsPerPage);
        },
        get sort() {
          return getStatus().get('sort', getProps().sort);
        },
        getSortDirection: function getSortDirection(id) {
          return getStatus().getIn(['sort', 'direction', id], null);
        },
        merge: function merge(value) {
          return setStatus(_this2.state.status.merge(value));
        }
      };
    },
    componentWillMount: function componentWillMount() {
      var _this3 = this;

      var _props3 = this.props;
      var mapStateToRowData = _props3.mapStateToRowData;
      var mapColumnData = _props3.mapColumnData;
      var filterStream = _props3.filterStream;
      var filterRowData = _props3.filterRowData;
      var Filter = _props3.Filter;

      if (filterStream) this.unsubscribe = filterStream(function (filterState) {
        return _this3.setState({ filterState: filterState });
      });
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.unsubscribe) this.unsubscribe();
    },
    render: function render() {
      var _props4 = this.props;
      var rowData = _props4.rowData;
      var columnData = _props4.columnData;
      var filterRowData = _props4.filterRowData;
      var mapData = _props4.mapData;
      var sortData = _props4.sortData;
      var rowFilter = _props4.rowFilter;
      var sortRows = _props4.sortRows;
      var mapDataToStatus = _props4.mapDataToStatus;
      var mapStatusToActions = _props4.mapStatusToActions;
      var mapLateProps = _props4.mapLateProps;
      var earlyProps = _props4.earlyProps;

      var childProps = _objectWithoutProperties(_props4, ['rowData', 'columnData', 'filterRowData', 'mapData', 'sortData', 'rowFilter', 'sortRows', 'mapDataToStatus', 'mapStatusToActions', 'mapLateProps', 'earlyProps']);

      var filterState = this.state.filterState;


      var filteredData = filterRowData && filterState ? filterRowData(rowData, filterState) : rowData;

      var rawData = mapData(filteredData, columnData, this.access);
      var data = sortData ? sortData(rawData, this.access) : rawData;
      var status = mapDataToStatus(data, this.access);
      var actions = mapStatusToActions(status, this.access);
      var lateProps = mapLateProps ? mapLateProps({ earlyProps: earlyProps, status: status, actions: actions }) : null;

      return React.createElement(Pager, _extends({}, childProps, {
        earlyProps: earlyProps,
        lateProps: lateProps,
        status: status,
        actions: actions
      }));
    }
  });

  var Pager = pure({ displayName: 'Pager',
    defaultProps: defaults,
    render: function render() {
      var _props5 = this.props;
      var children = _props5.children;
      var data = _props5.data;
      var content = _props5.content;

      var childProps = _objectWithoutProperties(_props5, ['children', 'data', 'content']);

      var status = childProps.status;
      var actions = childProps.actions;
      var styles = childProps.styles;
      var theme = childProps.theme;


      return children(_extends({}, childProps, { Controls: function Controls(props) {
          return React.createElement(PagerControls, _extends({}, props, childProps, { content: content }));
        },
        Select: function Select(props) {
          return React.createElement(PagerSelect, _extends({}, props, childProps, { content: content }));
        },
        RowsPerPage: function RowsPerPage(props) {
          return React.createElement(PagerRowsPerPage, _extends({}, props, childProps, { content: content }));
        },
        PageStatus: function PageStatus(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'pagerPageStatus', Content: content.PageStatus, ContentMobile: content.PageStatusMobile }));
        },
        RowStatus: function RowStatus(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'pagerRowStatus', Content: content.RowStatus, ContentMobile: content.RowStatusMobile }));
        },
        RowCount: function RowCount(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'pagerRowCount', Content: content.RowCount, ContentMobile: content.RowCountMobile }));
        }
      }));
    }
  });

  var PagerControls = pure({ displayName: 'PagerControls',
    defaultProps: defaults,
    render: function render() {
      var _props6 = this.props;
      var children = _props6.children;
      var status = _props6.status;
      var actions = _props6.actions;
      var content = _props6.content;
      var styles = _props6.styles;
      var theme = _props6.theme;

      var buttonClass = (0, _classnames2.default)(styles.pagerButton, theme.pagerButton);
      return React.createElement(
        'span',
        { className: (0, _classnames2.default)(styles.pagerControls, theme.pagerControls) },
        React.createElement(
          'button',
          { onClick: actions.fastBackward, className: buttonClass, disabled: status.get('page') === 0 },
          React.createElement(content.FastBackward, this.props)
        ),
        ' ',
        React.createElement(
          'button',
          { onClick: actions.stepBackward, className: buttonClass, disabled: status.get('page') === 0 },
          React.createElement(content.StepBackward, this.props)
        ),
        ' ',
        children ? React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.pagerControlsChildren, theme.pagerControlsChildren) },
          children
        ) : null,
        ' ',
        React.createElement(
          'button',
          { onClick: actions.stepForward, className: buttonClass, disabled: status.get('page') === status.get('pages') - 1 },
          React.createElement(content.StepForward, this.props)
        ),
        ' ',
        React.createElement(
          'button',
          { onClick: actions.fastForward, className: buttonClass, disabled: status.get('page') === status.get('pages') - 1 },
          React.createElement(content.FastForward, this.props)
        )
      );
    }
  });

  var PagerSelect = pure({ displayName: 'PagerSelect',
    defaultProps: defaults,
    render: function render() {
      var _this4 = this;

      var _props7 = this.props;
      var status = _props7.status;
      var actions = _props7.actions;
      var content = _props7.content;
      var styles = _props7.styles;
      var theme = _props7.theme;

      return typeof status.get('rowsPerPage') === 'number' && status.get('rowsPerPage') > 0 ? React.createElement(
        'select',
        {
          value: status.get('page'),
          onChange: function onChange(x) {
            return actions.select(parseInt(x.target.value));
          },
          className: (0, _classnames2.default)(styles.pagerSelect, theme.pagerSelect)
        },
        Array.from(Array(status.get('pages')).keys()).map(function (x) {
          return React.createElement(
            'option',
            { key: x, value: x },
            content.selectOption(_extends({}, _this4.props, { index: x }))
          );
        })
      ) : React.createElement(
        'span',
        null,
        'All'
      );
    }
  });

  var PagerRowsPerPage = pure({ displayName: 'PagerRowsPerPage',
    defaultProps: defaults,
    render: function render() {
      var _this5 = this;

      var _props8 = this.props;
      var label = _props8.label;
      var status = _props8.status;
      var actions = _props8.actions;
      var content = _props8.content;
      var styles = _props8.styles;
      var theme = _props8.theme;

      return React.createElement(
        'span',
        { className: (0, _classnames2.default)(styles.pagerRowsPerPage, theme.pagerRowsPerPage) },
        label ? React.createElement(
          'label',
          { className: (0, _classnames2.default)(desktopStyles) },
          label
        ) : null,
        ' ',
        React.createElement(
          'select',
          {
            value: status.get('rowsPerPage'),
            onChange: function onChange(x) {
              var value = x.target.value;

              if (typeof value === 'string' && value.toLowerCase() === 'all') actions.rowsPerPage(value);else actions.rowsPerPage(parseInt(value));
            },
            className: (0, _classnames2.default)(styles.pagerSelect, theme.pagerSelect)
          },
          status.get('rowsPerPageOptions').map(function (x) {
            return React.createElement(
              'option',
              { key: x, value: x },
              content.rowsPerPageOption(_extends({}, _this5.props, { index: x }))
            );
          })
        )
      );
    }
  });

  var PagerStatus = pure({ displayName: 'PagerStatus',
    defaultProps: defaults,
    render: function render() {
      var _props9 = this.props;
      var styleName = _props9.styleName;
      var Content = _props9.Content;
      var ContentMobile = _props9.ContentMobile;
      var className = _props9.className;
      var status = _props9.status;
      var actions = _props9.actions;
      var content = _props9.content;
      var styles = _props9.styles;
      var theme = _props9.theme;

      return React.createElement(
        'span',
        { className: (0, _classnames2.default)(styles[styleName], theme[styleName]) },
        React.createElement(Content, this.props),
        React.createElement(ContentMobile, this.props)
      );
    }
  });
  return PagerContext;
}