'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridMonitorButton = require('./GridMonitorButton');

var _GridMonitorButton2 = _interopRequireDefault(_GridMonitorButton);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _reduxDevtoolsThemes = require('redux-devtools-themes');

var themes = _interopRequireWildcard(_reduxDevtoolsThemes);

var _reduxDevtools = require('redux-devtools');

var _actions = require('./actions');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _GridMonitorEntryList = require('./GridMonitorEntryList');

var _GridMonitorEntryList2 = _interopRequireDefault(_GridMonitorEntryList);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var reset = _reduxDevtools.ActionCreators.reset;
var rollback = _reduxDevtools.ActionCreators.rollback;
var commit = _reduxDevtools.ActionCreators.commit;
var sweep = _reduxDevtools.ActionCreators.sweep;
var toggleAction = _reduxDevtools.ActionCreators.toggleAction;


var styles = { container: { fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
    direction: 'ltr'
  },
  buttonBar: { textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  elements: { position: 'absolute',
    left: 0,
    right: 0,
    top: 38,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto'
  }
};

var GridMonitor = function (_Component) {
  _inherits(GridMonitor, _Component);

  function GridMonitor() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, GridMonitor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(GridMonitor)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.shouldComponentUpdate = _function2.default, _this.updateScrollTop = (0, _lodash2.default)(function () {
      var node = _this.refs.container;
      _this.props.dispatch((0, _actions.updateScrollTop)(node ? node.scrollTop : 0));
    }, 500), _this.handleRollback = function () {
      return _this.props.dispatch(rollback());
    }, _this.handleSweep = function () {
      return _this.props.dispatch(sweep());
    }, _this.handleCommit = function () {
      return _this.props.dispatch(commit());
    }, _this.handleToggleAction = function (id) {
      return _this.props.dispatch(toggleAction(id));
    }, _this.handleReset = function () {
      return _this.props.dispatch(reset());
    }, _this.getTheme = function () {
      var theme = _this.props.theme;

      if (typeof theme !== 'string') {
        return theme;
      }

      if (typeof themes[theme] !== 'undefined') {
        return themes[theme];
      }

      console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
      return themes.nicinabox;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GridMonitor, [{
    key: 'scroll',
    value: function scroll() {
      var node = this.refs.container;
      if (!node) {
        return;
      }
      if (this.scrollDown) {
        var offsetHeight = node.offsetHeight;
        var scrollHeight = node.scrollHeight;

        node.scrollTop = scrollHeight - offsetHeight;
        this.scrollDown = false;
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var node = this.refs.container;
      if (!node || !this.props.monitorState) {
        return;
      }

      if (this.props.preserveScrollTop) {
        node.scrollTop = this.props.monitorState.initialScrollTop;
        node.addEventListener('scroll', this.updateScrollTop);
      } else {
        this.scrollDown = true;
        this.scroll();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var node = this.refs.container;
      if (node && this.props.preserveScrollTop) {
        node.removeEventListener('scroll', this.updateScrollTop);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var node = this.refs.container;
      if (!node) {
        this.scrollDown = true;
      } else if (this.props.stagedActionIds.length < nextProps.stagedActionIds.length) {
        var scrollTop = node.scrollTop;
        var offsetHeight = node.offsetHeight;
        var scrollHeight = node.scrollHeight;


        this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
      } else {
        this.scrollDown = false;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.scroll();
    }
  }, {
    key: 'render',
    value: function render() {
      var theme = this.getTheme();
      var _props = this.props;
      var actionsById = _props.actionsById;
      var skippedActionIds = _props.skippedActionIds;
      var stagedActionIds = _props.stagedActionIds;
      var computedStates = _props.computedStates;
      var select = _props.select;
      var expandActionRoot = _props.expandActionRoot;
      var expandStateRoot = _props.expandStateRoot;


      var entryListProps = { theme: theme,
        actionsById: actionsById,
        skippedActionIds: skippedActionIds,
        stagedActionIds: stagedActionIds,
        computedStates: computedStates,
        select: select,
        expandActionRoot: expandActionRoot,
        expandStateRoot: expandStateRoot,
        onActionClick: this.handleToggleAction
      };

      return _react2.default.createElement(
        'div',
        { style: _extends({}, styles.container, { backgroundColor: theme.base00 }) },
        _react2.default.createElement(
          'div',
          { style: _extends({}, styles.buttonBar, { borderColor: theme.base02 }) },
          _react2.default.createElement(
            _GridMonitorButton2.default,
            {
              theme: theme,
              onClick: this.handleReset,
              enabled: true },
            'Reset'
          ),
          _react2.default.createElement(
            _GridMonitorButton2.default,
            {
              theme: theme,
              onClick: this.handleRollback,
              enabled: computedStates.length > 1 },
            'Revert'
          ),
          _react2.default.createElement(
            _GridMonitorButton2.default,
            {
              theme: theme,
              onClick: this.handleSweep,
              enabled: skippedActionIds.length > 0 },
            'Sweep'
          ),
          _react2.default.createElement(
            _GridMonitorButton2.default,
            {
              theme: theme,
              onClick: this.handleCommit,
              enabled: computedStates.length > 1 },
            'Commit'
          )
        ),
        _react2.default.createElement(
          'div',
          { style: styles.elements, ref: 'container' },
          _react2.default.createElement(_GridMonitorEntryList2.default, entryListProps)
        )
      );
    }
  }]);

  return GridMonitor;
}(_react.Component);

GridMonitor.update = _reducers2.default;
GridMonitor.propTypes = { dispatch: _react.PropTypes.func,
  computedStates: _react.PropTypes.array,
  actionsById: _react.PropTypes.object,
  stagedActionIds: _react.PropTypes.array,
  skippedActionIds: _react.PropTypes.array,
  monitorState: _react.PropTypes.shape({ initialScrollTop: _react.PropTypes.number }),
  preserveScrollTop: _react.PropTypes.bool,
  select: _react.PropTypes.func.isRequired,
  theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]),
  expandActionRoot: _react.PropTypes.bool,
  expandStateRoot: _react.PropTypes.bool
};
GridMonitor.defaultProps = { select: function select(state) {
    return state;
  },
  theme: 'nicinabox',
  preserveScrollTop: true,
  expandActionRoot: true,
  expandStateRoot: true
};
exports.default = GridMonitor;