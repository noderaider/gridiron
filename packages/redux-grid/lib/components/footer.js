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
      { style: wrapStyle, className: props.theme.footer },
      React.createElement(
        'span',
        null,
        props.children
      )
    );
  };
};