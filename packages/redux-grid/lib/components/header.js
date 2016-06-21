'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var should = require('chai').should();

exports.default = function (_ref) {
  var React = _ref.React;

  var wrapStyle = { display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  var headerButtonStyle = { border: 0,
    backgroundColor: 'transparent'
  };

  return function (props) {
    return React.createElement(
      'span',
      { style: wrapStyle },
      React.createElement(
        'span',
        null,
        props.children
      ),
      React.createElement(
        'span',
        null,
        React.createElement(
          'button',
          { style: headerButtonStyle, onClick: props.handleSort },
          React.createElement('i', { className: 'fa fa-sort-' + (props.asc ? 'asc' : 'desc') })
        ),
        React.createElement(
          'button',
          { style: headerButtonStyle, onClick: props.handleFilter },
          React.createElement('i', { className: 'fa fa-filter' })
        )
      )
    );
  };
};