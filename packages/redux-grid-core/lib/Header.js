"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * PropTypes factory for <Header /> components.
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { theme: React.PropTypes.object.isRequired,
    styles: React.PropTypes.object.isRequired,
    sort: React.PropTypes.object,
    filter: React.PropTypes.object,
    checkbox: React.PropTypes.object,
    radio: React.PropTypes.object
  };
};

/**
 * DefaultProps factory for <Header/> components.
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return { theme: {},
    styles: {}
  };
};