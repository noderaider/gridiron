'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxGridCore = require('redux-grid-core');

var should = require('chai').should();

var enabledButtonStyle = { cursor: 'pointer'
};

exports.default = function (_ref) {
  var React = _ref.React;

  var Resize = function Resize(props) {
    return React.createElement(
      'div',
      null,
      props.isMaximized ? React.createElement(
        'button',
        { style: enabledButtonStyle, onClick: props.onCompress },
        React.createElement('i', { className: 'fa fa-compress' })
      ) : React.createElement(
        'button',
        { style: enabledButtonStyle, onClick: props.onMaximize },
        React.createElement('i', { className: 'fa fa-expand' })
      )
    );
  };
  Resize.propTypes = _reduxGridCore.Resize.PropTypes(React);
  Resize.defaultProps = _reduxGridCore.Resize.DefaultProps(React);
  return Resize;
};