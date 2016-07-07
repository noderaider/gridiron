'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reduxGridCore = require('redux-grid-core');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

exports.default = function (_ref) {
  var _class, _temp;

  var React = _ref.React;
  var Select = _ref.Select;
  var Component = React.Component;


  return _temp = _class = function (_Component) {
    _inherits(Settings, _Component);

    function Settings() {
      _classCallCheck(this, Settings);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).apply(this, arguments));
    }

    _createClass(Settings, [{
      key: 'render',
      value: function render() {
        return React.createElement('div', null);
      }
    }]);

    return Settings;
  }(Component), _class.propTypes = _reduxGridCore.Settings.PropTypes(React), _class.defaultProps = _reduxGridCore.Settings.DefaultProps(React), _temp;
};