"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * PropTypes factory for <Pager /> components.
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { maxRecords: React.PropTypes.number.isRequired,
    mapRows: React.PropTypes.func.isRequired
  };
};

/**
 * DefaultProps factory for <Pager /> components.
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return { maxRecords: 5 };
};