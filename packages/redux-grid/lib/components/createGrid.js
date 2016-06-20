'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createGrid;

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var should = require('chai').should();

/**
 * <Grid /> factory
 * @param  {Object}    options.ReactVirtualized react-virtualized dependency for a higher order react-virtualized <Grid />.
 * @param  {Object}    options.FixedDataTable   fixed-data-table dependency for a higher order fixed-data-table <Grid />.
 * @param  {...Object} options.rest             The rest of the <Grid /> dependencies.
 * @return {Grid}                               A higher order <Grid /> component.
 */
function createGrid(_ref) {
  var ReactVirtualized = _ref.ReactVirtualized;
  var FixedDataTable = _ref.FixedDataTable;

  var rest = _objectWithoutProperties(_ref, ['ReactVirtualized', 'FixedDataTable']);

  should.exist(ReactVirtualized || FixedDataTable, 'react-virtualized or fixed-data-table are required for <Grid />');
  return ReactVirtualized ? require('./react-virtualized/createGrid').default(_extends({ ReactVirtualized: ReactVirtualized }, rest)) : require('./fixed-data-table/createGrid').default(_extends({ FixedDataTable: FixedDataTable }, rest));
}

/**
 * Interface factory for <Grid /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
var createPropTypes = exports.createPropTypes = function createPropTypes(_ref2) {
  var PropTypes = _ref2.PropTypes;
  return { mapCols: PropTypes.func.isRequired,
    mapRows: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    maxHeight: PropTypes.number
  };
};

/** Creates mapStateToProps for <Grid /> component */
var createMapStateToProps = exports.createMapStateToProps = function createMapStateToProps() {
  var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var getState = _ref3.getState;
  return function (state) {
    return { state: getState ? getState() : state };
  };
};

/** Creates mapDispatchToProps for <Grid /> component */
var createMapDispatchToProps = exports.createMapDispatchToProps = function createMapDispatchToProps() {
  var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _objectDestructuringEmpty(_ref4);

  return function (dispatch) {
    return {};
  };
};

/**
 * Creates a react-redux style connect function tailed for <Grid />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Grid}                       A higher order <Grid /> component.
 */
var createConnect = exports.createConnect = function createConnect() {
  var _ref5 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var connect = _ref5.connect;
  var getState = _ref5.getState;

  var rest = _objectWithoutProperties(_ref5, ['connect', 'getState']);

  should.exist(connect, 'redux connect is required for <Grid /> connect');
  connect.should.be.a('function');
  var mapStateToProps = createMapStateToProps(_extends({ getState: getState }, rest));
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect');
  mapStateToProps.should.be.a('function');
  var mapDispatchToProps = createMapDispatchToProps(_extends({}, rest));
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect');
  mapDispatchToProps.should.be.a('function');
  return function (Component) {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
  };
};