'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _ExtendableError2 = require('./ExtendableError');

var _ExtendableError3 = _interopRequireDefault(_ExtendableError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IdentityError = function (_ExtendableError) {
  _inherits(IdentityError, _ExtendableError);

  function IdentityError(message, innerError) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, IdentityError);

    var _this = _possibleConstructorReturn(this, (IdentityError.__proto__ || Object.getPrototypeOf(IdentityError)).call(this, message, innerError));

    _this.name = 'IdentityError';
    _this.message = message;
    _this.innerError = innerError;
    var tokens = props.tokens,
        fingerprint = props.fingerprint;

    _this.tokens = tokens;
    _this.fingerprint = fingerprint;
    return _this;
  }

  return IdentityError;
}(_ExtendableError3.default);

exports.default = IdentityError;