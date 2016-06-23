'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = gridMonitorButton;

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

var _brighten = require('./brighten');

var _brighten2 = _interopRequireDefault(_brighten);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = { base: { cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: 3,
    padding: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
    flexGrow: 1,
    display: 'inline-block',
    fontSize: '0.8em',
    color: 'white',
    textDecoration: 'none'
  }
};

function gridMonitorButton(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  return function (_Component) {
    _inherits(GridMonitorButton, _Component);

    function GridMonitorButton(props) {
      _classCallCheck(this, GridMonitorButton);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GridMonitorButton).call(this, props));

      _this.shouldComponentUpdate = _function2.default;

      _this.handleMouseEnter = function () {
        return _this.setState({ hovered: true });
      };

      _this.handleMouseLeave = function () {
        return _this.setState({ hovered: false });
      };

      _this.handleMouseDown = function () {
        return _this.setState({ active: true });
      };

      _this.handleMouseUp = function () {
        return _this.setState({ active: false });
      };

      _this.onClick = function () {
        if (!_this.props.enabled) return;
        if (_this.props.onClick) _this.props.onClick();
      };

      _this.state = { hovered: false,
        active: false
      };
      return _this;
    }

    _createClass(GridMonitorButton, [{
      key: 'render',
      value: function render() {
        var style = _extends({}, styles.base, { backgroundColor: this.props.theme.base02
        });
        if (this.props.enabled && this.state.hovered) {
          style = _extends({}, style, { backgroundColor: (0, _brighten2.default)(this.props.theme.base02, 0.2)
          });
        }
        if (!this.props.enabled) {
          style = _extends({}, style, { opacity: 0.2,
            cursor: 'text',
            backgroundColor: 'transparent'
          });
        }
        return React.createElement(
          'a',
          { onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            onMouseDown: this.handleMouseDown,
            onMouseUp: this.handleMouseUp,
            onClick: this.onClick,
            style: style },
          this.props.children
        );
      }
    }]);

    return GridMonitorButton;
  }(Component);
}