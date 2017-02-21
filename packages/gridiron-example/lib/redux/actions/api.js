'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logAccess = exports.isExpired = exports.decodeToken = exports.clearData = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.apiAction = apiAction;
exports.keyedApiAction = keyedApiAction;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

require('isomorphic-fetch');

var _reduxActions = require('redux-actions');

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _config = require('../../../config');

var _location = require('../../services/location');

var _persistence2 = require('../../services/persistence');

var _persistence3 = _interopRequireDefault(_persistence2);

var _constants = require('../constants');

var _identity = require('./identity');

var _APIError = require('../../errors/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _persistence = (0, _persistence3.default)(),
    saveState = _persistence.saveState,
    loadState = _persistence.loadState,
    removeState = _persistence.removeState;

var getPersisted = function getPersisted() {
  return loadState(['tokens', 'fingerprint']);
};

var apis = _config.client.apis,
    clientId = _config.client.clientId;


var noop = function noop() {};

var clearData = exports.clearData = (0, _reduxActions.createAction)(_constants.CLEAR_DATA, function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      apiName = _ref2[0],
      actionName = _ref2[1];

  return { apiName: apiName, actionName: actionName };
});
var fetchData = (0, _reduxActions.createAction)(_constants.FETCH_DATA, function (_ref3, inputData) {
  var _ref4 = _slicedToArray(_ref3, 2),
      apiName = _ref4[0],
      actionName = _ref4[1];

  return { apiName: apiName, actionName: actionName, inputData: inputData };
});
var receiveData = (0, _reduxActions.createAction)(_constants.RECEIVE_DATA, function (_ref5, data) {
  var _ref6 = _slicedToArray(_ref5, 2),
      apiName = _ref6[0],
      actionName = _ref6[1];

  return { apiName: apiName, actionName: actionName, data: data };
});
var receiveDataError = (0, _reduxActions.createAction)(_constants.RECEIVE_DATA);
var keyedData = (0, _reduxActions.createAction)(_constants.KEYED_DATA, function (_ref7, _ref8, data) {
  var _ref10 = _slicedToArray(_ref7, 2),
      apiName = _ref10[0],
      actionName = _ref10[1];

  var _ref9 = _slicedToArray(_ref8, 2),
      apiKey = _ref9[0],
      actionKey = _ref9[1];

  return { apiName: apiName, actionName: actionName, apiKey: apiKey, actionKey: actionKey, data: data };
});
var keyedDataError = (0, _reduxActions.createAction)(_constants.KEYED_DATA);

var decodeToken = exports.decodeToken = function decodeToken(accessToken) {
  return _jwtSimple2.default.decode(accessToken, null, true);
};
var isExpired = exports.isExpired = function isExpired(decodedToken) {
  return getExpiresInMS(decodedToken) < 0;
};
var getExpiresInMS = function getExpiresInMS(decodedToken) {
  return decodedToken.exp * 1000 - Date.now();
};

var getTixClaimSchema = function getTixClaimSchema(name) {
  return 'http://schemas.tix.com/identity/claims/' + name;
};
var getClaim = function getClaim(decodedToken, name) {
  return decodedToken[name];
};
var hasTixClaim = function hasTixClaim(decodedToken, name, value) {
  return hasClaim(decodedToken, getTixClaimSchema(name), value);
};
var getTixClaim = function getTixClaim(decodedToken, name) {
  return getClaim(decodedToken, getTixClaimSchema(name));
};
var hasRole = function hasRole(decodedToken, roleName) {
  return hasClaim(decodedToken, getTixClaimSchema('role'), roleName);
};
var hasClaim = function hasClaim(decodedToken, name, value) {
  var claim = getClaim(decodedToken, name);
  // if claim exists but value was not specified, return true
  if (claim && !value) return true;
  if (claim) return Array.isArray(claim) ? claim.indexOf(value) !== -1 : claim === value;
};

var resolveScheme = function resolveScheme(actionConfig) {
  return _location.scheme;
};
var resolvePort = function resolvePort(actionConfig) {
  return actionConfig.extra && actionConfig.extra.port ? actionConfig.extra.port : _location.port;
};
var resolveHostname = function resolveHostname(actionConfig) {
  return actionConfig.extra && actionConfig.extra.hostname ? actionConfig.extra.hostname : _location.hostname;
};

var resolveBaseUrl = function resolveBaseUrl(actionConfig) {
  var resolvedScheme = resolveScheme(actionConfig);
  var resolvedPort = resolvePort(actionConfig);
  var resolvedHostname = resolveHostname(actionConfig);
  if (resolvedScheme === 'https' && resolvedPort === 443 || resolvedScheme === 'http' && resolvedPort === 80) {
    /** NO NEED TO SPECIFY PORT IN HERE */
    if (resolvedScheme === _location.scheme && resolvedHostname === _location.hostname && resolvedPort === _location.port) /** SAME HOSTNAME, PORT, and SCHEME, NO NEED TO SPECIFY BASE URL */
      return '';
    return resolvedScheme + '://' + resolvedHostname;
  }
  return resolvedScheme + '://' + resolvedHostname + ':' + resolvedPort;
};

var supportedPropTypes = ['string', 'bool', 'number'];
var checkPropType = function checkPropType(key, prop, propType) {
  if (typeof prop === 'undefined' || prop === null) throw new _APIError2.default('Parameter with key \'' + key + '\' was null but API was expecting propType \'' + propType + '\'.');
  var getTypeError = function getTypeError() {
    return new _APIError2.default('Parameter with key \'' + key + '\' was not of expected propType \'' + propType + '\'.');
  };
  switch (propType) {
    case 'string':
      if (typeof prop !== 'string') throw getTypeError();
      break;
    case 'bool':
      if (typeof prop !== 'boolean') throw getTypeError();
      break;
    case 'number':
      if (typeof prop !== 'number') throw getTypeError();
      break;
    case 'object':
      if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) !== 'object') throw getTypeError();
      break;
    case 'array':
      if (!Array.isArray(prop)) throw getTypeError();
      break;
    case 'func':
    default:
      throw new _APIError2.default('propType ' + propType + ' is not supported for api interpolation. Reconfigure the api to use one of the supported propTypes => [' + supportedPropTypes.join(', ') + ']');
  }
};

var resolveQuery = function resolveQuery(actionConfig, inputData) {
  if (!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.query)) return '';
  // TODO: COMPILE QUERY STRING
  return '?';
};

var getTemplateRegExp = function getTemplateRegExp(replacer) {
  return new RegExp('\\$\\{' + replacer + '\\}', 'gi');
};
/**
 * PATH = /some/path/looks/like/this/${variableName}/${another}
 * replacers = { variableName: 'path_seg_one', another: 'path_seg_two' }
 */
var compileTemplate = function compileTemplate(path, replacers) {
  if (path.includes(' ')) throw new _APIError2.default('Space detected in path. This is not allowed.');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(replacers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var re = getTemplateRegExp(key);
      path = path.replace(re, replacers[key]);
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

  return path;
};

var resolvePath = function resolvePath(actionConfig, inputData) {
  // TODO: NEED TO COMPILE DYNAMIC PATHS
  if (!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.route)) return actionConfig.path;

  var route = actionConfig.extra.expects.route;

  var possibleVariables = Object.keys(route);
  var matchedVariables = Object.keys(inputData).filter(function (x) {
    return typeof inputData[x] !== 'undefined' && possibleVariables.includes(x);
  });

  if (__DEV__) {
    //** VALIDATE REQUIRED VARIABLES */
    var requiredVariables = possibleVariables.filter(function (x) {
      return route[x].isRequired;
    });
    var missedVariables = requiredVariables.filter(function (x) {
      return matchedVariables.includes(x) === false;
    });
    if (missedVariables.length > 0) throw new _APIError2.default('Route with path ' + actionConfig.path + ' requires the following missing route variables => [' + missedVariables.join(', ') + ']');

    //** VALIDATE TYPED VARIABLES */
    var typedVariables = matchedVariables.filter(function (x) {
      return route[x].propType;
    });
    typedVariables.forEach(function (x) {
      return checkPropType(x, inputData[x], route[x].propType);
    });
  }

  /** Reduce to an object with key value map of things to be replaced. */
  var replacers = matchedVariables.reduce(function (obj, key) {
    return Object.assign({}, obj, _defineProperty({}, key, inputData[key].toString()));
  }, {});
  return compileTemplate(actionConfig.path, replacers);
};

var resolveBody = function resolveBody(actionConfig, inputData) {
  if (!(actionConfig.extra && actionConfig.extra.expects && actionConfig.extra.expects.body)) return noop();

  var body = actionConfig.extra.expects.body;

  var possibleVariables = Object.keys(body);
  var matchedVariables = Object.keys(inputData).filter(function (x) {
    return typeof inputData[x] !== 'undefined' && possibleVariables.includes(x);
  });

  if (__DEV__) {
    //** VALIDATE REQUIRED VARIABLES */
    var requiredVariables = possibleVariables.filter(function (x) {
      return body[x].isRequired;
    });
    var missedVariables = requiredVariables.filter(function (x) {
      return matchedVariables.includes(x) === false;
    });
    if (missedVariables.length > 0) throw new _APIError2.default('Route with path ' + actionConfig.path + ' requires the following missing body variables => [' + missedVariables.join(', ') + '], passed => [' + JSON.stringify(inputData) + ']');

    //** VALIDATE TYPED VARIABLES */
    var typedVariables = matchedVariables.filter(function (x) {
      return body[x].propType;
    });
    typedVariables.forEach(function (x) {
      return checkPropType(x, inputData[x], body[x].propType);
    });
  }
  var resolvedBody = matchedVariables.reduce(function (obj, key) {
    return Object.assign({}, obj, _defineProperty({}, key, inputData[key]));
  }, {});
  return JSON.stringify(resolvedBody);
};

var resolveInput = function resolveInput(actionConfig, inputData) {
  return '' + resolveBaseUrl(actionConfig) + resolvePath(actionConfig, inputData) + resolveQuery(actionConfig, inputData);
};

var resolveInit = function resolveInit(actionConfig, inputData) {
  /** TODO: NEED TO COMPILE ROUTES PATHS AND TEST IF THERE ARE REQUIRED DATA */
  var body = resolveBody(actionConfig, inputData);
  return Object.assign({}, actionConfig.init, { body: body });
};

var getErrorCode = function getErrorCode(response) {
  switch (response.statusText) {
    default:
      return 'API_UNCLASSIFIED';
  }
};

var getAPIError = function getAPIError(info, response) {
  var code = getErrorCode(response);
  switch (response.status) {
    default:
      return new _APIError2.default('An API error occurred => ' + response.statusText, null, _extends({}, info, { response: response, code: code }));
  }
};

var activeRequests = new Map();
function executeFetch(input, init, transform, _ref11) {
  var apiName = _ref11.apiName,
      actionName = _ref11.actionName,
      inputData = _ref11.inputData;

  return function (dispatch, getState) {
    var info = { input: input, init: init, apiName: apiName, actionName: actionName, inputData: inputData };
    var key = JSON.stringify(_extends({}, info, { transform: transform }));
    var request = activeRequests.get(key);
    if (!request) {
      dispatch(fetchData([apiName, actionName], inputData));
      request = fetch(input, init).then(function (response) {
        if (!response.ok) {
          if (response.status === 401) dispatch((0, _identity.forgetTokens)());
          throw getAPIError(info, response);
        }
        return response.json();
      }).then(function (json) {
        var data = json;
        if (transform) data = Array.isArray(json) ? json.map(transform) : transform(json);
        activeRequests.delete(key);
        dispatch(receiveData([apiName, actionName], data));
        return data;
      }).catch(function (err) {
        activeRequests.delete(key);
        dispatch(receiveDataError(err));
        throw err;
      });
      activeRequests.set(key, request);
    } else _config.log.info({ apiName: apiName, actionName: actionName }, 'request already processing, continuing on enqueued response.');
    return request;
  };
}

var resolveInputData = function resolveInputData(args) {
  if (args.length > 0 && typeof args[0] !== 'function') return args[0];
};

var resolveTransform = function resolveTransform(args) {
  if (args.length > 0) {
    var lastArg = args[args.length - 1];
    if (typeof lastArg === 'function') return lastArg;
  }
};

var getDecodedToken = function getDecodedToken(accessToken) {
  return _jwtSimple2.default.decode(accessToken, null, true);
};

var getCookieData = function getCookieData() {
  var _getPersisted = getPersisted(),
      tokens = _getPersisted.tokens;

  var _ref12 = tokens || [],
      _ref13 = _slicedToArray(_ref12, 2),
      accessToken = _ref13[0],
      refreshToken = _ref13[1];

  var decodedToken = getDecodedToken(accessToken);
  var fingerprint = getTixClaim(decodedToken, 'fingerprint');
  var subject = getClaim(decodedToken, 'sub');
  return { accessToken: accessToken, refreshToken: refreshToken, fingerprint: fingerprint, subject: subject };
};

var authorizeInit = function authorizeInit(init) {
  var _getCookieData = getCookieData(),
      accessToken = _getCookieData.accessToken;

  var headers = Object.assign({}, init.headers, { Authorization: 'Bearer ' + accessToken });
  return Object.assign({}, init, { headers: headers });
};

function apiAction(_ref14) {
  var _ref15 = _slicedToArray(_ref14, 2),
      apiName = _ref15[0],
      actionName = _ref15[1];

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var inputData = resolveInputData(args);
  var transform = resolveTransform(args);
  return function (dispatch, getState) {
    try {
      var apiConfig = apis[apiName];
      if (!apiConfig) {
        var err = new _APIError2.default('Specified api does not exist, ensure api \'' + apiName + '\' exists in api config.', null, { apiName: apiName, actionName: actionName, inputData: inputData });
        dispatch(receiveDataError(err));
        return _bluebird2.default.reject(err);
      }
      var actionConfig = apiConfig[actionName];
      if (!actionConfig) {
        var _err = new _APIError2.default('Specified api action does not exist, ensure api \'' + apiName + '\' has an action definition for ' + actionName, null, { apiName: apiName, actionName: actionName, inputData: inputData });
        dispatch(receiveDataError(_err));
        return _bluebird2.default.reject(_err);
      }

      var info = { apiName: apiName, actionName: actionName, inputData: inputData };
      var input = resolveInput(actionConfig, inputData);
      var init = resolveInit(actionConfig, inputData);
      var isAuthorized = actionConfig.extra && actionConfig.extra.isAuthorized;
      return dispatch(executeFetch(input, isAuthorized ? authorizeInit(init) : init, transform, info));
    } catch (innerError) {
      var _err2 = new _APIError2.default('Unexpected error occurred during data fetch.', innerError, { apiName: apiName, actionName: actionName });
      dispatch(receiveDataError(_err2));
      return _bluebird2.default.reject(_err2);
    }
  };
}

function keyedApiAction(_ref16, _ref17) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var _ref19 = _slicedToArray(_ref16, 2),
      apiName = _ref19[0],
      actionName = _ref19[1];

  var _ref18 = _slicedToArray(_ref17, 2),
      apiKey = _ref18[0],
      actionKey = _ref18[1];

  return function (dispatch, getState) {
    try {
      dispatch(apiAction.apply(undefined, [[apiName, actionName]].concat(args))).then(function (data) {
        dispatch(keyedData([apiName, actionName], [apiKey, actionKey], data));
        return data;
      });
    } catch (innerError) {
      var err = new _APIError2.default('Unexpected error occurred during keyed api fetch.', innerError, { apiName: apiName, actionName: actionName, actionKey: actionKey });
      dispatch(keyedDataError(err));
    }
  };
}

var logAccess = exports.logAccess = function logAccess(path, query, title) {
  return function (dispatch) {
    return dispatch(apiAction(['log', 'access'], { path: path, query: query, title: title }));
  };
};