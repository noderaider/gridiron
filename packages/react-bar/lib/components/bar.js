'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = bar;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function bar() {
  var _class, _temp;

  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  return _temp = _class = function (_Component) {
    _inherits(Bar, _Component);

    function Bar(props) {
      _classCallCheck(this, Bar);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bar).call(this, props));

      _this.maximize = function () {
        var _this$props = _this.props;
        var styles = _this$props.styles;
        var containerStyle = _this$props.containerStyle;
        var maximizeDelay = _this$props.maximizeDelay;

        document.body.appendChild(_this.container);
        _this.setState({ isMaximized: true, containerClass: styles.maximize, containerStyle: containerStyle });
        setTimeout(function () {
          return _this.setState({ containerClass: null });
        }, maximizeDelay);
      };

      _this.compress = function () {
        var _this$props2 = _this.props;
        var styles = _this$props2.styles;
        var compressDelay = _this$props2.compressDelay;

        _this.setState({ containerClass: styles.compress });
        setTimeout(function () {
          _this.parentNode.appendChild(_this.container);
          _this.setState({ isMaximized: false, containerClass: null, containerStyle: null });
        }, compressDelay);
      };

      _this.renderChildren = function () {
        var _this$props3 = _this.props;
        var children = _this$props3.children;
        var maximizeContent = _this$props3.maximizeContent;
        var compressContent = _this$props3.compressContent;
        var styles = _this$props3.styles;
        var isMaximized = _this.state.isMaximized;

        var Controls = function Controls(props) {
          return isMaximized ? React.createElement(
            'button',
            { onClick: _this.compress },
            compressContent
          ) : React.createElement(
            'button',
            { onClick: _this.maximize },
            maximizeContent
          );
        };
        var childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' };
        return React.createElement(
          'div',
          { style: childrenStyle, className: styles.maximizeChildren },
          children({ Controls: Controls })
        );
      };

      _this.state = { isMaximized: false,
        containerClass: null,
        containerStyle: null,
        lastScroll: { x: 0, y: 0 }
      };
      return _this;
    }

    _createClass(Bar, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.parentNode = this.container.parentNode;
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        var isMaximized = this.state.isMaximized;

        if (prevState.isMaximized !== isMaximized) {
          if (isMaximized) {
            this.setState({ lastScroll: { x: window.scrollX, y: window.scrollY } });
            window.scrollTo(0, 0);
          } else {
            var lastScroll = this.state.lastScroll;

            window.scrollTo(lastScroll.x, lastScroll.y);
            this.setState({ lastScroll: { x: 0, y: 0 } });
          }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var children = _props.children;
        var backgroundStyle = _props.backgroundStyle;
        var style = _props.style;
        var className = _props.className;
        var styles = _props.styles;
        var _state = this.state;
        var isMaximized = _state.isMaximized;
        var containerClass = _state.containerClass;
        var containerStyle = _state.containerStyle;


        return React.createElement(
          'div',
          {
            ref: function ref(x) {
              return _this2.container = x;
            },
            className: (0, _classnames2.default)(className, containerClass),
            style: _extends({ style: style }, containerStyle)
          },
          React.createElement('div', {
            style: isMaximized ? backgroundStyle : { display: 'none' },
            onClick: function onClick() {
              return isMaximized ? _this2.compress() : null;
            }
          }),
          this.renderChildren()
        );
      }
    }]);

    return Bar;
  }(Component), _class.propTypes = { children: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    styles: PropTypes.object.isRequired
  }, _class.defaultProps = _extends({ styles: {},
    style: {},
    className: '',
    minimizeContent: React.createElement('i', { className: 'fa fa-expand' }),
    restoreContent: React.createElement('i', { className: 'fa fa-compress' }),
    maximizeDelay: 200,
    compressDelay: 200
  }, defaults), _temp;
}