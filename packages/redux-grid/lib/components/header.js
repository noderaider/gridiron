'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxGridCore = require('redux-grid-core');

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

  var wrapStyle = { display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  var Header = function Header(props) {
    return React.createElement(
      'span',
      { style: wrapStyle, className: props.theme.header },
      React.createElement(
        'span',
        null,
        props.children
      ),
      React.createElement(
        'span',
        null,
        props.hasSort ? React.createElement(
          'button',
          { onClick: props.handleSort },
          React.createElement('i', { className: 'fa fa-sort' + sortDirection(props.sortDirection) })
        ) : null,
        props.hasFilter ? React.createElement(
          'button',
          { onClick: props.handleFilter },
          React.createElement('i', { className: 'fa fa-filter' })
        ) : null,
        props.checkbox ? props.checkbox.label ? React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox', id: props.checkbox.id, value: props.checkbox.value, checked: props.checkbox.checked }),
          ' ',
          props.checkbox.label
        ) : React.createElement('input', { type: 'checkbox', id: props.checkbox.id, value: props.checkbox.value, checked: props.checkbox.checked }) : null,
        props.radio ? React.createElement(
          'span',
          null,
          props.radio.values.map(function (_ref2, i) {
            var value = _ref2.value;
            var _ref2$checked = _ref2.checked;
            var checked = _ref2$checked === undefined ? false : _ref2$checked;
            return React.createElement('input', { key: i, type: 'radio', name: props.radio.name, value: value, checked: checked });
          })
        ) : null
      )
    );
  };
  Header.propTypes = _reduxGridCore.Header.PropTypes(React);
  Header.defaultProps = _reduxGridCore.Header.DefaultProps(React);
  return Header;
};