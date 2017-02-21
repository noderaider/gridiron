'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = data;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _data = require('../actions/data');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

var subscribed = [_constants.STREAM_DATA_START, _constants.STREAM_DATA_META, _constants.STREAM_DATA_RECEIVE, _constants.STREAM_DATA_COMPLETE];

function data() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _data.initialState;
  var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = actions.type,
      payload = actions.payload;

  if (!subscribed.includes(type)) return state;

  var id = payload.id,
      meta = payload.meta,
      batchID = payload.batchID,
      batch = payload.batch;

  should.exist(id, 'id path to data should exist.');
  id.should.be.instanceof(Array, 'id must be an array.');

  var select = (0, _data.idSelector)(id);

  switch (type) {
    case _constants.STREAM_DATA_START:
      return state;
    case _constants.STREAM_DATA_META:
      console.info('SETTING META', meta);
      return state.setIn(select('meta'), _immutable2.default.Map(meta));
    case _constants.STREAM_DATA_RECEIVE:
    case _constants.STREAM_DATA_COMPLETE:
      /*
        const immutableBatch = Immutable.Map(batch.reduce((x, i) => ))
        console.info('IMMUTABLE BATCH', batch, immutableBatch.toJS())
        */
      var newState = state.updateIn(select('results'), function (results) {
        var startIndex = results.size;
        return results.withMutations(function (r) {
          batch.forEach(function (result, i) {
            r.set(startIndex + i, _immutable2.default.Map(result));
          });
        });
      });
      var r = newState.getIn(select('results'));

      console.info('NEW STATE', r);
      return newState;
    default:
      return state;
  }
}