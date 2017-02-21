'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.idSelector = exports.initialState = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.streamData = streamData;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxActions = require('redux-actions');

var _papaparse = require('papaparse');

var _papaparse2 = _interopRequireDefault(_papaparse);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var should = require('chai').should();

var streamDataStart = (0, _reduxActions.createAction)(_constants.STREAM_DATA_START, function (id, opts) {
  return { id: id, opts: opts };
});
var streamDataMeta = (0, _reduxActions.createAction)(_constants.STREAM_DATA_META, function (id, meta) {
  return { id: id, meta: meta };
});
var streamDataReceive = (0, _reduxActions.createAction)(_constants.STREAM_DATA_RECEIVE, function (id, batchID, batch) {
  return { id: id, batchID: batchID, batch: batch };
});
var streamDataComplete = (0, _reduxActions.createAction)(_constants.STREAM_DATA_COMPLETE, function (id, results, file) {
  return { id: id, results: results, file: file };
});

var bucketUrl = 'https://s3-us-west-2.amazonaws.com/gridiron-data';
var s3 = function s3(path) {
  return bucketUrl + '/' + path;
};

var initialState = exports.initialState = _immutable2.default.Map({ openflights: _immutable2.default.Map({ airlines: _immutable2.default.Map({ url: s3('openflights/airlines.csv'),
      results: _immutable2.default.OrderedMap(),
      meta: _immutable2.default.Map({ columns: [] })
    }),
    airports: _immutable2.default.Map({ url: s3('openflights/airports.csv'),
      results: _immutable2.default.OrderedMap(),
      meta: _immutable2.default.Map({ columns: [] })
    }),
    routes: _immutable2.default.Map({ url: s3('openflights/routes.csv'),
      results: _immutable2.default.OrderedMap(),
      meta: _immutable2.default.Map({ columns: [] })
    })
  })
});

var idSelector = exports.idSelector = function idSelector(id) {
  return function () {
    for (var _len = arguments.length, pathIn = Array(_len), _key = 0; _key < _len; _key++) {
      pathIn[_key] = arguments[_key];
    }

    return [].concat(_toConsumableArray(id), pathIn);
  };
};

_papaparse2.default.SCRIPT_PATH = '/static/papaparse.min.js';
function streamData(id) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$batchSize = _ref.batchSize,
      batchSize = _ref$batchSize === undefined ? 100 : _ref$batchSize;

  var select = idSelector(id);
  return function (dispatch, getState) {
    var state = getState();
    var url = initialState.getIn(select('url'));
    dispatch(streamDataStart(id, { batchSize: batchSize }));
    var batch = [];
    var batchID = 0;
    _papaparse2.default.parse(url, { download: true,
      worker: true,
      dynamicTyping: true,
      preview: 100,
      header: true,
      step: function step(results, parser) {
        results.data.length.should.eql(1);

        var _results$data = _slicedToArray(results.data, 1),
            datum = _results$data[0];

        if (batchID === 0 && batch.length === 0) {
          var columns = Object.keys(datum);
          console.info('COLUMNS', columns);
          dispatch(streamDataMeta(id, { columns: columns }));
        }
        batch.push(datum);
        if (batch.length >= batchSize) {
          dispatch(streamDataReceive(id, batchID, batch));
          //parser.pause()
          batchID++;
          batch = [];
        }
        /*
        if(results.errors)
          console.error('ERRORS', results.errors)
        */
      }
      /*
      , complete: (results, file) => {
        if(results.data) {
          batch.push(results.data)
        }
        dispatch(streamDataComplete(id, batch, file))
        //console.log('Parsing complete', results, file)
      }
      */
    });
  };
}