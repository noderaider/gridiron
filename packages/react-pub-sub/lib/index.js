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

  /** Creates a connected pub / sub component template */

  return function pubSub() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$propNames = _ref.propNames;
    var propNames = _ref$propNames === undefined ? [] : _ref$propNames;
    var _ref$stateNames = _ref.stateNames;
    var stateNames = _ref$stateNames === undefined ? [] : _ref$stateNames;
    var _ref$pubKey = _ref.pubKey;
    var pubKey = _ref$pubKey === undefined ? 'pub' : _ref$pubKey;
    var _ref$subKey = _ref.subKey;
    var subKey = _ref$subKey === undefined ? 'sub' : _ref$subKey;

    var events = { pub: 'pub',
      sub: 'sub',
      sub_register: 'sub_register',
      sub_deregister: 'sub_deregister'
    };
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

    function registerListeners(eventKey) {
      var listeners = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var resolved = listeners.filter(function (x) {
        return typeof x === 'function';
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = resolved[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;

          EE.on(eventKey, listener);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return function deregisterListeners() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = resolved[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var listener = _step2.value;

            EE.removeListener(eventKey, listener);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      };
    }

    function createPub(desc) {
      var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var onRegisterSub = _ref3.onRegisterSub;
      var onDeregisterSub = _ref3.onDeregisterSub;
      var onReceiveSub = _ref3.onReceiveSub;

      return compose(desc, { displayName: 'pub' + (desc.displayName ? '_' + desc.displayName : ''),
        state: _defineProperty({}, subKey, {}),
        init: function init() {
          var _this = this;

          this.__registers = [];
          this.__ignoreUpdates = false;
          /*
            this._receiveSub = ({ props, state }) => {
              if(this.reset) {
                this.reset({ props, state }, () => {
                  _reset = false
                })
              } else
                _reset = false
            }
            */

          this.__handleUpdate = function (nextProps, nextState) {
            var props = _this.props;
            var state = _this.state;

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
              EE.emit(events.pub, pub);
            }
          };

          this.setLocalState = function (newState, cb) {
            _this.__ignoreUpdates = true;
            _this.setState(newState, function () {
              _this.__ignoreUpdates = false;
              if (cb) cb();
            });
          };
        },
        componentDidMount: function componentDidMount() {
          this.__registers.push(registerListeners(events.register_sub, [onRegisterSub, this.onRegisterSub, this.props.onRegisterSub]));
          this.__registers.push(registerListeners(events.deregister_sub, [onDeregisterSub, this.onDeregisterSub, this.props.onDeregisterSub]));
          this.__registers.push(registerListeners(events.sub, [onReceiveSub, this.onReceiveSub, this.props.onReceiveSub]));
        },
        componentWillUnmount: function componentWillUnmount() {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this.__registers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var deregister = _step3.value;

              deregister();
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        },
        componentWillUpdate: function componentWillUpdate() {
          if (!this.__ignoreUpdates) this.__handleUpdate.apply(this, arguments);
        }
      });
    }

    function createSub(desc) {
      var _state2;

      var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var onReceivePub = _ref4.onReceivePub;

      return compose(desc, { displayName: 'sub' + (desc.displayName ? '_' + desc.displayName : ''),
        state: (_state2 = {}, _defineProperty(_state2, pubKey, { props: null, state: null, time: 0 }), _defineProperty(_state2, subKey, { props: null, state: null, time: 0 }), _state2),
        init: function init() {
          var _this2 = this;

          this.__registers = [];
          this.__onReceivePub = function (pub) {
            var pubState = _defineProperty({}, pubKey, pub);
            _this2.setState(pubState);
          };
          this.latest = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return latest.apply(undefined, [_this2.state[pubKey], _this2.state[subKey]].concat(args));
          };
          this.sendPub = function (obj) {
            //_reset = true
            EE.emit(events.sub, obj);
            //this.setState({ [subKey]: { props, state, time: Date.now() } }, () => {})
          };
          this.setSubState = function (newState, cb) {
            _this2.setState(_defineProperty({}, subKey, { state: newState, time: Date.now() }), function () {
              if (cb) cb();
            });
          };
        },
        componentDidMount: function componentDidMount() {
          this.__registers.push(registerListeners(events.pub, [this.__onReceivePub, onReceivePub, this.onReceivePub, this.props.onReceivePub]));
          EE.emit(events.register_sub, { props: this.props, state: this.state });
        },
        componentWillUnmount: function componentWillUnmount() {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.__registers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var deregister = _step4.value;

              deregister();
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          EE.emit(events.deregister_sub, { props: this.props, state: this.state });
        }
      });
    }

    return { createPub: createPub,
      createSub: createSub,
      pub: function pub(x) {
        return EE.emit(events.pub, x);
      },
      sub: function sub(x) {
        return EE.on(events.pub, x);
      }
    };
  };
}