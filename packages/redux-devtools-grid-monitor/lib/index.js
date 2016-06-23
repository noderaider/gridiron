'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGridMonitor = undefined;

var _gridMonitor = require('./gridMonitor');

var _gridMonitor2 = _interopRequireDefault(_gridMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imports() {
  try {
    var React = require('react');

    var _require = require('redux-devtools');

    var ActionCreators = _require.ActionCreators;

    return { React: React, ActionCreators: ActionCreators };
  } catch (err) {
    console.warn('redux-devtools-grid-monitor: could not import dependencies. If working in linked mode with createGridMonitor factory, you may disregard this message.');
    return { React: { Component: function Component() {},
        PropTypes: { shape: function shape() {
            isRequired: false;
          },
          func: { isRequired: false },
          oneOfType: function oneOfType() {
            isRequired: false;
          }
        }
      },
      ActionCreators: {}
    };
  }
}
exports.default = (0, _gridMonitor2.default)(imports());
var createGridMonitor = exports.createGridMonitor = _gridMonitor2.default;