"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * PropTypes factory for <Expander /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  return { visible: React.PropTypes.bool
  };
};

/**
 * DefaultProps factory for <Expander /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
var DefaultProps = exports.DefaultProps = function DefaultProps(React) {
  return { visible: true
  };
};