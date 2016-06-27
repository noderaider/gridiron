'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = code;

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function code(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  return function (_Component) {
    _inherits(Code, _Component);

    function Code() {
      var _Object$getPrototypeO;

      var _temp, _this, _ret;

      _classCallCheck(this, Code);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Code)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.parseJSON = function () {
        var children = _this.props.children;

        try {
          var json = JSON.stringify(children, null, 2);
        } catch (err) {}
      }, _this.parseJS = function () {
        var children = _this.props.children;

        var js = function js() {
          return eval(children);
        };
        return js.toString();
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Code, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
      }
    }, {
      key: 'render',
      value: function render() {
        var parsed = this.parseJSON() || this.parseJS();
        return React.createElement(
          'code',
          null,
          parsed
        );
      }
    }]);

    return Code;
  }(Component);
}