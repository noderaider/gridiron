'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = maximize;

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

  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;


  return _temp = _class = function (_Component) {
    _inherits(Maximize, _Component);

    function Maximize(props) {
      _classCallCheck(this, Maximize);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Maximize).call(this, props));

      _this.maximize = function (id) {
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

      _this.restore = function (id) {
        var _this$props2 = _this.props;
        var styles = _this$props2.styles;
        var restoreDelay = _this$props2.restoreDelay;

        _this.setState({ containerClass: styles.restore });
        setTimeout(function () {
          _this.parentNode.appendChild(_this.container);
          _this.setState({ isMaximized: false, containerClass: null, containerStyle: null });
        }, restoreDelay);
      };

      _this.containers = new Map();
      _this.state = { isMaximized: false,
        containerClass: null,
        containerStyle: null,
        lastScroll: { x: 0, y: 0 },
        maximized: []
      };
      return _this;
    }

    _createClass(Maximize, [{
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
      key: 'renderBlah',
      value: function renderBlah() {
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
              return isMaximized ? _this2.restore() : null;
            }
          }),
          this.renderChildren()
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props2 = this.props;
        var children = _props2.children;
        var maximizeContent = _props2.maximizeContent;
        var restoreContent = _props2.restoreContent;
        var styles = _props2.styles;
        var isMaximized = this.state.isMaximized;


        var childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' };
        var Container = function Container(props) {
          var id = _this3.containers.size;
          var getState = function getState() {
            return _this3.containers.get(id);
          };
          var isMaximized = function isMaximized() {
            return _this3.state.maximized.includes(id);
          };
          var maximize = function maximize() {
            return _this3.setState({ maximized: _this3.state.maximized.concat(id) });
          };
          var restore = function restore() {
            return _this3.setState({ maximized: _this3.state.maximized.slice(0, -1) });
          };
          var actions = { maximize: maximize, restore: restore, isMaximized: isMaximized };

          var Controls = function Controls(props) {
            return isMaximized() ? React.createElement(
              'button',
              { onClick: actions.restore },
              restoreContent
            ) : React.createElement(
              'button',
              { onClick: actions.maximize },
              maximizeContent
            );
          };

          var child = props.children({ Controls: Controls });
          _this3.containers.set(id, { actions: actions, child: child });
          return !isMaximized() || props.maximized ? child : null;
        };
        /*
        Container.propTypes = { id: PropTypes.number.isRequired
                              , mirror: PropTypes.bool.isRequired
                              }
        Container.defaultProps =  { mirror: false
                                  }
        */
        var containerStyle = { border: '2px solid black',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0
        };

        var content = children({});

        return React.createElement(
          'div',
          { ref: function ref(x) {
              return _this3.container = x;
            } },
          React.createElement(
            'div',
            { key: 'root', style: { border: '1px dashed yellow' } },
            Content
          ),
          this.state.maximized.length > 0 ? this.state.maximized.map(function (id) {
            var _containers$get = _this3.containers.get(id);

            var actions = _containers$get.actions;
            var child = _containers$get.child;

            return React.createElement(
              'div',
              { key: id,
                style: _extends({}, _this3.props.containerStyle, _this3.props.style),
                className: (0, _classnames2.default)(_this3.props.styles.maximize, _this3.props.className) },
              React.createElement('div', {
                style: _this3.props.backgroundStyle,
                onClick: actions.restore
              }),
              child
            );
          }) : null
        );
      }
    }]);

    return Maximize;
  }(Component), _class.propTypes = { children: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    styles: PropTypes.object.isRequired,
    containerStyle: PropTypes.object.isRequired,
    backgroundStyle: PropTypes.object.isRequired,
    maximizeContent: PropTypes.object.isRequired,
    restoreContent: PropTypes.object.isRequired,
    maximizeDelay: PropTypes.number.isRequired,
    restoreDelay: PropTypes.number.isRequired
  }, _class.defaultProps = _extends({ styles: { maximize: 'maximize',
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
    maximizeContent: React.createElement('i', { className: 'fa fa-expand' }),
    restoreContent: React.createElement('i', { className: 'fa fa-compress' }),
    maximizeDelay: 200,
    restoreDelay: 200,
    zIndexMin: 100
  }, defaults), _temp;
  /*
  renderContent = () => {
    }
  */
}