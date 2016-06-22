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
  var expanderButtonStyle = { border: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer'
  };

  var Expander = function Expander(props) {
    return React.createElement(
      'span',
      { style: wrapStyle },
      props.visible ? React.createElement(
        'span',
        null,
        React.createElement(
          'button',
          { style: expanderButtonStyle, onClick: props.handleExpand },
          React.createElement('i', { className: 'fa fa-' + (props.expanded ? 'minus' : 'plus') + '-square' })
        )
      ) : null
    );
  };
  Expander.propTypes = _reduxGridCore.Expander.PropTypes(React);
  Expander.defaultProps = _reduxGridCore.Expander.DefaultProps(React);
  return Expander;
};