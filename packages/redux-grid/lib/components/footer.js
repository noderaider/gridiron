'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxGridCore = require('redux-grid-core');

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
  var footerButtonStyle = { border: 0,
    backgroundColor: 'transparent'
  };

  var Footer = function Footer(props) {
    return React.createElement(
      'span',
      { style: wrapStyle, className: props.theme.footer },
      props.children
    );
  };
  Footer.propTypes = _reduxGridCore.Footer.PropTypes(React);
  Footer.defaultProps = _reduxGridCore.Footer.DefaultProps(React);
  return Footer;
};