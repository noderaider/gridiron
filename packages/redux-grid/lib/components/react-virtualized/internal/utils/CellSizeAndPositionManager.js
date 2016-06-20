'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Just-in-time calculates and caches size and position information for a collection of cells.
 */

var CellSizeAndPositionManager = function CellSizeAndPositionManager(_ref) {
  var cellCount = _ref.cellCount;
  var cellSizeGetter = _ref.cellSizeGetter;
  var estimatedCellSize = _ref.estimatedCellSize;

  _classCallCheck(this, CellSizeAndPositionManager);

  _initialiseProps.call(this);

  this._cellSizeGetter = cellSizeGetter;
  this._cellCount = cellCount;
  this._estimatedCellSize = estimatedCellSize;

  // Cache of size and position data for cells, mapped by cell index.
  // Note that invalid values may exist in this map so only rely on cells up to this._lastMeasuredIndex
  this._cellSizeAndPositionData = {};

  // Measurements for cells up to this index can be trusted; cells afterward should be estimated.
  this._lastMeasuredIndex = -1;
}

/**
 * This method returns the size and position for the cell at the specified index.
 * It just-in-time calculates (or used cached values) for cells leading up to the index.
 */


/**
 * Total size of all cells being measured.
 * This value will be completedly estimated initially.
 * As cells as measured the estimate will be updated.
 */


/**
 * Determines a new offset that ensures a certain cell is visible, given the current offset.
 * If the cell is already visible then the current offset will be returned.
 * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
 *
 * @param align Desired alignment within container; one of "auto" (default), "start", or "end"
 * @param containerSize Total size (width or height) of the container
 * @param currentOffset Container's current (x or y) offset
 * @return Offset to use to ensure the specified cell is visible
 */


/**
 * Clear all cached values for cells after the specified index.
 * This method should be called for any cell that has changed its size.
 * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionOfCell() is called.
 */


/**
 * Searches for the cell (index) nearest the specified offset.
 *
 * If no exact match is found the next lowest cell index will be returned.
 * This allows partially visible cells (with offsets just before/above the fold) to be visible.
 */
;

/*
type CellSizeAndPositionManagerConstructorParams = {
  cellCount: number,
  cellSizeGetter: Function,
  estimatedCellSize: number
};

type ConfigureParams = {
  cellCount: number,
  estimatedCellSize: number
};

type GetVisibleCellRangeParams = {
  containerSize: number,
  offset: number
};

type SizeAndPositionData = {
  offset: number,
  size: number
};

type VisibleCellRange = {
  start: ?number,
  stop: ?number
};
*/


var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.configure = function (_ref2) {
    var cellCount = _ref2.cellCount;
    var estimatedCellSize = _ref2.estimatedCellSize;

    _this._cellCount = cellCount;
    _this._estimatedCellSize = estimatedCellSize;
  };

  this.getCellCount = function () {
    return _this._cellCount;
  };

  this.getEstimatedCellSize = function () {
    return _this._estimatedCellSize;
  };

  this.getLastMeasuredIndex = function () {
    return _this._lastMeasuredIndex;
  };

  this.getSizeAndPositionOfCell = function (index) {
    if (index < 0 || index >= _this._cellCount) throw Error('Requested index ' + index + ' is outside of range 0..' + _this._cellCount);

    if (index > _this._lastMeasuredIndex) {
      var lastMeasuredCellSizeAndPosition = _this.getSizeAndPositionOfLastMeasuredCell();
      var offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size;

      for (var i = _this._lastMeasuredIndex + 1; i <= index; i++) {
        var size = _this._cellSizeGetter({ index: i });

        if (size == null || isNaN(size)) {
          throw Error('Invalid size returned for cell ' + i + ' of value ' + size);
        }

        _this._cellSizeAndPositionData[i] = {
          offset: offset,
          size: size
        };

        offset += size;
      }

      _this._lastMeasuredIndex = index;
    }

    return _this._cellSizeAndPositionData[index];
  };

  this.getSizeAndPositionOfLastMeasuredCell = function () {
    return _this._lastMeasuredIndex >= 0 ? _this._cellSizeAndPositionData[_this._lastMeasuredIndex] : {
      offset: 0,
      size: 0
    };
  };

  this.getTotalSize = function () {
    var lastMeasuredCellSizeAndPosition = _this.getSizeAndPositionOfLastMeasuredCell();
    return lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size + (_this._cellCount - _this._lastMeasuredIndex - 1) * _this._estimatedCellSize;
  };

  this.getUpdatedOffsetForIndex = function (_ref3) {
    var _ref3$align = _ref3.align;
    var align = _ref3$align === undefined ? 'auto' : _ref3$align;
    var containerSize = _ref3.containerSize;
    var currentOffset = _ref3.currentOffset;
    var targetIndex = _ref3.targetIndex;

    var datum = _this.getSizeAndPositionOfCell(targetIndex);
    var maxOffset = datum.offset;
    var minOffset = maxOffset - containerSize + datum.size;

    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center':
        return maxOffset - (containerSize + datum.size) / 2;
      default:
        return Math.max(minOffset, Math.min(maxOffset, currentOffset));
    }
  };

  this.getVisibleCellRange = function (_ref4) {
    var containerSize = _ref4.containerSize;
    var offset = _ref4.offset;

    var totalSize = _this.getTotalSize();

    if (totalSize === 0) {
      return {};
    }

    var maxOffset = offset + containerSize;
    var start = _this._findNearestCell(offset);

    var datum = _this.getSizeAndPositionOfCell(start);
    offset = datum.offset + datum.size;

    var stop = start;

    while (offset < maxOffset && stop < _this._cellCount - 1) {
      stop++;

      offset += _this.getSizeAndPositionOfCell(stop).size;
    }

    return {
      start: start,
      stop: stop
    };
  };

  this.resetCell = function (index) {
    return _this._lastMeasuredIndex = index - 1;
  };

  this._binarySearch = function (_ref5) {
    var high = _ref5.high;
    var low = _ref5.low;
    var offset = _ref5.offset;

    var middle = void 0;
    var currentOffset = void 0;

    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      currentOffset = _this.getSizeAndPositionOfCell(middle).offset;

      if (currentOffset === offset) return middle;else if (currentOffset < offset) low = middle + 1;else if (currentOffset > offset) high = middle - 1;
    }

    if (low > 0) return low - 1;
  };

  this._exponentialSearch = function (_ref6) {
    var index = _ref6.index;
    var offset = _ref6.offset;

    var interval = 1;

    while (index < _this._cellCount && _this.getSizeAndPositionOfCell(index).offset < offset) {
      index += interval;
      interval *= 2;
    }

    return _this._binarySearch({
      high: Math.min(index, _this._cellCount - 1),
      low: Math.floor(index / 2),
      offset: offset
    });
  };

  this._findNearestCell = function (offset) {
    if (isNaN(offset)) throw Error('Invalid offset ' + offset + ' specified');

    // Our search algorithms find the nearest match at or below the specified offset.
    // So make sure the offset is at least 0 or no match will be found.
    offset = Math.max(0, offset);

    var lastMeasuredCellSizeAndPosition = _this.getSizeAndPositionOfLastMeasuredCell();
    var lastMeasuredIndex = Math.max(0, _this._lastMeasuredIndex);

    if (lastMeasuredCellSizeAndPosition.offset >= offset) {
      // If we've already measured cells within this range just use a binary search as it's faster.
      return _this._binarySearch({
        high: lastMeasuredIndex,
        low: 0,
        offset: offset
      });
    } else {
      // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
      // The exponential search avoids pre-computing sizes for the full set of cells as a binary search would.
      // The overall complexity for this approach is O(log n).
      return _this._exponentialSearch({
        index: lastMeasuredIndex,
        offset: offset
      });
    }
  };
};

exports.default = CellSizeAndPositionManager;