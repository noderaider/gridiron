'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateScrollTop = updateScrollTop;
var UPDATE_SCROLL_TOP = exports.UPDATE_SCROLL_TOP = '@@redux-devtools-grid-monitor/UPDATE_SCROLL_TOP';
function updateScrollTop(scrollTop) {
  return { type: UPDATE_SCROLL_TOP, scrollTop: scrollTop };
}