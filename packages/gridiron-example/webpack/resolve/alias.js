'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.vendorFolder = exports.imagesFolder = exports.stylesFolder = exports.binFolder = exports.appFolder = exports.packageFolder = exports.libFolder = exports.configPath = exports.configServerPath = exports.configClientPath = undefined;

var _config = require('../../config.js');

var _path = require('path');

var configClientPath = exports.configClientPath = (0, _config.resolveRoot)('./config-client.json');
var configServerPath = exports.configServerPath = (0, _config.resolveRoot)('./config-server.json');
var configPath = exports.configPath = (0, _config.resolveRoot)('./config.js');

var libFolder = exports.libFolder = (0, _config.resolveRoot)('./src/lib');
var packageFolder = exports.packageFolder = (0, _config.resolveRoot)('./src/package');
var appFolder = exports.appFolder = (0, _config.resolveRoot)('./src/app');
var binFolder = exports.binFolder = (0, _config.resolveRoot)('./src/bin');

var stylesFolder = exports.stylesFolder = (0, _path.resolve)(appFolder, 'styles');
var imagesFolder = exports.imagesFolder = (0, _path.resolve)(appFolder, 'images');
var vendorFolder = exports.vendorFolder = (0, _path.resolve)(appFolder, 'vendor');

var resolveVendor = function resolveVendor(path) {
        return (0, _path.resolve)(vendorFolder, path);
};

exports.default = function (name) {
        return { 'config': configPath,
                'package': packageFolder,
                'app': appFolder,
                'lib': libFolder,
                'vendor': vendorFolder,
                'styles': stylesFolder,
                'images': imagesFolder
        };
};