'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var state = _config.client.state;


var keyNames = Object.keys(state.meta);
var separator = ':';
var stateSerializers = { json: function json(state) {
    return JSON.stringify(state);
  },
  concat: function concat(state) {
    return state.join(separator);
  },
  base64: function base64(state) {
    return new Buffer(state).toString('base64');
  }
};
var stateDeserializers = { json: function json(serialized) {
    return JSON.parse(serialized);
  },
  concat: function concat(serialized) {
    return serialized.split(separator);
  },
  base64: function base64(serialized) {
    return new Buffer(serialized, 'base64').toString('ascii');
  }
};

function getStateMeta(key) {
  var stateMeta = state.meta[key];
  if (!stateMeta) throw new Error('Unsupported state => \'' + stateKey + '\'. Supported states: [\'' + JSON.stringify([].concat(_toConsumableArray(keyNames))) + '\']');
  return stateMeta;
}

function getStores() {
  var stateKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : keyNames;

  var stores = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = stateKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _stateKey = _step.value;

      var stateMeta = getStateMeta(_stateKey);
      var serialize = getSerializer(stateMeta);
      var deserialize = getDeserializer(stateMeta);
      stores[_stateKey] = getPersistMedium({ persist: stateMeta.persist,
        serialize: serialize,
        deserialize: deserialize
      });
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

  return stores;
}

function getSerializer(_ref) {
  var jsonProps = _ref.jsonProps,
      concatProps = _ref.concatProps,
      base64Props = _ref.base64Props;

  if (jsonProps && concatProps) throw new Error('Cannot serialize using jsonProps and concatProps (concatProps should only be used on array state).');

  var serializers = [];
  if (jsonProps) serializers.push(stateSerializers.json);
  if (concatProps) serializers.push(stateSerializers.concat);
  if (base64Props) serializers.push(stateSerializers.base64);

  return function (state) {
    //log.warn({ state }, 'SERIALIZER')
    return serializers.reduce(function (mutated, serialize) {
      return serialize(mutated);
    }, state);
  };
}

function getDeserializer(_ref2) {
  var jsonProps = _ref2.jsonProps,
      concatProps = _ref2.concatProps,
      base64Props = _ref2.base64Props,
      _ref2$defaultProps = _ref2.defaultProps,
      defaultProps = _ref2$defaultProps === undefined ? (0, _config.noop)() : _ref2$defaultProps;

  if (jsonProps && concatProps) throw new Error('Cannot serialize using jsonProps and concatProps (concatProps should only be used on array state).');

  var deserializers = [];
  if (base64Props) deserializers.push(stateDeserializers.base64);
  if (concatProps) deserializers.push(stateDeserializers.concat);
  if (jsonProps) deserializers.push(stateDeserializers.json);

  return function (serialized) {
    //log.warn({ serialized }, 'DESERIALIZER')
    return typeof serialized === 'undefined' ? defaultProps : deserializers.reduce(function (mutated, deserialize) {
      return deserialize(mutated);
    }, serialized);
  };
}

function getPersistMedium(_ref3) {
  var persist = _ref3.persist,
      serialize = _ref3.serialize,
      deserialize = _ref3.deserialize;

  switch (persist.type) {
    case 'cookie':
      return { load: function load() {
          return deserialize(_reactCookie2.default.load(persist.name));
        },
        save: function save(state) {
          return _reactCookie2.default.save(persist.name, serialize(state), cookieOpts(persist));
        },
        remove: function remove() {
          return _reactCookie2.default.save(persist.name, (0, _config.noop)(), cookieOpts(_extends({}, persist, { days: -1 })));
        }
      };
    case 'local':
      return { load: function load() {
          return deserialize(localStorage.getItem(persist.name));
        },
        save: function save(state) {
          return localStorage.setItem(persist.name, serialize(state));
        },
        remove: function remove() {
          return localStorage.removeItem(persist.name);
        }
      };
    case 'session':
      return { load: function load() {
          return deserialize(sessionStorage.getItem(persist.name));
        },
        save: function save(state) {
          return sessionStorage.setItem(persist.name, serialize(state));
        },
        remove: function remove() {
          return sessionStorage.removeItem(persist.name);
        }
      };
  }
}

var cookieOpts = function cookieOpts(persist) {
  return { path: '/',
    expires: getFutureDate(persist.days || 1),
    secure: persist.setSecureCookie || false,
    httpOnly: persist.httpOnly || false
  };
};

function getFutureDate(days) {
  var futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate;
}

exports.default = function () {
  var stores = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getStores();

  var loadState = function loadState() {
    var stateKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : keyNames;

    var state = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = stateKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _stateKey2 = _step2.value;

        state[_stateKey2] = stores[_stateKey2].load();
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

    return state;
  };

  var saveState = function saveState(partialState) {
    //log.warn({ partialState }, 'saveState')
    var fullState = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Object.keys(partialState)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _stateKey3 = _step3.value;

        stores[_stateKey3].save(partialState[_stateKey3]);
        fullState[_stateKey3] = state;
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

    return fullState;
  };

  var removeState = function removeState(stateKeys) {
    //log.warn({ stateKeys }, 'removeState')
    if (!stateKeys) throw new Error('Must supply stateKeys to remove from state.');
    var fullState = loadState();
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = stateKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _stateKey4 = _step4.value;

        stores[_stateKey4].remove();
        fullState[_stateKey4] = (0, _config.noop)();
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

    return fullState;
  };

  /** Loads all the common cookie details */
  var getPersisted = function getPersisted() {
    return loadState(['tokens', 'fingerprint']);
  };
  return { loadState: loadState, saveState: saveState, removeState: removeState, getPersisted: getPersisted };
};