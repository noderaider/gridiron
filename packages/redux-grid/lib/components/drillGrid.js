'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = drillGrid;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var should = require('chai').should();

/**
 * <DrillGrid /> factory
 * @param  {Object}    options.ReactVirtualized react-virtualized dependency for a higher order react-virtualized <Grid />.
 * @param  {Object}    options.FixedDataTable   fixed-data-table dependency for a higher order fixed-data-table <Grid />.
 * @param  {...Object} options.rest             The rest of the <Grid /> dependencies.
 * @return {Grid}                               A higher order <Grid /> component.
 */
function drillGrid(_ref) {
  var ReactVirtualized = _ref.ReactVirtualized;
  var FixedDataTable = _ref.FixedDataTable;

  var rest = _objectWithoutProperties(_ref, ['ReactVirtualized', 'FixedDataTable']);

  should.exist(ReactVirtualized || FixedDataTable, 'react-virtualized or fixed-data-table are required for <Grid />');
  return ReactVirtualized ? require('./react-virtualized/drillGrid').default(_extends({ ReactVirtualized: ReactVirtualized }, rest)) : require('./fixed-data-table/drillGrid').default(_extends({ FixedDataTable: FixedDataTable }, rest));
}