'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = container;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

var _fullscreen = require('../utils/fullscreen');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function container() {
  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object', ReactDOM: 'object', ReactGateway: 'object', shallowCompare: 'function' })(deps);

  var React = _solvent.React;
  var ReactDOM = _solvent.ReactDOM;
  var ReactGateway = _solvent.ReactGateway;
  var shallowCompare = _solvent.shallowCompare;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;
  var Gateway = ReactGateway.Gateway;
  var GatewayDest = ReactGateway.GatewayDest;
  var GatewayProvider = ReactGateway.GatewayProvider;


  var contentShape = { maximize: PropTypes.any.isRequired,
    restore: PropTypes.any.isRequired
  };

  var propTypes = { /*children: PropTypes.any.isRequired
                    ,*/style: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    styles: PropTypes.object.isRequired,
    containerStyle: PropTypes.object.isRequired,
    backgroundStyle: PropTypes.object.isRequired,
    content: PropTypes.shape(contentShape).isRequired,
    maximizeDelay: PropTypes.number.isRequired,
    restoreDelay: PropTypes.number.isRequired
  };
  var defaultProps = _extends({ styles: { maximize: 'maximize',
      restore: 'restore',
      maximizeContent: 'maximizeContent'
    },
    style: {},
    className: '',
    containerStyle: { position: 'absolute',
      display: 'flex',
      flex: '1 0 auto',
      flexDirection: 'column',
      top: 0,
      left: 0,
      right: 0,
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      color: '#fff'
      //, zIndex: 10
    },
    backgroundStyle: { position: 'fixed',
      display: 'flex',
      flexGrow: '1 0 100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    content: { maximize: React.createElement('i', { className: 'fa fa-expand' }),
      restore: React.createElement('i', { className: 'fa fa-compress' })
    },
    maximizeDelay: 200,
    restoreDelay: 200,
    zIndexMin: 100
  }, defaults);
  var _Controls = function _Controls(_ref) {
    var isMaximized = _ref.isMaximized;
    var actions = _ref.actions;
    return React.createElement(
      'button',
      { onClick: function onClick() {
          return isMaximized ? actions.restore() : actions.maximize();
        } },
      React.createElement('i', { className: 'fa fa-' + (isMaximized ? 'compress' : 'expand') })
    );
  };

  var _Box = function (_Component) {
    _inherits(Box, _Component);

    function Box() {
      _classCallCheck(this, Box);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Box).apply(this, arguments));
    }

    _createClass(Box, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var id = _props.id;
        var isMaximized = _props.isMaximized;
        var children = _props.children;
        var content = _props.content;
        var style = _props.style;
        var className = _props.className;
        var containerStyle = _props.containerStyle;
        var backgroundStyle = _props.backgroundStyle;
        var styles = _props.styles;
        var actions = _props.actions;

        var gatewayName = id + '-page';

        var testStyle = { color: '#fff', width: 600, height: 600, position: 'relative', border: '1px dotted green', bottom: 20, right: 20 };

        var maximizeName = 'maximize-' + id;

        var boxStyle = {}; // position: 'absolute' }

        return React.createElement(
          'div',
          { ref: function ref(x) {
              return _this2.box = x;
            } },
          React.createElement(GatewayDest, { name: gatewayName }),
          React.createElement(
            Gateway,
            { into: isMaximized ? maximizeName : gatewayName },
            React.createElement(
              'div',
              { style: boxStyle },
              children
            )
          )
        );
      }
    }]);

    return Box;
  }(Component);

  _Box.propTypes = propTypes;
  _Box.defaultProps = defaultProps;

  var Container = function (_Component2) {
    _inherits(Container, _Component2);

    function Container(props) {
      _classCallCheck(this, Container);

      var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

      _this3.maximize = function () {
        _this3.props.maximize(_this3.props.id).then(function () {
          return _this3.setState({ isMaximized: true });
        });
      };

      _this3.restore = function () {
        _this3.props.restore(_this3.props.id).then(function () {
          return _this3.setState({ isMaximized: false });
        });
      };

      _this3.state = { isMaximized: false,
        lastScroll: { x: 0, y: 0 }
      };
      return _this3;
    }

    _createClass(Container, [{
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
        var id = this.props.id;
        var isMaximized = this.state.isMaximized;


        var controlProps = _extends({}, this.state, { id: id,
          actions: { maximize: this.maximize, restore: this.restore }
        });

        return this.props.children(_extends({ Controls: function Controls(props) {
            return React.createElement(_Controls, controlProps);
          },
          Box: function Box(props) {
            return React.createElement(_Box, _extends({}, props, controlProps));
          }
        }, controlProps));
      }
    }]);

    return Container;
  }(Component);

  return Container;
}