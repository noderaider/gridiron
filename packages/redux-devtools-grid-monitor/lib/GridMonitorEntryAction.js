'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJsonTree = require('react-json-tree');

var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  actionBar: {
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 16
  },
  payload: {
    margin: 0,
    overflow: 'auto'
  }
};

var GridMonitorEntryAction = function (_Component) {
  _inherits(GridMonitorEntryAction, _Component);

  function GridMonitorEntryAction(props) {
    _classCallCheck(this, GridMonitorEntryAction);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GridMonitorEntryAction).call(this, props));

    _this.shouldExpandNode = _this.shouldExpandNode.bind(_this);
    return _this;
  }

  _createClass(GridMonitorEntryAction, [{
    key: 'renderPayload',
    value: function renderPayload(payload) {
      return _react2.default.createElement(
        'div',
        { style: _extends({}, styles.payload, {
            backgroundColor: this.props.theme.base00
          }) },
        Object.keys(payload).length > 0 ? _react2.default.createElement(_reactJsonTree2.default, { theme: this.props.theme,
          isLightTheme: false,
          keyPath: ['action'],
          data: payload,
          shouldExpandNode: this.shouldExpandNode }) : ''
      );
    }
  }, {
    key: 'shouldExpandNode',
    value: function shouldExpandNode() {
      return this.props.expandActionRoot;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$action = this.props.action;
      var type = _props$action.type;

      var payload = _objectWithoutProperties(_props$action, ['type']);

      return _react2.default.createElement(
        'div',
        { style: _extends({
            backgroundColor: this.props.theme.base02,
            color: this.props.theme.base06
          }, this.props.style) },
        _react2.default.createElement(
          'div',
          { style: styles.actionBar,
            onClick: this.props.onClick },
          type !== null && type.toString()
        ),
        !this.props.collapsed ? this.renderPayload(payload) : ''
      );
    }
  }]);

  return GridMonitorEntryAction;
}(_react.Component);

exports.default = GridMonitorEntryAction;