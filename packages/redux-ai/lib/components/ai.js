'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ai;

var _solvent2 = require('solvent');

var _solvent3 = _interopRequireDefault(_solvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ai(deps) {
  var _solvent = (0, _solvent3.default)({ React: 'object' })(deps);

  var React = _solvent.React;
  var Component = React.Component;
  var PropTypes = React.PropTypes;


  return function (_Component) {
    _inherits(AI, _Component);

    function AI() {
      _classCallCheck(this, AI);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(AI).apply(this, arguments));
    }

    return AI;
  }(Component);
}