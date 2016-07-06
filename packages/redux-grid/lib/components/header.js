'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reduxGridCore = require('redux-grid-core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

var sortDirection = function sortDirection(value) {
  switch (value) {
    case 'asc':
      return '-asc';
    case 'desc':
      return '-desc';
    default:
      return '';
  }
};

exports.default = function (_ref) {
  var React = _ref.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var wrapStyle = { display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header(props) {
      _classCallCheck(this, Header);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Header).call(this, props));

      _this.handleChecked = function () {
        _this.setState({ checked: !_this.state.checked });
      };

      _this.state = { checked: false };

      return _this;
    }

    _createClass(Header, [{
      key: 'componentWillUpdate',
      value: function componentWillUpdate() {
        var handleUpdate = this.props.handleUpdate;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (handleUpdate) handleUpdate.apply(undefined, [this].concat(args));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var children = _props.children;
        var styles = _props.styles;
        var theme = _props.theme;
        var sort = _props.sort;
        var filter = _props.filter;
        var checkbox = _props.checkbox;
        var radio = _props.radio;


        return React.createElement(
          'span',
          { style: wrapStyle, className: theme.header },
          React.createElement(
            'span',
            null,
            children
          ),
          React.createElement(
            'span',
            null,
            sort ? React.createElement(
              'button',
              { onClick: sort.handle },
              React.createElement('i', { className: 'fa fa-sort' + sortDirection(sort.direction) })
            ) : null,
            filter ? React.createElement(
              'button',
              { onClick: filter.handle },
              React.createElement('i', { className: 'fa fa-filter' })
            ) : null,
            checkbox ? checkbox.label ? React.createElement(
              'label',
              null,
              React.createElement('input', { type: 'checkbox', id: checkbox.id, onChange: this.handleChecked, value: checkbox.value, checked: checkbox.checked }),
              ' ',
              checkbox.label
            ) : React.createElement('input', { type: 'checkbox', id: checkbox.id, onChange: this.handleChecked, value: checkbox.value, checked: checkbox.checked }) : null,
            radio ? React.createElement(
              'span',
              null,
              radio.values.map(function (_ref2, i) {
                var value = _ref2.value;
                var _ref2$checked = _ref2.checked;
                var checked = _ref2$checked === undefined ? false : _ref2$checked;
                return React.createElement('input', { key: i, type: 'radio', name: radio.name, value: value, checked: checked });
              })
            ) : null
          )
        );
      }
    }]);

    return Header;
  }(Component);

  Header.propTypes = _reduxGridCore.Header.PropTypes(React);
  Header.defaultProps = _reduxGridCore.Header.DefaultProps(React);
  return Header;
};