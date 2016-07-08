'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _gridironCore = require('gridiron-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

exports.default = function (_ref) {
  var React = _ref.React;

  var wrapStyle = { display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
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
          React.createElement('i', { className: (0, _classnames2.default)('fa fa-' + (props.expanded ? 'minus' : 'plus') + '-square', props.theme.expander) })
        )
      ) : null
    );
  };
  Expander.propTypes = _gridironCore.Expander.PropTypes(React);
  Expander.defaultProps = _gridironCore.Expander.DefaultProps(React);
  return Expander;
};