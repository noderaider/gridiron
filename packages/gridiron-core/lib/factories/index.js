'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.default = factories;

var _createPubSub = require('./createPubSub');

var _createPubSub2 = _interopRequireDefault(_createPubSub);

var _createHeader = require('./createHeader');

var _createHeader2 = _interopRequireDefault(_createHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function factories(deps, defaults) {
        return { pubSub: (0, _createPubSub2.default)(deps, defaults),
                header: (0, _createHeader2.default)(deps, defaults)
        };
}