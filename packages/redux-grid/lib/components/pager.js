'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reduxGridCore = require('redux-grid-core');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

exports.default = function (_ref) {
  var _class, _temp;

  var React = _ref.React;
  var Select = _ref.Select;
  var Component = React.Component;


  return _temp = _class = function (_Component) {
    _inherits(Pager, _Component);

    function Pager(props) {
      _classCallCheck(this, Pager);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pager).call(this, props));

      _this.state = { page: 0, pages: 1 };
      return _this;
    }

    _createClass(Pager, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var children = _props.children;
        var maxRecords = _props.maxRecords;
        var styles = _props.styles;
        var theme = _props.theme;
        var _state = this.state;
        var page = _state.page;
        var pages = _state.pages;

        return children({ state: this.state,
          mapRows: function mapRows(state) {
            //const { page } = this.state
            var rows = _this2.props.mapRows(state);
            var startIndex = page * maxRecords;
            var endIndex = (page + 1) * maxRecords;
            _this2.pages = Math.ceil(rows.length / maxRecords);
            var rowSlice = rows.slice(startIndex, endIndex);
            _this2.startIndex = startIndex;
            _this2.lastIndex = startIndex + rowSlice.length;
            return rowSlice;
          },
          Buttons: function Buttons(props) {
            return React.createElement(
              'span',
              null,
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this2.setState({ page: 0 });
                  }, disabled: page === 0 },
                React.createElement('i', { className: 'fa fa-fast-backward' })
              ),
              ' ',
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this2.setState({ page: page - 1 });
                  }, disabled: page === 0 },
                React.createElement('i', { className: 'fa fa-step-backward' })
              ),
              props.children ? props.children : ' ',
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this2.setState({ page: page + 1 });
                  }, disabled: page === _this2.pages - 1 },
                React.createElement('i', { className: 'fa fa-step-forward' })
              ),
              ' ',
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this2.setState({ page: _this2.pages - 1 });
                  }, disabled: page === _this2.pages - 1 },
                React.createElement('i', { className: 'fa fa-fast-forward' })
              )
            );
          },
          PageSelect: function PageSelect(props) {
            var options = Array.from(Array(_this2.pages).keys()).map(function (x) {
              return { value: x, label: x + 1 };
            });
            //[ { value: 1, label: 'One' }
            //, { value: 2, label: 'Two' }
            //]
            return React.createElement(Select, { className: (0, _classnames2.default)(styles.select, theme.select), options: options, onChange: function onChange(_ref2) {
                var value = _ref2.value;

                console.info('select page', value);
                _this2.setState({ page: value });
              } });
          },
          PageStatus: function PageStatus(props) {
            return React.createElement(
              'span',
              null,
              'Page ',
              page + 1,
              ' of ',
              _this2.pages
            );
          },
          RowStatus: function RowStatus(props) {
            return React.createElement(
              'span',
              null,
              'Showing rows ',
              _this2.startIndex + 1,
              ' through ',
              _this2.lastIndex
            );
          }
        });
      }
    }]);

    return Pager;
  }(Component), _class.propTypes = _reduxGridCore.Pager.PropTypes(React), _class.defaultProps = _reduxGridCore.Pager.DefaultProps(React), _temp;
};