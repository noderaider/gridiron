'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = pager;

var _reactStamp2 = require('react-stamp');

var _reactStamp3 = _interopRequireDefault(_reactStamp2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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


  function composePure() {
    for (var _len = arguments.length, desc = Array(_len), _key = 0; _key < _len; _key++) {
      desc[_key] = arguments[_key];
    }

    return compose.apply(undefined, [{ displayName: 'PureComponent',
      shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }
    }].concat(desc));
  }

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
    createSortKeys: PropTypes.func.isRequired,
    createSortKeyComparator: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.any.isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
    typeSingular: PropTypes.string.isRequired,
    typePlural: PropTypes.string.isRequired,
    content: PropTypes.shape(contentShape).isRequired
  };

  var defaultProps = _extends({ styles: { controls: 'pagerControls',
      controlsChildren: 'pagerControlsChildren',
      control: 'pagerControl',
      select: 'pagerSelect'
    },
    theme: {},
    sort: Immutable.Map({ cols: Immutable.List(['id', 'key']),
      keys: Immutable.Map({ id: function id(data) {
          return data;
        } }),
      direction: Immutable.Map({ id: 'asc', key: 'desc' })
    })
    /** CREATES SORT KEYS FOR A ROW */
    , createSortKeys: function createSortKeys(cellData, sort) {
      return sort.get('cols').filter(function (colID) {
        return typeof sort.getIn(['direction', colID]) === 'string';
      }).map(function (colID) {
        var sortKey = sort.getIn(['keys', colID], null);
        var cellDatum = cellData[colID];
        var currentKey = sortKey ? sortKey(cellDatum) : cellDatum;
        return typeof currentKey === 'string' ? currentKey : currentKey.toString();
      });
    }
    /** COMPARES SORT KEYS OF TWO ROWS */
    , createSortKeyComparator: function createSortKeyComparator(sort) {
      var multipliers = sort.get('direction') ? sort.get('cols').map(function (colID) {
        return sort.getIn(['direction', colID]) === 'desc' ? -1 : 1;
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
          null,
          'Page ',
          (status.get('page') + 1).toLocaleString(),
          ' of ',
          status.get('pages')
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
          (status.get('startIndex') + 1).toLocaleString(),
          ' through ',
          status.get('lastIndex').toLocaleString(),
          ' (',
          status.get('totalRows').toLocaleString(),
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
          status.get('totalRows') === 1 ? props.typeSingular : props.typePlural
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

  /** PRE REDUX (CONFIG) */
  var PagerContext = composePure({ displayName: 'PagerContext',
    propTypes: propTypes,
    defaultProps: defaultProps,
    render: function render() {
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
        }
        /** CALLED BY FILTER STREAM */
        , filterRowData: function filterRowData(rowData, filterState) {
          if (filterState) {
            var anyFiltered = false;
            var newRowData = rowData.entrySeq().filter(function (_ref10) {
              var _ref11 = _slicedToArray(_ref10, 2);

              var id = _ref11[0];
              var datum = _ref11[1];

              var value = Object.keys(filterState).some(function (filterID) {
                return filterState[filterID](id) === true;
              });

              if (value) anyFiltered = true;
              return value;
            }).reduce(function (filtered, x) {
              return _extends({}, filtered, _defineProperty({}, x, rowData[x]));
            }, {});
            return anyFiltered ? newRowData : rowData;
          }
          return rowData;
        }
        /** MAP CELL AND SORT DATA AND ADD TO DATA CONSTRUCT */
        , mapData: function mapData(rowData, access) {
          var rows = rowData.map(function (rowDatum, rowID) {
            var cellData = map.cellData(rowID, rowDatum);
            var sortKeys = createSortKeys(cellData, access.sort);
            return Immutable.Map({ rowDatum: rowDatum, cellData: cellData, sortKeys: sortKeys });
          });
          var columns = rows.first().get('cellData').keySeq();
          return Immutable.Map({ rows: rows, columns: columns });
        },
        sortData: function sortData(data, access) {
          var comparator = createSortKeyComparator(access.sort);
          return data.set('rows', data.get('rows').sortBy(function (context, rowID) {
            return context.get('sortKeys');
          }, comparator));
        },
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
              var direction = sort.get('direction', new Immutable.Map()).set(id, newDirection);
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
  })(composePure({ displayName: 'PagerDataFilter',
    propTypes: { state: PropTypes.object.isRequired,
      mapStateToRowData: PropTypes.func.isRequired,
      filterStream: PropTypes.func.isRequired,
      filterRowData: PropTypes.func.isRequired
    },
    defaultProps: { filterRowData: function filterRowData(rowData, filterState) {
        return rowData;
      }
    },
    state: { rowData: null
    },

    componentWillMount: function componentWillMount() {
      var _this = this;

      var _props2 = this.props;
      var mapStateToRowData = _props2.mapStateToRowData;
      var filterStream = _props2.filterStream;
      var filterRowData = _props2.filterRowData;
      var Filter = _props2.Filter;


      var getRowData = function getRowData() {
        return mapStateToRowData(_this.props.state);
      };

      /*
              this.filterContent = Object.keys(filters).reduce((rendered, id) => {
                return ({ ...rendered, [id]: <Filter id={id} rowData={getRowData()} /> })
              }, {})
              */

      var onFilter = function onFilter(filterState) {
        var rowData = filterRowData(getRowData(), filterState);
        _this.setState({ rowData: rowData });
      };
      this.unsubscribe = filterStream(onFilter);

      this.setState({ rowData: getRowData() });
    },
    componentWillUnmount: function componentWillUnmount() {
      this.unsubscribe();
    },
    render: function render() {
      var _props3 = this.props;
      var rowData = _props3.rowData;
      var mapStateToRowData = _props3.mapStateToRowData;
      var filterRows = _props3.filterRows;

      var childProps = _objectWithoutProperties(_props3, ['rowData', 'mapStateToRowData', 'filterRows']);

      return React.createElement(PagerRowFilter, _extends({}, childProps, {
        rowData: this.state.rowData
        //filterContent={this.filterContent}
      }));
    }
  }));

  var PagerRowFilter = composePure({ displayName: 'PagerRowFilter',
    propTypes: { rowData: PropTypes.object.isRequired,
      mapData: PropTypes.func.isRequired,
      sortData: PropTypes.func.isRequired,
      mapDataToStatus: PropTypes.func.isRequired,
      mapStatusToActions: PropTypes.func.isRequired
      //, mapCols: PropTypes.func.isRequired
    },
    state: { status: Immutable.Map(),
      data: null
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
      this._processData = function (rowData) {
        var _props4 = _this2.props;
        var mapData = _props4.mapData;
        var sortData = _props4.sortData;

        var data = mapData(rowData, _this2.access);
        return sortData(data, _this2.access);
      };
    },
    componentWillMount: function componentWillMount() {
      var data = this._processData(this.props.rowData);
      this.setState({ data: data });
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var data = this._processData(nextProps.data);
      this.setState({ data: data });
    },
    render: function render() {
      var _props5 = this.props;
      var rowData = _props5.rowData;
      var mapData = _props5.mapData;
      var rowFilter = _props5.rowFilter;
      var sortRows = _props5.sortRows;
      var mapDataToStatus = _props5.mapDataToStatus;
      var mapStatusToActions = _props5.mapStatusToActions;

      var childProps = _objectWithoutProperties(_props5, ['rowData', 'mapData', 'rowFilter', 'sortRows', 'mapDataToStatus', 'mapStatusToActions']);

      var status = mapDataToStatus(this.state.data, this.access);
      var actions = mapStatusToActions(status, this.access);
      /*const cols = mapCols( { status
                            , actions
                            //, filters: filterContent
                            } )
                            */

      return React.createElement(Pager, _extends({}, childProps, {
        status: status,
        actions: actions
        //cols={cols}
      }));
    }
  });

  var Pager = composePure({
    render: function render() {
      var _props6 = this.props;
      var children = _props6.children;
      var cols = _props6.cols;
      var data = _props6.data;

      var childProps = _objectWithoutProperties(_props6, ['children', 'cols', 'data']);

      var status = childProps.status;
      var actions = childProps.actions;
      var content = childProps.content;
      var styles = childProps.styles;
      var theme = childProps.theme;


      return children({ status: status
        //, cols
        , actions: actions,
        Controls: function Controls(props) {
          return React.createElement(PagerControls, _extends({}, props, childProps));
        },
        Select: function Select(props) {
          return React.createElement(PagerSelect, _extends({}, props, childProps));
        },
        RowsPerPage: function RowsPerPage(props) {
          return React.createElement(PagerRowsPerPage, _extends({}, props, childProps));
        },
        PageStatus: function PageStatus(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'pageStatus', Content: content.PageStatus }));
        },
        RowStatus: function RowStatus(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'rowStatus', Content: content.RowStatus }));
        },
        RowCount: function RowCount(props) {
          return React.createElement(PagerStatus, _extends({}, props, childProps, { styleName: 'rowCount', Content: content.RowCount }));
        }
      });
    }
  });

  var PagerControls = composePure({
    render: function render() {
      var _props7 = this.props;
      var children = _props7.children;
      var status = _props7.status;
      var actions = _props7.actions;
      var content = _props7.content;
      var styles = _props7.styles;
      var theme = _props7.theme;

      return React.createElement(
        'span',
        { className: (0, _classnames2.default)(styles.controls) },
        React.createElement(
          'button',
          { onClick: actions.fastBackward, className: (0, _classnames2.default)(styles.control), disabled: status.get('page') === 0 },
          React.createElement(content.FastBackward, this.props)
        ),
        ' ',
        React.createElement(
          'button',
          { onClick: actions.stepBackward, className: (0, _classnames2.default)(styles.control), disabled: status.get('page') === 0 },
          React.createElement(content.StepBackward, this.props)
        ),
        ' ',
        children ? React.createElement(
          'span',
          { className: (0, _classnames2.default)(styles.controlsChildren) },
          children
        ) : null,
        ' ',
        React.createElement(
          'button',
          { onClick: actions.stepForward, className: (0, _classnames2.default)(styles.control), disabled: status.get('page') === status.get('pages') - 1 },
          React.createElement(content.StepForward, this.props)
        ),
        ' ',
        React.createElement(
          'button',
          { onClick: actions.fastForward, className: (0, _classnames2.default)(styles.control), disabled: status.get('page') === status.get('pages') - 1 },
          React.createElement(content.FastForward, this.props)
        )
      );
    }
  });

  var PagerSelect = composePure({
    render: function render() {
      var _this3 = this;

      var _props8 = this.props;
      var status = _props8.status;
      var actions = _props8.actions;
      var content = _props8.content;
      var styles = _props8.styles;
      var theme = _props8.theme;

      return typeof status.get('rowsPerPage') === 'number' && status.get('rowsPerPage') > 0 ? React.createElement(
        'select',
        {
          value: status.get('page'),
          onChange: function onChange(x) {
            return actions.select(parseInt(x.target.value));
          },
          className: (0, _classnames2.default)(styles.select, theme.select)
        },
        Array.from(Array(status.get('pages')).keys()).map(function (x) {
          return React.createElement(
            'option',
            { key: x, value: x },
            content.selectOption(_extends({}, _this3.props, { index: x }))
          );
        })
      ) : React.createElement(
        'span',
        null,
        'All'
      );
    }
  });

  var PagerRowsPerPage = composePure({
    render: function render() {
      var _this4 = this;

      var _props9 = this.props;
      var label = _props9.label;
      var status = _props9.status;
      var actions = _props9.actions;
      var content = _props9.content;
      var styles = _props9.styles;
      var theme = _props9.theme;

      return React.createElement(
        'span',
        null,
        label ? React.createElement(
          'label',
          null,
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
            className: (0, _classnames2.default)(styles.select, theme.select)
          },
          status.get('rowsPerPageOptions').map(function (x) {
            return React.createElement(
              'option',
              { key: x, value: x },
              content.rowsPerPageOption(_extends({}, _this4.props, { index: x }))
            );
          })
        )
      );
    }
  });

  var PagerStatus = composePure({
    render: function render() {
      var _props10 = this.props;
      var styleName = _props10.styleName;
      var Content = _props10.Content;
      var className = _props10.className;
      var status = _props10.status;
      var actions = _props10.actions;
      var content = _props10.content;
      var styles = _props10.styles;
      var theme = _props10.theme;

      return React.createElement(
        'span',
        { className: (0, _classnames2.default)(styles[styleName], theme[styleName]) },
        React.createElement(Content, this.props)
      );
    }
  });
  return PagerContext;
}