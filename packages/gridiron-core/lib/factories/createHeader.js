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

  var SortIcon = function SortIcon(_ref2) {
    var direction = _ref2.direction;

    var sortClass = 'fa fa-sort';
    if (direction === 'asc' || direction === 'desc') sortClass += '-' + direction;

    return React.createElement('i', { className: sortClass });
  };

  var desc = {
    init: function init() {
      var _props = this.props;
      var checked = _props.checked;
      var sort = _props.sort;

      this.state = { checked: checked };
    },
    _handleChecked: function _handleChecked(e) {
      this.setState({ checked: e.target.checked });
    },
    reset: function reset(_ref3, cb) {
      var props = _ref3.props;
      var state = _ref3.state;

      if (state && state.checked === false) {
        this.setState({ checked: false }, cb);
      } else cb();
    },
    propTypes: Core.PropTypes(React),
    defaultProps: Core.DefaultProps(React),
    render: function render() {
      var _props2 = this.props;
      var id = _props2.id;
      var children = _props2.children;
      var styles = _props2.styles;
      var theme = _props2.theme;
      var filter = _props2.filter;
      var checkbox = _props2.checkbox;
      var radio = _props2.radio;
      var status = _props2.status;
      var actions = _props2.actions;


      var sort = status && status.sort ? status.sort : null;

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
          id && sort && sort.cols && sort.cols.includes(id) ? React.createElement(
            'button',
            { onClick: function onClick() {
                return actions.sort(id);
              } },
            React.createElement(SortIcon, { direction: sort.direction && sort.direction[id] })
          ) : null,
          filter ? React.createElement(
            'button',
            { onClick: filter.handle },
            React.createElement('i', { className: 'fa fa-filter' })
          ) : null,
          radio ? React.createElement(
            'span',
            null,
            radio.values.map(function (_ref4, i) {
              var value = _ref4.value;
              var _ref4$checked = _ref4.checked;
              var checked = _ref4$checked === undefined ? false : _ref4$checked;
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