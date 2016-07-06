'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reduxGridCore = require('redux-grid-core');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();

exports.default = function (_ref) {
  var React = _ref.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var cloneElement = React.cloneElement;

  var Propagate = function (_Component) {
    _inherits(Propagate, _Component);

    function Propagate(props) {
      _classCallCheck(this, Propagate);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Propagate).call(this, props));
    }

    _createClass(Propagate, [{
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {}
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var children = _props.children;

        var rest = _objectWithoutProperties(_props, ['children']);

        return cloneElement(children, rest);
      }
    }]);

    return Propagate;
  }(Component);

  Propagate.propTypes = _reduxGridCore.Propagate.PropTypes(React);
  Propagate.defaultProps = _reduxGridCore.Propagate.DefaultProps(React);

  var propagation = function propagation(children) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    return React.createElement(
      Propagate,
      null,
      children
    );
  };

  return Propagate;
};