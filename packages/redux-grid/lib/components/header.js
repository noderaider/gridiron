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
        ) : null
      )
    );
  };
  Header.propTypes = _reduxGridCore.Header.PropTypes(React);
  Header.defaultProps = _reduxGridCore.Header.DefaultProps(React);
  return Header;
};