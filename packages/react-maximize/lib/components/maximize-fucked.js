'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

  var _solvent = (0, _solvent3.default)({ React: 'object', ReactDOM: 'object', shallowCompare: 'function', CSSPropertyOperations: 'function' })(deps);

  var React = _solvent.React;
  var ReactDOM = _solvent.ReactDOM;
  var shallowCompare = _solvent.shallowCompare;
  var CSSPropertyOperations = _solvent.CSSPropertyOperations;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;


  var KEYCODES = { ESCAPE: 27 };

  var Portal = function (_Component) {
    _inherits(Portal, _Component);

    function Portal() {
      _classCallCheck(this, Portal);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Portal).call(this));

      _this.state = { active: false };
      _this.handleWrapperClick = _this.handleWrapperClick.bind(_this);
      _this.closePortal = _this.closePortal.bind(_this);
      _this.handleOutsideMouseClick = _this.handleOutsideMouseClick.bind(_this);
      _this.handleKeydown = _this.handleKeydown.bind(_this);
      _this.portal = null;
      _this.node = null;
      return _this;
    }

    _createClass(Portal, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.props.closeOnEsc) {
          document.addEventListener('keydown', this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
          document.addEventListener('mouseup', this.handleOutsideMouseClick);
          document.addEventListener('touchstart', this.handleOutsideMouseClick);
        }

        if (this.props.isOpened) {
          this.openPortal();
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps) {
        // portal's 'is open' state is handled through the prop isOpened
        if (typeof newProps.isOpened !== 'undefined') {
          if (newProps.isOpened) {
            if (this.state.active) {
              this.renderPortal(newProps);
            } else {
              this.openPortal(newProps);
            }
          }
          if (!newProps.isOpened && this.state.active) {
            this.closePortal();
          }
        }

        // portal handles its own 'is open' state
        if (typeof newProps.isOpened === 'undefined' && this.state.active) {
          this.renderPortal(newProps);
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.props.closeOnEsc) {
          document.removeEventListener('keydown', this.handleKeydown);
        }

        if (this.props.closeOnOutsideClick) {
          document.removeEventListener('mouseup', this.handleOutsideMouseClick);
          document.removeEventListener('touchstart', this.handleOutsideMouseClick);
        }

        this.closePortal(true);
      }
    }, {
      key: 'handleWrapperClick',
      value: function handleWrapperClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.active) {
          return;
        }
        this.openPortal();
      }
    }, {
      key: 'openPortal',
      value: function openPortal() {
        var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

        this.setState({ active: true });
        this.renderPortal(props);
        this.props.onOpen(this.node);
      }
    }, {
      key: 'closePortal',
      value: function closePortal() {
        var _this2 = this;

        var isUnmounted = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        var resetPortalState = function resetPortalState() {
          if (_this2.node) {
            ReactDOM.unmountComponentAtNode(_this2.node);
            document.body.removeChild(_this2.node);
          }
          _this2.portal = null;
          _this2.node = null;
          if (isUnmounted !== true) {
            _this2.setState({ active: false });
          }
        };

        if (this.state.active) {
          if (this.props.beforeClose) {
            this.props.beforeClose(this.node, resetPortalState);
          } else {
            resetPortalState();
          }

          this.props.onClose();
        }
      }
    }, {
      key: 'handleOutsideMouseClick',
      value: function handleOutsideMouseClick(e) {
        if (!this.state.active) {
          return;
        }

        var root = findDOMNode(this.portal);
        if (root.contains(e.target) || e.button && e.button !== 0) {
          return;
        }

        e.stopPropagation();
        this.closePortal();
      }
    }, {
      key: 'handleKeydown',
      value: function handleKeydown(e) {
        if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
          this.closePortal();
        }
      }
    }, {
      key: 'applyClassNameAndStyle',
      value: function applyClassNameAndStyle(props) {
        if (props.className) {
          this.node.className = props.className;
        }
        if (props.style) {
          // React 15.1.0+ requires third parameter in debug mode
          /* eslint-disable no-underscore-dangle */
          CSSPropertyOperations.setValueForStyles(this.node, props.style, this._reactInternalInstance);
          /* eslint-enable no-underscore-dangle */
        }
      }
    }, {
      key: 'renderPortal',
      value: function renderPortal(props) {
        if (!this.node) {
          this.node = document.createElement('div');
          // apply CSS before the node is added to the DOM to avoid needless reflows
          this.applyClassNameAndStyle(props);
          document.body.appendChild(this.node);
        } else {
          // update CSS when new props arrive
          this.applyClassNameAndStyle(props);
        }
        this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, React.cloneElement(props.children, { closePortal: this.closePortal }), this.node, this.props.onUpdate);
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.props.openByClickOn) {
          return React.cloneElement(this.props.openByClickOn, { onClick: this.handleWrapperClick });
        }
        return null;
      }
    }]);

    return Portal;
  }(Component);

  Portal.propTypes = { className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.element.isRequired,
    openByClickOn: PropTypes.element,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    isOpened: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    beforeClose: PropTypes.func,
    onUpdate: PropTypes.func
  };

  Portal.defaultProps = { onOpen: function onOpen() {},
    onClose: function onClose() {},
    onUpdate: function onUpdate() {}
  };

  var Controls = function (_Component2) {
    _inherits(Controls, _Component2);

    function Controls(props) {
      _classCallCheck(this, Controls);

      var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Controls).call(this, props));

      _this3.state = { isMaximized: false };
      return _this3;
    }

    _createClass(Controls, [{
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _props = this.props;
        var content = _props.content;
        var actions = _props.actions;
        var isMaximized = this.state.isMaximized;

        console.info('IS MAXIMIZED', isMaximized);

        return isMaximized ? React.createElement(
          'button',
          { onClick: function onClick() {
              console.warn('RESTORE');
              actions.restore();
              _this4.setState({ isMaximized: false });
            } },
          content.restore
        ) : React.createElement(
          'button',
          { onClick: function onClick() {
              console.warn('MAXIMIZE');
              actions.maximize();
              _this4.setState({ isMaximized: true });
            } },
          content.maximize
        );
      }
    }]);

    return Controls;
  }(Component);

  var Container = function (_Component3) {
    _inherits(Container, _Component3);

    function Container(props) {
      _classCallCheck(this, Container);

      //this.state = { isMaximized: props.isMaximized() }

      var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

      _this5.reference = function () {
        return new _bluebird2.default(function (resolve, reject) {
          if (_this5.mounted) return resolve(_this5);else {
            (function () {
              var intervalID = setInterval(function () {
                if (_this5.mounted) {
                  clearInterval(intervalID);
                  resolve(_this5);
                }
              }, 200);
            })();
          }
        });
      };

      _this5.update = function () {
        _this5.forceUpdate();
      };

      _this5.state = { mounted: false };
      return _this5;
    }

    _createClass(Container, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        console.info('MOUNTED');
        this.setState({ mounted: true });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        console.info('UNMOUNTED');
        this.setState({ mounted: false });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this6 = this;

        var children = this.props.children;

        console.warn('CHILDREN', children);
        return React.createElement(
          'div',
          { ref: function ref(x) {
              return _this6.internalRef = x;
            } },
          children
        );
      }
    }]);

    return Container;
  }(Component);

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
  return _temp = _class = function (_Component4) {
    _inherits(Maximize, _Component4);

    function Maximize(props) {
      _classCallCheck(this, Maximize);

      var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Maximize).call(this, props));

      _this7.createContainer = function (id, getContent) {
        console.warn('CREATING CONTAINER => ' + id);
        var maximized = _this7.state.maximized;

        var isMaximized = function isMaximized() {
          return _this7.state.maximized.includes(id);
        };
        var actions = { maximize: function maximize() {
            return _this7.setState({ maximized: maximized.concat(id) });
          },
          restore: function restore() {
            return _this7.setState({ maximized: maximized.slice(0, -1) });
          }
        };
        var controls = React.createElement(Controls, {
          actions: actions,
          content: _this7.props.content
        });
        var container = React.createElement(
          Container,
          { ref: function ref(x) {
              console.warn('SETTING CONTAINER', id, actions, x);
              _this7.containers.set(id, { actions: actions, container: x });
            } },
          getContent({ controls: controls })
        );
        //this.containers.set(id, { actions, container })
        //const container = <Container ref={x => this.containers.set(id, { actions, container: x })} isMaximized={isMaximized}>{getContent({ controls })}</Container>
        console.info('CONTAINER', container);
        return container;
      };

      _this7.containers = new Map();
      _this7.state = { isMaximized: false,
        containerClass: null,
        containerStyle: null,
        lastScroll: { x: 0, y: 0 },
        maximized: []
      };
      return _this7;
    }

    _createClass(Maximize, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.parentNode = this.container.parentNode;
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
        var _this8 = this;

        var _props2 = this.props;
        var children = _props2.children;
        var maximizeContent = _props2.maximizeContent;
        var restoreContent = _props2.restoreContent;
        var styles = _props2.styles;
        var isMaximized = this.state.isMaximized;


        var childrenStyle = isMaximized ? { position: 'absolute', minHeight: '100vh' } : { position: 'relative' };

        var containerStyle = { border: '2px solid black',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0
        };

        var content = children({ container: function container(id, getContent) {
            if (_this8.containers.has(id)) {
              /*
              if(this.state.maximized.includes(id))
                return null
              else {
                */
              return React.createElement(
                Portal,
                { isOpened: true },
                React.createElement('div', { ref: function ref(x) {
                    var obj = _this8.containers.get(id);
                    var container = obj.container;
                    console.warn('CURRENT', current);
                    //current.forceUpdate()
                    current.reference().then(function (ref) {
                      x.appendChild(ref);
                    });
                  } })
              );
              //}
            } else return _this8.createContainer(id, getContent);
          }
        });

        return React.createElement(
          'div',
          { ref: function ref(x) {
              return _this8.container = x;
            } },
          React.createElement(
            'div',
            { key: 'root', style: { border: '1px dashed yellow' } },
            content
          ),
          this.state.maximized.length > 0 ? this.state.maximized.map(function (id) {
            var _containers$get = _this8.containers.get(id);

            var actions = _containers$get.actions;
            var container = _containers$get.container;

            return React.createElement(
              'div',
              { key: id,
                ref: function ref(x) {
                  console.warn('MAXIMIZED APPEND', Object.keys(container));
                  container.reference().then(function (ref) {
                    console.info('APPENDING', container);
                    x.appendChild(ref);
                    container.update();
                  });
                  //container.forceUpdate()
                },
                style: _extends({}, _this8.props.containerStyle, _this8.props.style, { border: '1px dashed red' }),
                className: (0, _classnames2.default)(_this8.props.styles.maximize, _this8.props.className) },
              React.createElement('div', {
                style: _this8.props.backgroundStyle,
                onClick: actions.restore
              })
            );
          }) : null
        );
      }
    }]);

    return Maximize;
  }(Component), _class.propTypes = propTypes, _class.defaultProps = defaultProps, _temp;
}