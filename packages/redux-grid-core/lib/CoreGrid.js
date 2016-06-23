'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var should = require('chai').should();

/**
 * PropTypes factory for <CoreGrid /> components.
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { mapCols: React.PropTypes.func.isRequired,
    mapRows: React.PropTypes.func.isRequired,
    styles: React.PropTypes.object.isRequired,
    theme: React.PropTypes.object.isRequired,
    gridStyle: React.PropTypes.object.isRequired,
    state: React.PropTypes.object.isRequired,
    maxHeight: React.PropTypes.number
  };
};

/**
 * DefaultProps factory for <CoreGrid /> components.
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return { gridStyle: {},
    mapIds: function mapIds(state, index) {
      return index;
    }
  };
};

/** Creates mapStateToProps for <CoreGrid /> component */
var MapStateToProps = exports.MapStateToProps = function MapStateToProps() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var getState = _ref.getState;
  return function (state) {
    return { state: getState ? getState() : state };
  };
};

/** Creates mapDispatchToProps for <CoreGrid /> component */
var MapDispatchToProps = exports.MapDispatchToProps = function MapDispatchToProps() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _objectDestructuringEmpty(_ref2);

  return function (dispatch) {
    return {};
  };
};

/**
 * Creates a react-redux style connect function tailored for <CoreGrid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
var Connect = exports.Connect = function Connect() {
  var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var connect = _ref3.connect;
  var getState = _ref3.getState;

  var rest = _objectWithoutProperties(_ref3, ['connect', 'getState']);

  should.exist(connect, 'redux connect is required for <Grid /> connect');
  connect.should.be.a('function');
  var mapStateToProps = MapStateToProps(_extends({ getState: getState }, rest));
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect');
  mapStateToProps.should.be.a('function');
  var mapDispatchToProps = MapDispatchToProps(_extends({}, rest));
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect');
  mapDispatchToProps.should.be.a('function');
  return function (Component) {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
  };
};