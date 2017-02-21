'use strict';

var _config = require('../../config');

module.exports = _config.IS_BROWSER ? require('./musical.browser') : {};