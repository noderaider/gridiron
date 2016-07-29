'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _universalStyles = require('universal-styles');

var _universalStyles2 = _interopRequireDefault(_universalStyles);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra (style-loader)
 * Refactored by Cole Chamberlain <cole.chamberlain@gmail.com> @noderaider (ES2016 / universal-style-loader)
 */

var universalContext = (0, _universalStyles2.default)();
exports.default = universalContext(function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  function memoize(fn) {
    var cache = {};
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var stringifiedArgs = JSON.stringify(args);
      var result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn.apply(undefined, args);
      return result;
    };
  }

  var isOldIE = memoize(function () {
    return (/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())
    );
  });
  var getHeadElement = memoize(function () {
    return document.head || document.getElementsByTagName('head')[0];
  });
  var stylesInDOM = {};
  var singletonElement = null;
  var singletonCounter = 0;
  var styleElementsInsertedAtTop = [];

  function addStyles(list, options, meta) {
    options = options || {};
    // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
    // tags it will allow on a page
    if (typeof options.singleton === 'undefined') options.singleton = isOldIE();

    // By default, add <style> tags to the bottom of <head>.
    if (typeof options.insertAt === 'undefined') options.insertAt = 'bottom';

    var styles = listToStyles(list);
    addStylesToDOM(styles, options, meta);

    return function update(newList) {
      var mayRemove = [];
      for (var i = 0; i < styles.length; i++) {
        var item = styles[i];
        var domStyle = stylesInDOM[item.id];
        domStyle.refs--;
        mayRemove.push(domStyle);
      }
      if (newList) {
        var newStyles = listToStyles(newList);
        addStylesToDOM(newStyles, options, meta);
      }
      for (var i = 0; i < mayRemove.length; i++) {
        var domStyle = mayRemove[i];
        if (domStyle.refs === 0) {
          for (var j = 0; j < domStyle.parts.length; j++) {
            domStyle.parts[j]();
          }delete stylesInDOM[domStyle.id];
        }
      }
    };
  }

  function addStylesToDOM(styles, options, meta) {
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i];
      var domStyle = stylesInDOM[item.id];
      if (domStyle) {
        domStyle.refs++;
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j](item.parts[j]);
        }
        for (; j < item.parts.length; j++) {
          domStyle.parts.push(addStyle(item.parts[j], options, meta));
        }
      } else {
        var parts = [];
        for (var j = 0; j < item.parts.length; j++) {
          parts.push(addStyle(item.parts[j], options, meta));
        }
        stylesInDOM[item.id] = { id: item.id, refs: 1, parts: parts };
      }
    }
  }

  function listToStyles(list) {
    var styles = [];
    var newStyles = {};
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var id = item[0];
      var css = item[1];
      var media = item[2];
      var sourceMap = item[3];
      var part = { css: css, media: media, sourceMap: sourceMap };
      if (!newStyles[id]) styles.push(newStyles[id] = { id: id, parts: [part] });else newStyles[id].parts.push(part);
    }
    return styles;
  }

  function insertStyleElement(options, styleElement) {
    var head = getHeadElement();
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
    if (options.insertAt === 'top') {
      if (!lastStyleElementInsertedAtTop) {
        head.insertBefore(styleElement, head.firstChild);
      } else if (lastStyleElementInsertedAtTop.nextSibling) {
        head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
      } else {
        head.appendChild(styleElement);
      }
      styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
      head.appendChild(styleElement);
    } else {
      throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
  }

  function removeStyleElement(styleElement) {
    styleElement.parentNode.removeChild(styleElement);
    var idx = styleElementsInsertedAtTop.indexOf(styleElement);
    if (idx >= 0) styleElementsInsertedAtTop.splice(idx, 1);
  }

  function createStyleElement(options, meta) {
    //console.trace('createStyleElement => ', util.inspect(options))
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    setMetaAttributes(styleElement, meta);
    insertStyleElement(options, styleElement);
    return styleElement;
  }

  function createLinkElement(options, meta) {
    //console.trace('createLinkElement => ', util.inspect(options))
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    setMetaAttributes(linkElement, meta);
    insertStyleElement(options, linkElement);
    return linkElement;
  }

  function setMetaAttributes(element, meta) {
    if (meta.resourcePath) element.setAttribute('data-resource-path', meta.resourcePath);
  }

  function addStyle(obj, options, meta) {
    //console.trace('addStyle => ', util.inspect({ obj, options }))
    var styleElement, update, remove;

    if (options.singleton) {
      var styleIndex = singletonCounter++;
      styleElement = singletonElement || (singletonElement = createStyleElement(options, meta));
      update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
      remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
    } else if (obj.sourceMap && typeof URL === 'function' && typeof URL.createObjectURL === 'function' && typeof URL.revokeObjectURL === 'function' && typeof Blob === 'function' && typeof btoa === 'function') {
      styleElement = createLinkElement(options, meta);
      update = updateLink.bind(null, styleElement);
      remove = function remove() {
        removeStyleElement(styleElement);
        if (styleElement.href) URL.revokeObjectURL(styleElement.href);
      };
    } else {
      styleElement = createStyleElement(options, meta);
      update = applyToTag.bind(null, styleElement);
      remove = function remove() {
        removeStyleElement(styleElement);
      };
    }

    update(obj);

    return function updateStyle(newObj) {
      if (newObj) {
        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
        update(obj = newObj);
      } else {
        remove();
      }
    };
  }

  var replaceText = function () {
    var textStore = [];

    return function (index, replacement) {
      textStore[index] = replacement;
      return textStore.filter(Boolean).join('\n');
    };
  }();

  function applyToSingletonTag(styleElement, index, remove, obj) {
    var css = remove ? '' : obj.css;

    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = replaceText(index, css);
    } else {
      var cssNode = document.createTextNode(css);
      var childNodes = styleElement.childNodes;
      if (childNodes[index]) styleElement.removeChild(childNodes[index]);
      if (childNodes.length) styleElement.insertBefore(cssNode, childNodes[index]);else styleElement.appendChild(cssNode);
    }
  }

  function applyToTag(styleElement, obj) {
    var css = obj.css;
    var media = obj.media;

    if (media) styleElement.setAttribute('media', media);

    if (styleElement.styleSheet) styleElement.styleSheet.cssText = css;else {
      while (styleElement.firstChild) {
        styleElement.removeChild(styleElement.firstChild);
      }
      styleElement.appendChild(document.createTextNode(css));
    }
  }

  function updateLink(linkElement, obj) {
    var css = obj.css;
    var sourceMap = obj.sourceMap;

    if (sourceMap) {
      // http://stackoverflow.com/a/26603875
      css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */';
    }

    var blob = new Blob([css], { type: 'text/css' });
    var oldSrc = linkElement.href;
    linkElement.href = URL.createObjectURL(blob);
    if (oldSrc) URL.revokeObjectURL(oldSrc);
  }

  return addStyles.apply(undefined, args);
});