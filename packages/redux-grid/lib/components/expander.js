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
  var expanderButtonStyle = { border: 0,
    backgroundColor: 'transparent'
  };

  return function (props) {
    return React.createElement(
      'span',
      { style: wrapStyle },
      React.createElement(
        'span',
        null,
        React.createElement(
          'button',
          { style: expanderButtonStyle, onClick: props.handleExpand },
          React.createElement('i', { className: 'fa fa-' + (props.expanded ? 'minus' : 'plus') + '-square' })
        )
      ),
      React.createElement(
        'span',
        null,
        props.children
      )
    );
  };
};