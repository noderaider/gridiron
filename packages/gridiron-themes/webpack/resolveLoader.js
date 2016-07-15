'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _config = require('../config.js');

exports.default = function (name) {
        return { root: (0, _config.resolveRoot)('node_modules'),
                fallback: (0, _config.resolveRoot)('node_modules'),
                extensions: ['', '.jsx', '.js', '.json']
        };
};