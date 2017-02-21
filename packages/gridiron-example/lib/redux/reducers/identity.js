'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = identity;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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

function tokens() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.SET_IDENTITY:
      if (error || !payload.tokens) return null;
      return payload.tokens;
    case _constants.FORGET_TOKENS:
    case _constants.IDENTITY_INVALID:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
  }
  return state;
}

function fingerprint() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_FINGERPRINT:
      return null;
    case _constants.SET_IDENTITY:
      if (error) return state;
      var decodedToken = payload.decodedToken;

      return getTixClaim(decodedToken, 'fingerprint');
  }
  return state;
}

function isFetching() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FETCH_IDENTITY:
      return true;
    case _constants.SET_IDENTITY:
      return false;
  }
  return state;
}

function isAuthorized() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return false;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? false : state;
    case _constants.SET_IDENTITY:
      return error ? false : true;
  }
  return state;
}

function isAdmin() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return false;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? false : state;
    case _constants.SET_IDENTITY:
      if (error) return false;
      var decodedToken = payload.decodedToken;

      var id = getTixClaim(decodedToken, 'actualorganizationid');
      return id === 1;
  }
  return state;
}

function subject() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  if (error) return state;
  switch (type) {
    case _constants.SET_IDENTITY:
      var decodedToken = payload.decodedToken;

      return getClaim(decodedToken, 'sub');
  }
  return state;
}

function user() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;


  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      var fullName = getTixClaim(decodedToken, 'username'); // userfullname
      /** Probably should switch this parsing around to return 'userfirstname' and 'userlastname' */
      var sanitizedFullName = fullName ? fullName.trim() : 'Unknown Name';
      var nameParts = sanitizedFullName.split(' ').map(function (x) {
        return x.trim();
      }).filter(function (x) {
        return x && x.length > 0;
      });

      var _nameParts = _toArray(nameParts),
          firstName = _nameParts[0],
          lastNames = _nameParts.slice(1);

      return { username: getClaim(decodedToken, 'sub'),
        id: getTixClaim(decodedToken, 'userid'),
        fullName: fullName,
        firstName: firstName,
        lastName: lastNames.join(' ')
      };
  }
  return state;
}

function actualUser() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      return { username: getTixClaim(decodedToken, 'actualusername') || 'No Actual Username' // 'implement?'
        , id: getTixClaim(decodedToken, 'actualuserid') || 'No Actual User Id',
        fullName: getTixClaim(decodedToken, 'actualfullName') || 'No Full Name' // 'implement?'
        , firstName: getTixClaim(decodedToken, 'actualfirstname') // 'implement?'
        , lastName: getTixClaim(decodedToken, 'actuallastname') // 'implement?'
      };
  }
  return state;
}

function organization() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      return { id: getTixClaim(decodedToken, 'organizationid'),
        name: getTixClaim(decodedToken, 'organization') // organizationname
      };
  }
  return state;
}

function actualOrganization() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      var id = getTixClaim(decodedToken, 'actualorganizationid');
      return { id: id,
        name: id === 1 ? 'Tix' : getTixClaim(decodedToken, 'organization') // actualorganizationname
      };
  }
  return state;
}

var getTimeoutMS = function getTimeoutMS(timeoutMinutes) {
  return timeoutMinutes * 60000;
};
var defaultTimeoutMS = getTimeoutMS(120);
/** Sliding session timeout from any point in time */
function timeoutMS() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultTimeoutMS;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return defaultTimeoutMS;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? defaultTimeoutMS : state;
    case _constants.SET_IDENTITY:
      if (error) return defaultTimeoutMS;
      var decodedToken = payload.decodedToken;

      return getTimeoutMS(getTixClaim(decodedToken, 'timeout'));
  }
  return state;
}

var inactiveWindowMS = 30000;
var getInactiveMS = function getInactiveMS(timeoutMinutes) {
  return timeoutMinutes * 60000 - inactiveWindowMS;
};
var defaultInactiveMS = getInactiveMS(120);
/** Sliding session inactive from any point in time */
function inactiveMS() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultInactiveMS;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return defaultInactiveMS;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? defaultInactiveMS : state;
    case _constants.SET_IDENTITY:
      if (error) return defaultInactiveMS;
      var decodedToken = payload.decodedToken;

      return getInactiveMS(getTixClaim(decodedToken, 'timeout'));
  }
  return state;
}

/** What time (epoch) does token expire at */
function expiresAtMS() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      return decodedToken.exp * 1000;
  }
  return state;
}

/** How long of a window prior to expiration should refresh occur */
var refreshWindowMS = 40000;
/** What time (epoch) should refresh occur at */
function refreshAtMS() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
      //case IDENTITY_EXPIRED:
      return null;
    case _constants.AUTHORIZE_MIDDLEWARE:
      return error ? null : state;
    case _constants.SET_IDENTITY:
      if (error) return null;
      var decodedToken = payload.decodedToken;

      return decodedToken.exp * 1000 - refreshWindowMS;
  }
  return state;
}

var initialState = { isFetching: isFetching(),
  isAuthorized: isAuthorized(),
  isAdmin: isAdmin(),
  subject: subject(),
  user: user(),
  actualUser: actualUser(),
  organization: organization(),
  actualOrganization: actualOrganization(),
  timeoutMS: timeoutMS(),
  inactiveMS: inactiveMS(),
  expiresAtMS: expiresAtMS(),
  refreshAtMS: refreshAtMS(),
  tokens: tokens(),
  fingerprint: fingerprint()
  //, errors: errors()
};

function identity() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      error = action.error;

  switch (type) {
    case _constants.FETCH_IDENTITY:
    case _constants.SET_IDENTITY:
    case _constants.FORGET_TOKENS:
    case _constants.FORGET_FINGERPRINT:
    case _constants.IDENTITY_INVALID:
    case _constants.IDENTITY_EXPIRED:
    case _constants.AUTHORIZE_MIDDLEWARE:
      return Object.assign({}, state, { isFetching: isFetching(state.isFetching, action),
        isAuthorized: isAuthorized(state.isAuthorized, action),
        isAdmin: isAdmin(state.isAdmin, action),
        subject: subject(state.subject, action),
        user: user(state.user, action),
        actualUser: actualUser(state.actualUser, action),
        organization: organization(state.organization, action),
        actualOrganization: actualOrganization(state.actualOrganization, action),
        timeoutMS: timeoutMS(state.timeoutMS, action),
        inactiveMS: inactiveMS(state.inactiveMS, action),
        expiresAtMS: expiresAtMS(state.expiresAtMS, action),
        refreshAtMS: refreshAtMS(state.refreshAtMS, action),
        tokens: tokens(state.tokens, action),
        fingerprint: fingerprint(state.fingerprint, action)
        //, errors: errors(state.errors, action)
      });
  }
  return state;
}