"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * PropTypes factory for <Pager /> components.
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { isMaximized: React.PropTypes.bool.isRequired,
    onMaximize: React.PropTypes.func.isRequired,
    onCompress: React.PropTypes.func.isRequired
  };
};

/**
 * DefaultProps factory for <Pager /> components.
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return {};
};