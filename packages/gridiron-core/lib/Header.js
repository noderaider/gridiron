'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


/** PropTypes factory for <Header /> components. */
var PropTypes = exports.PropTypes = function PropTypes(React) {
  var Types = React.PropTypes;

  var sortShape = { direction: Types.oneOf(['asc', 'desc'])
  };

  return { theme: Types.object.isRequired,
    styles: Types.object.isRequired,
    status: Types.object.isRequired,
    filter: Types.object,
    checkbox: Types.object,
    radio: Types.object
  };
};

/** DefaultProps factory for <Header/> components. */
var DefaultProps = exports.DefaultProps = function DefaultProps() {
  return { theme: {},
    styles: {},
    status: {}
  };
};