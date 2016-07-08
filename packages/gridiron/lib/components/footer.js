'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gridironCore = require('gridiron-core');

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
  Footer.propTypes = _gridironCore.Footer.PropTypes(React);
  Footer.defaultProps = _gridironCore.Footer.DefaultProps(React);
  return Footer;
};