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

var APIError = function (_ExtendableError) {
  _inherits(APIError, _ExtendableError);

  function APIError(message, innerError) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, APIError);

    var _this = _possibleConstructorReturn(this, (APIError.__proto__ || Object.getPrototypeOf(APIError)).call(this, message, innerError));

    _this.name = 'APIError';
    var code = props.code,
        input = props.input,
        init = props.init,
        apiName = props.apiName,
        actionName = props.actionName,
        inputData = props.inputData,
        response = props.response;

    _this.code = code;
    _this.input = input;
    _this.init = init;
    _this.apiName = apiName;
    _this.actionName = actionName;
    _this.inputData = inputData;
    _this.response = response;
    return _this;
  }

  return APIError;
}(_ExtendableError3.default);

exports.default = APIError;