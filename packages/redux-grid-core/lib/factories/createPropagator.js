'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createPropagator;

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var should = require('chai').should();

function createPropagator(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var cloneElement = React.cloneElement;


  return function propagator(component) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$propNames = _ref.propNames;
    var propNames = _ref$propNames === undefined ? [] : _ref$propNames;
    var _ref$stateNames = _ref.stateNames;
    var stateNames = _ref$stateNames === undefined ? [] : _ref$stateNames;

    should.exist(component, 'should provide a component to subscribe to as first argument');
    var EE = new _eventemitter2.default();

    var handleUpdate = function handleUpdate(_ref2) {
      var _ref2$props = _ref2.props;
      var props = _ref2$props === undefined ? {} : _ref2$props;
      var _ref2$state = _ref2.state;
      var state = _ref2$state === undefined ? {} : _ref2$state;
      var nextProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var nextState = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var updated = { propNames: propNames.filter(function (x) {
          return nextProps[x] !== props[x];
        }),
        stateNames: stateNames.filter(function (x) {
          return nextState[x] !== state[x];
        })
      };
      if (updated.propNames.length > 0 || updated.stateNames.length > 0) {
        var propagate = { props: updated.propNames.reduce(function (updatedProps, x) {
            return _extends({}, updatedProps, _defineProperty({}, x, nextProps[x]));
          }, {}),
          state: updated.stateNames.reduce(function (updatedState, x) {
            return _extends({}, updatedState, _defineProperty({}, x, nextState[x]));
          }, {})
        };
        EE.emit('propagate', propagate);
      }
    };

    var Propagatee = function (_Component) {
      _inherits(Propagatee, _Component);

      function Propagatee(props) {
        _classCallCheck(this, Propagatee);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Propagatee).call(this, props));

        _this.handlePropagate = function (propagated) {
          _this.setState({ propagated: propagated });
        };

        _this.state = {};
        return _this;
      }

      _createClass(Propagatee, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          EE.on('propagate', this.handlePropagate);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          EE.removeListener('propagate', this.handlePropagate);
        }
      }, {
        key: 'render',
        value: function render() {
          var children = this.props.children;
          var propagated = this.state.propagated;

          return cloneElement(children, { propagated: propagated });
        }
      }]);

      return Propagatee;
    }(Component);

    return { Component: function Component(props) {
        return cloneElement(component, _extends({}, props, { handleUpdate: handleUpdate }));
      },
      subscribe: function subscribe(listener) {
        return EE.on('propagate', listener);
      },
      apply: function apply(x) {
        return React.createElement(
          Propagatee,
          null,
          x
        );
      }
    };
  };
}