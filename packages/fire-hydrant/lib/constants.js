'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var IS_DEV = exports.IS_DEV = process.env.NODE_ENV !== 'production';
var IS_BROWSER = exports.IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';