"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getClaim = exports.getClaim = function getClaim(decodedToken, name) {
  return decodedToken[name];
};
var hasClaim = exports.hasClaim = function hasClaim(decodedToken, name, value) {
  var claim = getClaim(decodedToken, name);
  // if claim exists but value was not specified, return true
  if (claim && !value) return true;
  if (claim) return Array.isArray(claim) ? claim.indexOf(value) !== -1 : claim === value;
};