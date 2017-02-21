'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAuthSync = exports.createAutoRefresh = exports.impersonateIdentity = exports.refreshIdentity = exports.authorizeIdentity = exports.authorized = exports.forgetTokens = exports.setIdentity = exports.fetchIdentity = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _chai = require('chai');

var _reduxActions = require('redux-actions');

var _reactRouterRedux = require('react-router-redux');

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _constants = require('../constants');

var _config = require('../../../config');

var _api = require('./api');

var _IdentityError = require('../../errors/IdentityError');

var _IdentityError2 = _interopRequireDefault(_IdentityError);

var _persistence2 = require('../../services/persistence');

var _persistence3 = _interopRequireDefault(_persistence2);

var _location = require('../../services/location');

var _claims = require('../../services/claims');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _persistence = (0, _persistence3.default)(),
    saveState = _persistence.saveState,
    loadState = _persistence.loadState,
    removeState = _persistence.removeState;

var getPersisted = function getPersisted() {
  return loadState(['tokens', 'fingerprint']);
};

var clientId = _config.client.clientId;
var fetchIdentity = exports.fetchIdentity = (0, _reduxActions.createAction)(_constants.FETCH_IDENTITY);
var setIdentity = exports.setIdentity = (0, _reduxActions.createAction)(_constants.SET_IDENTITY);
var forgetTokens = exports.forgetTokens = (0, _reduxActions.createAction)(_constants.FORGET_TOKENS);

var authorized = exports.authorized = function authorized(accessToken, refreshToken, decodedToken) {
  return function (dispatch, getState) {
    var state = getState();
    if (!state.identity.isAuthorized || state.identity.tokens.access !== accessToken && state.identity.tokens.refresh !== refreshToken) {
      dispatch(setIdentity({ tokens: { access: accessToken, refresh: refreshToken }, decodedToken: decodedToken }));
    }
  };
};

var getDecodedToken = function getDecodedToken(accessToken) {
  return _jwtSimple2.default.decode(accessToken, null, true);
};

var getCookieData = function getCookieData() {
  var _getPersisted = getPersisted(),
      tokens = _getPersisted.tokens,
      fingerprint = _getPersisted.fingerprint;

  var _ref = tokens || [],
      _ref2 = _slicedToArray(_ref, 2),
      accessToken = _ref2[0],
      refreshToken = _ref2[1];
  //TODO: THIS MAY HAVE ISSUES IF FINGERPRINT ISNT GETTING SYNCED QUICKLY
  //const decodedToken = getDecodedToken(accessToken)
  //const fingerprint = getTixClaim(decodedToken, 'fingerprint')


  return { accessToken: accessToken,
    refreshToken: refreshToken,
    fingerprint: fingerprint,
    subject: accessToken ? (0, _claims.getClaim)(getDecodedToken(accessToken), 'sub') : (0, _config.noop)()
  };
};

var identityApi = function identityApi(apiPath, args) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      genericError = _ref3.genericError,
      successRedirect = _ref3.successRedirect;

  if (_config.IS_DEV) {
    _chai.assert.ok(apiPath, 'apiPath is required');
    _chai.assert.isArray(apiPath);
    _chai.assert.lengthOf(apiPath, 2);
    _chai.assert.ok(args, 'args are required');
    _chai.assert.typeOf(args, 'object');
  }
  return function (dispatch, getState) {
    return dispatch((0, _api.apiAction)(apiPath, args)).then(function (response) {
      if (response.error) throw new _IdentityError2.default('Unable to authorize => ' + JSON.stringify(response));
      if (typeof response === 'string' && response.includes('AllowOneTime')) {
        var code = response.split('|')[1];
        return dispatch((0, _reactRouterRedux.push)('/identity/maintenance/migrate/' + code));
      }
      if (successRedirect) {
        var newState = getState();
        if (newState.identity.isAuthorized) {
          if (typeof successRedirect === 'function') {
            var redirectPath = successRedirect(newState);
            if (typeof redirectPath === 'string') (0, _location.goToPath)(redirectPath, true);
          } else if (typeof successRedirect === 'string') (0, _location.goToPath)(successRedirect, true);
        }
      }
    }).catch(function (err) {
      if (genericError) dispatch(setIdentity(new _IdentityError2.default(typeof genericError === 'function' ? genericError(err) : genericError, err)));
    });
  };
};

var authorizeIdentity = exports.authorizeIdentity = function authorizeIdentity(_ref4, successRedirect) {
  var username = _ref4.username,
      password = _ref4.password,
      _ref4$rememberMe = _ref4.rememberMe,
      rememberMe = _ref4$rememberMe === undefined ? false : _ref4$rememberMe;

  if (_config.IS_DEV) {
    _chai.assert.ok(username, 'username is required');
    _chai.assert.ok(password, 'password is required');
  }
  return function (dispatch, getState) {
    var _getCookieData = getCookieData(),
        fingerprint = _getCookieData.fingerprint;

    var args = { username: username, password: password, rememberMe: rememberMe, clientId: clientId, fingerprint: fingerprint };
    var continuation = { successRedirect: successRedirect, genericError: 'Username and password were incorrect.' };
    return dispatch(identityApi(['identity', 'authorize'], args, continuation));
  };
};

var refreshIdentity = exports.refreshIdentity = function refreshIdentity() {
  return function (dispatch, getState) {
    var _getCookieData2 = getCookieData(),
        accessToken = _getCookieData2.accessToken,
        refreshToken = _getCookieData2.refreshToken,
        fingerprint = _getCookieData2.fingerprint,
        subject = _getCookieData2.subject;

    if (_config.IS_DEV) _chai.assert.ok(refreshToken, 'refreshToken is required');
    var args = { refreshToken: refreshToken, fingerprint: fingerprint, subject: subject, clientId: clientId };
    var continuation = { genericError: 'Error occurred while refreshing identity.' };
    return dispatch(identityApi(['identity', 'refresh'], args, continuation));
  };
};

var impersonateIdentity = exports.impersonateIdentity = function impersonateIdentity(_ref5) {
  var organizationId = _ref5.organizationId,
      userId = _ref5.userId;

  if (_config.IS_DEV) _chai.assert.ok(organizationId || userId, 'must specify organizationId or userId to impersonate');
  return function (dispatch, getState) {
    var _getCookieData3 = getCookieData(),
        accessToken = _getCookieData3.accessToken,
        refreshToken = _getCookieData3.refreshToken,
        fingerprint = _getCookieData3.fingerprint,
        subject = _getCookieData3.subject;

    if (_config.IS_DEV) {
      _chai.assert.ok(refreshToken, 'refreshToken is required for impersonate');
      _chai.assert.ok(subject, 'subject is required for impersonate');
    }
    var args = { organizationId: organizationId, userId: userId, fingerprint: fingerprint, subject: subject, refreshToken: refreshToken, clientId: clientId };
    var continuation = { genericError: 'Error occurred while impersonating identity.' };
    return dispatch(identityApi(['identity', 'impersonate'], args, continuation));
  };
};

/** Creates an action that auto refreshes JWT tokens using a refresh token and randomized jitter offset time. */
var createAutoRefresh = exports.createAutoRefresh = function createAutoRefresh(_ref6) {
  var getPersisted = _ref6.getPersisted,
      _ref6$jitterMaxMS = _ref6.jitterMaxMS,
      jitterMaxMS = _ref6$jitterMaxMS === undefined ? 30000 : _ref6$jitterMaxMS;
  return function (dispatch, getState) {
    var _getState = getState(),
        identity = _getState.identity;

    if (!identity.refreshAtMS) return function (dispatch, getState) {};
    var jitterMS = Math.floor(Math.random() * jitterMaxMS);
    var refreshMS = identity.refreshAtMS - jitterMS - Date.now();

    _config.log.info('AUTOREFRESH IN ' + refreshMS + ' MS, (JITTER => ' + jitterMS + ')');
    if (refreshMS < 0) {
      dispatch(refreshIdentity());
      return function (dispatch, getState) {};
    }
    var timeoutID = setTimeout(function () {
      return dispatch(refreshIdentity());
    }, refreshMS);
    return function (dispatch, getState) {
      clearTimeout(timeoutID);
      _config.log.debug('AUTOREFRESH CANCELLED');
    };
  };
};

/** Creates an action that synchronizes authorization information across multiple tabs. */
var createAuthSync = exports.createAuthSync = function createAuthSync(_ref7) {
  var getPersisted = _ref7.getPersisted,
      tokenResolver = _ref7.tokenResolver,
      _ref7$pollFrequency = _ref7.pollFrequency,
      pollFrequency = _ref7$pollFrequency === undefined ? 1000 : _ref7$pollFrequency;
  return function (dispatch, getState) {
    var intervalID = setInterval(function () {
      var _getState2 = getState(),
          identity = _getState2.identity;

      var stateTokens = identity.tokens;

      var cookieTokens = tokenResolver();
      if (!stateTokens) {
        /** TAB IS NOT AUTHORIZED */
        if (cookieTokens[0]) {
          /** ANOTHER TAB IS LOGGED IN */
          _config.log.warn({ cookieTokens: cookieTokens }, 'DETECTED OTHER TAB AUTHORIZE... SYNCING');
          dispatch(authorized.apply(undefined, _toConsumableArray(cookieTokens)));
        }
      } else {
        // TAB IS AUTHORIZED
        if (!cookieTokens[0] || !cookieTokens[1]) {
          /** ANOTHER TAB LOGGED OUT */
          _config.log.warn('DETECTED OTHER TAB LOGOUT... FORGETTING');
          dispatch(forgetTokens());
        } else {
          var latest = tokenResolver([stateTokens.access, stateTokens.refresh]);
          if (stateTokens.access !== latest[0] || stateTokens.refresh !== latest[1]) {
            _config.log.warn('DETECTED OTHER TAB TOKEN CHANGE WITH NEWER TOKEN... SYNCING');
            dispatch(authorized.apply(undefined, _toConsumableArray(latest)));
          }
        }
      }
    }, pollFrequency);
    return function () {
      return clearInterval(intervalID);
    };
  };
};