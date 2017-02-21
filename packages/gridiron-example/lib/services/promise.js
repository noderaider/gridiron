'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeCancelable = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeCancelable = exports.makeCancelable = function makeCancelable(promise) {
  var hasCanceled_ = false;
  return {
    promise: new _bluebird2.default(function (resolve, reject) {
      return promise.then(function (r) {
        return hasCanceled_ ? reject({ isCanceled: true }) : resolve(r);
      });
    }),
    cancel: function cancel() {
      hasCanceled_ = true;
    }
  };
};