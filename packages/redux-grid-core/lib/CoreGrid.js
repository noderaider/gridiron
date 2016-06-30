'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var should = require('chai').should();

/**
 * PropTypes factory for <CoreGrid /> components.
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { mapCols: React.PropTypes.func.isRequired,
    mapRows: React.PropTypes.func.isRequired,
    cols: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    styles: React.PropTypes.object.isRequired,
    theme: React.PropTypes.object.isRequired,
    gridStyle: React.PropTypes.object.isRequired
    //, state: React.PropTypes.object.isRequired
    , maxHeight: React.PropTypes.number,
    header: React.PropTypes.any,
    footer: React.PropTypes.any,
    isMaximized: React.PropTypes.bool.isRequired
  };
};

/**
 * DefaultProps factory for <CoreGrid /> components.
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return { gridStyle: {},
    mapIds: function mapIds(state, index) {
      return index;
    },
    isMaximized: false
  };
};

/** Creates mapStateToProps for <CoreGrid /> component */
var MapStateToProps = exports.MapStateToProps = function MapStateToProps(deps) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var getState = _ref.getState;
  return function (state, ownProps) {
    var resolvedState = getState ? getState() : state;
    return { cols: ownProps.mapCols(resolvedState),
      rows: ownProps.mapRows(resolvedState)
    };
  };
};

/** Creates mapDispatchToProps for <CoreGrid /> component */
var MapDispatchToProps = exports.MapDispatchToProps = function MapDispatchToProps(deps) {
  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var getState = _ref2.getState;
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

  var rest = _objectWithoutProperties(_ref3, ['connect']);

  var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var getState = _ref4.getState;

  should.exist(connect, 'redux connect is required for <Grid /> connect');
  connect.should.be.a('function');
  var mapStateToProps = MapStateToProps(rest, { getState: getState });
  should.exist(mapStateToProps, 'mapStateToProps is required for <Grid /> connect');
  mapStateToProps.should.be.a('function');
  var mapDispatchToProps = MapDispatchToProps(rest, { getState: getState });
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Grid /> connect');
  mapDispatchToProps.should.be.a('function');
  return function (Component) {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
  };
};