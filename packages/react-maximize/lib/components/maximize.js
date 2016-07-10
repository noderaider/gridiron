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

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var _fullscreen = require('../utils/fullscreen');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

function maximize() {
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


  var Container = (0, _container2.default)(deps, defaults);

  var contentShape = { maximize: PropTypes.any.isRequired,
    restore: PropTypes.any.isRequired
  };
  var propTypes = { children: PropTypes.any.isRequired,
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

  var Maximize = function (_Component) {
    _inherits(Maximize, _Component);

    function Maximize(props) {
      _classCallCheck(this, Maximize);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Maximize).call(this, props));

      _this.container = function (children) {
        return React.createElement(
          Container,
          {
            id: function (N) {
              return Array(N + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, N);
            }(5),
            maximize: function maximize(id) {
              return new _bluebird2.default(function (resolve, reject) {
                console.info('MAXIMIZING', id);
                _this.setState({ containers: _this.state.containers.concat(id) }, function () {
                  return resolve();
                });
              });
            },
            restore: function restore(id) {
              return new _bluebird2.default(function (resolve, reject) {
                var containers = _this.state.containers;

                var index = containers.indexOf(id);
                index.should.be.at.least(0, id + ' does not exist in the list of state containers => ' + JSON.stringify(containers));

                var newContainers = [].concat(_toConsumableArray(containers.slice(0, index)), _toConsumableArray(containers.slice(index + 1)));
                console.info('CONTAINER UNREGISTERED', index, id, containers, newContainers);
                _this.setState({ containers: newContainers }, function () {
                  return resolve();
                });
              });
            }
          },
          children
        );
      };

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
        return true;
        //return shallowCompare(this, nextProps, nextState)
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var children = _props.children;
        var containerClass = _props.containerClass;
        var containerStyle = _props.containerStyle;
        var backgroundStyle = _props.backgroundStyle;
        var style = _props.style;
        var className = _props.className;
        var styles = _props.styles;
        var containers = this.state.containers;


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
              null,
              children(this.container)
            ),
            React.createElement(
              'div',
              { ref: function ref(x) {
                  return _this2.fullscreen = x;
                } },
              this.state.containers.map(function (x, i) {
                var destName = 'maximize-' + x;
                return React.createElement(
                  'div',
                  {
                    key: i,
                    style: _extends({}, containerStyle, style, { top: 0 }),
                    className: (0, _classnames2.default)(styles.maximize, className)
                  },
                  React.createElement('div', {
                    style: backgroundStyle
                    //onClick={actions.restore}
                  }),
                  React.createElement(GatewayDest, { name: destName })
                );
              })
            )
          )
        );
      }
    }]);

    return Maximize;
  }(Component);

  Maximize.propTypes = propTypes;
  Maximize.defaultProps = defaultProps;


  return Maximize;
}