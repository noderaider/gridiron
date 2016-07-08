'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reactPubSub;

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _reactStamp2 = require('react-stamp');

var _reactStamp3 = _interopRequireDefault(_reactStamp2);

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var should = require('chai').should();

function reactPubSub(deps, defaults) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var cloneElement = React.cloneElement;

  var _reactStamp = (0, _reactStamp3.default)(React);

  var compose = _reactStamp.compose;

  var pubEvent = 'pub';
  var subEvent = 'pub';

  /** Creates a connected pub / sub component template */
  return function pubSub() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$propNames = _ref.propNames;
    var propNames = _ref$propNames === undefined ? [] : _ref$propNames;
    var _ref$stateNames = _ref.stateNames;
    var stateNames = _ref$stateNames === undefined ? [] : _ref$stateNames;

    var EE = new _eventemitter2.default();

    var getContext = function getContext() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$props = _ref2.props;
      var props = _ref2$props === undefined ? {} : _ref2$props;
      var _ref2$state = _ref2.state;
      var state = _ref2$state === undefined ? {} : _ref2$state;
      return { props: props, state: state };
    };

    var getValue = function getValue(obj, path) {
      return path.reduce(function (value, x) {
        if (value) return value[x];
        return null;
      }, obj);
    };

    var latest = function latest() {
      var pub = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var sub = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
      var defaultValue = arguments[3];

      var pubValue = getValue(pub, path);
      var subValue = getValue(sub, path);
      var pubExists = typeof pubValue !== 'undefined';
      var subExists = typeof subValue !== 'undefined';
      if (!pubExists && !subExists) {
        //console.info('ONE', pubValue, subValue)
        return defaultValue;
      } else if (pubExists && !subExists) {
        //console.info('TWO', pubValue, subValue)
        return pubValue;
      } else if (!pubExists && subExists) {
        //console.info('THREE', pubValue, subValue)
        return subValue;
      } else {
        //console.info('RESOLVE BOTH EXIST', pub, sub)
        return pub.time > sub.time ? pubValue : subValue;
      }
    };

    var _reset = false;

    function createPub() {
      for (var _len = arguments.length, desc = Array(_len), _key = 0; _key < _len; _key++) {
        desc[_key] = arguments[_key];
      }

      return compose.apply(undefined, desc.concat([{ displayName: 'pub',
        init: function init() {
          var _this = this;

          this._handleSub = function (_ref3) {
            var props = _ref3.props;
            var state = _ref3.state;

            if (_this.reset) {
              _this.reset({ props: props, state: state }, function () {
                _reset = false;
              });
            } else _reset = false;
          };
        },
        componentDidMount: function componentDidMount() {
          EE.on(subEvent, this._handleSub);
        },
        componentWillUnmount: function componentWillUnmount() {
          EE.removeListener(subEvent, this._handleSub);
        },
        componentWillUpdate: function componentWillUpdate() {
          if (!_reset) this._handleUpdate.apply(this, arguments);
        },
        _handleUpdate: function _handleUpdate(nextProps, nextState) {
          var props = this.props;
          var state = this.state;

          var updated = { propNames: propNames.filter(function (x) {
              return nextProps[x] !== props[x];
            }),
            stateNames: stateNames.filter(function (x) {
              return nextState[x] !== state[x];
            })
          };
          if (updated.propNames.length > 0 || updated.stateNames.length > 0) {
            var pub = { props: updated.propNames.reduce(function (updatedProps, x) {
                return _extends({}, updatedProps, _defineProperty({}, x, nextProps[x]));
              }, {}),
              state: updated.stateNames.reduce(function (updatedState, x) {
                return _extends({}, updatedState, _defineProperty({}, x, nextState[x]));
              }, {}),
              time: Date.now()
            };
            EE.emit(pubEvent, pub);
          }
        }
      }]));
    }

    function createSub() {
      for (var _len2 = arguments.length, desc = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        desc[_key2] = arguments[_key2];
      }

      return compose.apply(undefined, desc.concat([{ displayName: 'sub',
        init: function init() {
          var _this2 = this;

          this._handlePub = function (pub) {
            if (!pub.time) {
              console.warn('HANDLE PUB CALLED ON SUB (BUG, SKIPPING)', pub);
              return;
            }
            _this2.setState({ pub: pub });
          };
          this.latest = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            var _state = _this2.state;
            var pub = _state.pub;
            var sub = _state.sub;

            return latest.apply(undefined, [pub, sub].concat(args));
          };
          this.sub = function (_ref4) {
            var _ref4$props = _ref4.props;
            var props = _ref4$props === undefined ? {} : _ref4$props;
            var _ref4$state = _ref4.state;
            var state = _ref4$state === undefined ? {} : _ref4$state;

            _reset = true;
            EE.emit(subEvent, { props: props, state: state });
            _this2.setState({ sub: { props: props, state: state, time: Date.now() } }, function () {});
          };
        },
        state: { pub: { props: null, state: null, time: 0 },
          sub: { props: null, state: null, time: 0 }
        },
        componentDidMount: function componentDidMount() {
          EE.on(pubEvent, this._handlePub);
        },
        componentWillUnmount: function componentWillUnmount() {
          EE.removeListener(pubEvent, this._handlePub);
        }
      }]));
    }

    return { createPub: createPub,
      createSub: createSub,
      pub: function pub(x) {
        return EE.emit(pubEvent, x);
      },
      sub: function sub(x) {
        return EE.on(pubEvent, x);
      }
    };
  };
}