'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _config = require('../../config.js');

var _alias = require('./alias');

var _alias2 = _interopRequireDefault(_alias);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name) {
        return { root: [_config.__rootname],
                alias: (0, _alias2.default)(name),
                fallback: (0, _config.resolveRoot)('node_modules'),
                extensions: ['', '.jsx', '.js', '.json']
        };
};