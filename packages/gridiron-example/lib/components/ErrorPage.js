'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPre2 = require('react-pre');

var _reactPre3 = _interopRequireDefault(_reactPre2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _reactPre = (0, _reactPre3.default)({ React: _react2.default }),
    Pre = _reactPre.Pre;

var ErrorPage = function ErrorPage(_ref) {
  var status = _ref.status,
      statusMessage = _ref.statusMessage,
      children = _ref.children,
      _ref$styles = _ref.styles,
      styles = _ref$styles === undefined ? {} : _ref$styles;

  var title = status + ' ERROR | ' + statusMessage;
  return _react2.default.createElement(
    'html',
    { className: styles.html },
    _react2.default.createElement(
      'head',
      null,
      _react2.default.createElement(
        'title',
        null,
        title
      )
    ),
    _react2.default.createElement(
      'body',
      { className: styles.body },
      _react2.default.createElement(
        'h2',
        { className: styles.title },
        title
      ),
      children ? _react2.default.createElement(
        Pre,
        { className: styles.code },
        children
      ) : null
    )
  );
};

ErrorPage.propTypes = { status: _react.PropTypes.number.isRequired,
  statusMessage: _react.PropTypes.string.isRequired,
  children: _react.PropTypes.any,
  styles: _react.PropTypes.object.isRequired
};
ErrorPage.defaultProps = { status: 500,
  statusMessage: 'You broke something!',
  styles: {}
};

exports.default = ErrorPage;