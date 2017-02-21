'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/** MAP ON TO CALL A FUNCTION ONLY IN DEV AND PASS THROUGH, DOES NOT MUTATE THE INPUT */
var devStream = exports.devStream = function devStream(devFn) {
  return function (x) {
    return voidStream(function () {
      return process.env.NODE_ENV === 'production' ? {} : devFn(x);
    });
  };
};

/** MAP ON TO CALL A VOID FUNCTION AND PASS THROUGH */
var voidStream = exports.voidStream = function voidStream(voidFn) {
  return function (data) {
    voidFn(data);
    return data;
  };
};