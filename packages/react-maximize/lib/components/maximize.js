'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = maximize;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function maximize() {
  var _class, _temp;

  var deps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _solvent = (0, _solvent3.default)({ React: 'object', ReactDOM: 'object', ReactGateway: 'object', shallowCompare: 'function', CSSPropertyOperations: 'function' })(deps);

  var React = _solvent.React;
  var ReactDOM = _solvent.ReactDOM;
  var ReactGateway = _solvent.ReactGateway;
  var shallowCompare = _solvent.shallowCompare;
  var CSSPropertyOperations = _solvent.CSSPropertyOperations;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;
  var Gateway = ReactGateway.Gateway;
  var GatewayDest = ReactGateway.GatewayDest;
  var GatewayProvider = ReactGateway.GatewayProvider;


  var Controls = function Controls(props) {
    var isMaximized = props.isMaximized;
    var content = props.content;
    var actions = props.actions;


    return isMaximized() ? React.createElement(
      'button',
      { onClick: function onClick() {
          actions.restore();
        } },
      content.restore
    ) : React.createElement(
      'button',
      { onClick: function onClick() {
          actions.maximize();
        } },
      content.maximize
    );
  };

  var contentShape = { maximize: PropTypes.any.isRequired,
    restore: PropTypes.any.isRequired
  };
  var propTypes = { children: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
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
      minHeight: '100vh'
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

  return _temp = _class = function (_Component) {
    _inherits(Maximize, _Component);

    function Maximize(props) {
      _classCallCheck(this, Maximize);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Maximize).call(this, props));

      _this.state = { maximized: [],
        containers: [],
        isMaximized: false,
        containerClass: null,
        containerStyle: null,
        lastScroll: { x: 0, y: 0 }
      };
      _this.containers = [];
      return _this;
    }

    _createClass(Maximize, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.parentNode = this.gateway.parentNode;
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }
      /*
      componentDidUpdate(prevProps, prevState) {
        const { isMaximized } = this.state
        if(prevState.isMaximized !== isMaximized) {
          if(isMaximized) {
            this.setState({ lastScroll: { x: window.scrollX, y: window.scrollY } })
            window.scrollTo(0, 0)
          } else {
            const { lastScroll } = this.state
            window.scrollTo(lastScroll.x, lastScroll.y)
            this.setState({ lastScroll: { x: 0, y: 0 } })
          }
        }
      }
      */

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
        var maximized = _state.maximized;


        var container = function container() {
          var id = _this2.containers.length;
          _this2.containers.push(id);
          console.warn('creating container with ID: ' + id);
          return function (props) {
            var gatewayName = id + '-page';
            var isMaximized = function isMaximized() {
              return maximized.includes(id);
            };
            var actions = { maximize: function maximize() {
                return _this2.setState({ maximized: maximized.concat(id) });
              },
              restore: function restore() {
                return _this2.setState({ maximized: maximized.slice(0, -1) });
              }
            };
            var controls = React.createElement(Controls, {
              isMaximized: isMaximized,
              actions: actions,
              content: _this2.props.content
            });

            return React.createElement(
              'div',
              null,
              'ID WITH ',
              id,
              React.createElement(GatewayDest, { name: gatewayName }),
              React.createElement(
                Gateway,
                { into: maximized.includes(id) ? 'maximize' : gatewayName },
                props.children({ controls: controls })
              )
            );
          };
        };

        return React.createElement(
          GatewayProvider,
          { ref: function ref(x) {
              return _this2.gateway = x;
            } },
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { style: { border: '1px dashed yellow' } },
              children({ container: container })
            ),
            React.createElement(
              'div',
              {
                style: _extends({}, this.props.containerStyle, this.props.style, { border: '1px dashed red', display: maximized.length > 0 ? 'block' : 'none' }),
                className: (0, _classnames2.default)(this.props.styles.maximize, this.props.className) },
              React.createElement('div', {
                style: this.props.backgroundStyle
                //onClick={actions.restore}
              }),
              React.createElement(GatewayDest, { name: 'maximize' })
            )
          )
        );
      }
    }]);

    return Maximize;
  }(Component), _class.propTypes = propTypes, _class.defaultProps = defaultProps, _temp;
}