'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createHeader;

var _Header = require('../Header');

var Core = _interopRequireWildcard(_Header);

var _reactPubSub = require('react-pub-sub');

var _reactPubSub2 = _interopRequireDefault(_reactPubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function createHeader(_ref) {
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

  var leftStyle = { display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center'
  };
  var leftControlStyle = { display: 'flex',
    marginRight: 5
  };
  var childrenStyle = { display: 'flex'
  };

  var pubSub = (0, _reactPubSub2.default)({ React: React });

  var desc = { state: { checked: false },
    _handleChecked: function _handleChecked(e) {
      this.setState({ checked: e.target.checked });
    },
    reset: function reset(_ref2, cb) {
      var props = _ref2.props;
      var state = _ref2.state;

      if (state && state.checked === false) {
        this.setState({ checked: false }, cb);
      } else cb();
    },
    propTypes: Core.PropTypes(React),
    defaultProps: Core.DefaultProps(React),
    render: function render() {
      var _props = this.props;
      var children = _props.children;
      var styles = _props.styles;
      var theme = _props.theme;
      var sort = _props.sort;
      var filter = _props.filter;
      var checkbox = _props.checkbox;
      var radio = _props.radio;
      var checked = this.state.checked;

      return React.createElement(
        'span',
        { style: wrapStyle, className: theme.header },
        React.createElement(
          'span',
          { style: leftStyle },
          React.createElement(
            'span',
            { style: leftControlStyle },
            checkbox ? checkbox.label ? React.createElement(
              'label',
              null,
              React.createElement('input', { type: 'checkbox', id: checkbox.id, onChange: this._handleChecked.bind(this), value: checkbox.value, checked: checked }),
              ' ',
              checkbox.label
            ) : React.createElement('input', { type: 'checkbox', id: checkbox.id, onChange: this._handleChecked.bind(this), value: checkbox.value, checked: checked }) : null
          ),
          React.createElement(
            'span',
            { style: childrenStyle },
            children
          )
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
          radio ? React.createElement(
            'span',
            null,
            radio.values.map(function (_ref3, i) {
              var value = _ref3.value;
              var _ref3$checked = _ref3.checked;
              var checked = _ref3$checked === undefined ? false : _ref3$checked;
              return React.createElement('input', { key: i, type: 'radio', name: radio.name, value: value, checked: checked });
            })
          ) : null
        )
      );
    }
  };
  return function header() {
    var _pubSub = pubSub({ stateNames: ['checked'] });

    var createPub = _pubSub.createPub;
    var createSub = _pubSub.createSub;

    var Header = createPub(desc);
    return { Header: Header, createSub: createSub };
  };
}