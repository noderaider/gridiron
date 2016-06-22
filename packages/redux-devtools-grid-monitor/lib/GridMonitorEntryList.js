'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridMonitorEntry = require('./GridMonitorEntry');

var _GridMonitorEntry2 = _interopRequireDefault(_GridMonitorEntry);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridMonitorEntryList = function (_Component) {
  _inherits(GridMonitorEntryList, _Component);

  function GridMonitorEntryList() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, GridMonitorEntryList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(GridMonitorEntryList)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.shouldComponentUpdate = _function2.default, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GridMonitorEntryList, [{
    key: 'render',
    value: function render() {
      var elements = [];
      var _props = this.props;
      var theme = _props.theme;
      var actionsById = _props.actionsById;
      var computedStates = _props.computedStates;
      var select = _props.select;
      var skippedActionIds = _props.skippedActionIds;
      var stagedActionIds = _props.stagedActionIds;
      var expandActionRoot = _props.expandActionRoot;
      var expandStateRoot = _props.expandStateRoot;
      var onActionClick = _props.onActionClick;


      for (var i = 0; i < stagedActionIds.length; i++) {
        var actionId = stagedActionIds[i];
        var action = actionsById[actionId].action;
        var _computedStates$i = computedStates[i];
        var state = _computedStates$i.state;
        var error = _computedStates$i.error;

        var previousState = void 0;
        if (i > 0) {
          previousState = computedStates[i - 1].state;
        }
        elements.push(_react2.default.createElement(_GridMonitorEntry2.default, { key: actionId,
          theme: theme,
          select: select,
          action: action,
          actionId: actionId,
          state: state,
          previousState: previousState,
          collapsed: skippedActionIds.indexOf(actionId) > -1,
          error: error,
          expandActionRoot: expandActionRoot,
          expandStateRoot: expandStateRoot,
          onActionClick: onActionClick }));
      }

      return _react2.default.createElement(
        'div',
        null,
        elements
      );
    }
  }]);

  return GridMonitorEntryList;
}(_react.Component);

GridMonitorEntryList.propTypes = {
  actionsById: _react.PropTypes.object,
  computedStates: _react.PropTypes.array,
  stagedActionIds: _react.PropTypes.array,
  skippedActionIds: _react.PropTypes.array,

  select: _react.PropTypes.func.isRequired,
  onActionClick: _react.PropTypes.func.isRequired,
  theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
  expandActionRoot: _react.PropTypes.bool,
  expandStateRoot: _react.PropTypes.bool
};
exports.default = GridMonitorEntryList;