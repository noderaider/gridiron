'use strict';

Object.defineProperty(exports, "__esModule", {
                        value: true
});

var _loaders = require('./loaders');

var _loaders2 = _interopRequireDefault(_loaders);

var _postLoaders = require('./postLoaders');

var _postLoaders2 = _interopRequireDefault(_postLoaders);

var _noParse = require('./noParse');

var _noParse2 = _interopRequireDefault(_noParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name) {
                        return { loaders: (0, _loaders2.default)(name),
                                                postLoaders: (0, _postLoaders2.default)(name),
                                                noParse: (0, _noParse2.default)(name)
                        };
};