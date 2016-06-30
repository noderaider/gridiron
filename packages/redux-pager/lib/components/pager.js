'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = pager;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function pager() {
  var _this = this,
      _class,
      _temp;

  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object', connect: 'function' }, defaults = {})(deps);

  var React = _solvent.React;
  var connect = _solvent.connect;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  var PagerComponents = function PagerComponents(props) {
    var children = props.children;
    var state = props.state;
    var rows = props.rows;
    var page = props.page;
    var pages = props.pages;
    var maxRecords = props.maxRecords;
    var startIndex = props.startIndex;
    var lastIndex = props.lastIndex;
    var styles = props.styles;
    var theme = props.theme;
    var pageFirst = props.pageFirst;
    var pageBack = props.pageBack;
    var pageForward = props.pageForward;
    var pageLast = props.pageLast;
    var selectPage = props.selectPage;

    return children({ state: state,
      rows: rows,
      Buttons: function Buttons(props) {
        return React.createElement(
          'span',
          null,
          React.createElement(
            'button',
            { onClick: pageFirst, disabled: page === 0 },
            React.createElement('i', { className: 'fa fa-fast-backward' })
          ),
          ' ',
          React.createElement(
            'button',
            { onClick: pageBack, disabled: page === 0 },
            React.createElement('i', { className: 'fa fa-step-backward' })
          ),
          ' ',
          props.children ? props.children : null,
          ' ',
          React.createElement(
            'button',
            { onClick: pageForward, disabled: page === pages - 1 },
            React.createElement('i', { className: 'fa fa-step-forward' })
          ),
          ' ',
          React.createElement(
            'button',
            { onClick: pageLast, disabled: page === pages - 1 },
            React.createElement('i', { className: 'fa fa-fast-forward' })
          )
        );
      },
      PageSelect: function PageSelect(props) {
        var options = Array.from(Array(_this.pages).keys()).map(function (x) {
          return { value: x, label: x + 1 };
        });
        return React.createElement(
          'span',
          null,
          React.createElement(
            'label',
            null,
            'Page:'
          ),
          React.createElement(
            'select',
            { value: page + 1, onChange: function onChange(x) {
                return selectPage(x.target.value - 1);
              } },
            React.createElement(
              'option',
              { value: 1 },
              '1'
            ),
            React.createElement(
              'option',
              { value: 2 },
              '2'
            ),
            React.createElement(
              'option',
              { value: 3 },
              '3'
            )
          )
        );
      },
      PageStatus: function PageStatus(props) {
        return React.createElement(
          'span',
          null,
          'Page ',
          page + 1,
          ' of ',
          pages
        );
      },
      RowStatus: function RowStatus(props) {
        return React.createElement(
          'span',
          null,
          'Showing rows ',
          startIndex + 1,
          ' through ',
          lastIndex
        );
      }
    });
  };

  return _temp = _class = function (_Component) {
    _inherits(Pager, _Component);

    function Pager(props) {
      _classCallCheck(this, Pager);

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Pager).call(this, props));

      _this2.state = { page: 0,
        pages: 1
      };
      return _this2;
    }

    _createClass(Pager, [{
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props = this.props;
        var maxRecords = _props.maxRecords;
        var mapRows = _props.mapRows;
        var page = this.state.page;


        var mapStateToProps = function mapStateToProps(state) {
          var rows = mapRows(state);
          var startIndex = page * maxRecords;
          var endIndex = (page + 1) * maxRecords;
          var pages = Math.ceil(rows.length / maxRecords);
          var rowSlice = rows.slice(startIndex, endIndex);
          var lastIndex = startIndex + rowSlice.length;

          console.warn('DATA', page, maxRecords, rowSlice, rows);

          var pageFirst = function pageFirst() {
            return _this3.setState({ page: 0 });
          };
          var pageBack = function pageBack() {
            return _this3.setState({ page: page - 1 });
          };
          var pageForward = function pageForward() {
            return _this3.setState({ page: page + 1 });
          };
          var pageLast = function pageLast() {
            return _this3.setState({ page: pages - 1 });
          };
          var selectPage = function selectPage(x) {
            return _this3.setState({ page: x });
          };

          return { state: _this3.state,
            rows: rowSlice,
            page: page,
            pages: pages,
            startIndex: startIndex,
            lastIndex: lastIndex,
            pageFirst: pageFirst,
            pageBack: pageBack,
            pageForward: pageForward,
            pageLast: pageLast,
            selectPage: selectPage
          };
        };
        var mapDispatchToProps = function mapDispatchToProps(dispatch) {
          return {};
        };
        var ConnectedPager = connect(mapStateToProps, mapDispatchToProps)(PagerComponents);
        return React.createElement(ConnectedPager, this.props);
      }
    }]);

    return Pager;
  }(Component), _class.propTypes = { children: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    maxRecords: PropTypes.number.isRequired,
    mapRows: PropTypes.func.isRequired
  }, _class.defaultProps = _extends({ styles: { pagerControls: 'pagerControls'
    },
    maxRecords: 5
  }, defaults), _temp;
}