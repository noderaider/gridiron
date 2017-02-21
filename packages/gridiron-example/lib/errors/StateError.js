'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.zeroElementsStateError = undefined;

var _ExtendableError2 = require('./ExtendableError');

var _ExtendableError3 = _interopRequireDefault(_ExtendableError2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var zeroElementsStateError = exports.zeroElementsStateError = function zeroElementsStateError(prop) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(StateError, [null].concat(['Cannot remove from state property \'' + prop + '\' with zero elements.'], args)))();
};

var StateError = function (_ExtendableError) {
  _inherits(StateError, _ExtendableError);

  function StateError(message, innerError) {
    _classCallCheck(this, StateError);

    var _this = _possibleConstructorReturn(this, (StateError.__proto__ || Object.getPrototypeOf(StateError)).call(this, message, innerError));

    _this.name = 'StateError';
    return _this;
  }

  return StateError;
}(_ExtendableError3.default);

exports.default = StateError;