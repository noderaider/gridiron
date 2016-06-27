'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = arrows;

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function arrows(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  return function (_Component) {
    _inherits(Arrows, _Component);

    function Arrows() {
      _classCallCheck(this, Arrows);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Arrows).apply(this, arguments));
    }

    _createClass(Arrows, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
      }
    }, {
      key: 'render',
      value: function render() {
        var children = this.props.children;

        return React.createElement(
          'span',
          null,
          children.map(function (x, i) {
            return React.createElement(
              'span',
              { key: i },
              x,
              ' ',
              i < children.length - 1 ? React.createElement('i', { style: { fontSize: '0.7em', color: 'rgba(50, 50, 50, 1)' }, className: 'fa fa-caret-right fa-xs' }) : null,
              ' '
            );
          })
        );
      }
    }]);

    return Arrows;
  }(Component);
}