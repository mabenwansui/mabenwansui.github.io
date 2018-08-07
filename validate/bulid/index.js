/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_valid__ = __webpack_require__(15);

class Base extends __WEBPACK_IMPORTED_MODULE_0__lib_valid__["a" /* default */] {
  constructor(element, options = {}) {
    super(...arguments);
    this.namespace = 'valid';
  }
  getElement(element) {
    return element.is(':radio, :checkbox') ? element.closest('[valid]') : element;
  }
  localization(element) {
    let ui = element.attr('data-ui');
    if (ui) {
      switch (ui.toLowerCase()) {
        case 'selectui':
          element = element.parent();
          break;
        default:
          element = element.parent().find(`.${ui}`);
      }
    } else if (element.is(':hidden')) {
      element = element.closest(':not(:hidden)');
    }
    return element;
  }
  highlight(element, type) {
    element = this.localization(this.getElement(element));
    type === 'show' ? element.addClass('valid-error') : element.removeClass('valid-error');
  }
  submit() {
    let that = this;
    this.form.on('submit', function (event, valid = false) {
      if (valid === false) {
        that.scan(flag => {
          if (flag && that.options.success() === true) that.form.trigger('submit', [true]);
        });
        return false;
      } else {
        return true;
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["a"] = (Base);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = lang;
const alias = {
  '*': 'required',
  'e': 'email',
  'n': 'number',
  'm': 'mobile'
};
/* harmony export (immutable) */ __webpack_exports__["a"] = alias;


function lang(lang = 'cn') {
  let cn = {
    required: '请填写$title !',
    select_required: '请选择$title !',
    length_max: '$title不能多于$max个字 !',
    length_min: '$title不能少于$min个字 !',
    number_max: '$title不能大于$max !',
    number_min: '$title不能小于$min !',
    checked_min: '$title至少选择$min项 !',
    checked_max: '$title最多选择$max项 !',
    email: '请填写正确的$title !',
    mobile: '请填写正确的$title !',
    phone: '请填写正确的$title !',
    url: '请填写正确的$title !',
    idcard: '请填写正确的$title !',
    repeat: '请填写正确的$title',
    some: '请填写正确的$title',
    not: '请填写正确的$title',
    number: '$title请填写整数 !',
    float: '$title请填写数字 !',
    mobile: '$title输入不正确 !',
    pattern: '$title不符合规范 !',
    higher: '结束$title不能小于开始$title',
    repassword: '两次填写的密码不一致'
  };
  let en = {};
  return eval(lang);
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getJQelement */
/* harmony export (immutable) */ __webpack_exports__["c"] = jsonFormat;
/* unused harmony export forElement */
/* harmony export (immutable) */ __webpack_exports__["b"] = attrToJson;
/* harmony export (immutable) */ __webpack_exports__["d"] = rulesMerge;
/* harmony export (immutable) */ __webpack_exports__["a"] = arrMerge;
/* unused harmony export getScrollElement */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(3);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };


function getJQelement(element, form = 'form') {
  if (!element) return;
  if (typeof element === 'string') {
    element = /^[.#]/.test(element) ? $(element, form) : $(`[name='${element}']`, form);
  } else if (element instanceof jQuery) {
    element = element;
  } else {
    element = $(element, form);
  }
  return element.length > 0 ? element : false;
}
function formatItem(type, title) {
  if (/^for=|^[a-z]+\s*=\s*(['"])[^'"]+\1$/.test(type)) return [{ type, msg: '' }];
  let [t1, t2] = (type => {
    type = type.match(/^([^()]*?(?:\(.*?\))?)-([^()]*?(?:\(.*?\))?)$/) || [];
    return type.slice(1);
  })(type);
  let prefix = t2 ? type.replace(/^(\D*).*/, '$1') : ''; //取出类似于n这样的字母
  let reTypeRange = (type, range, prefix) => {
    let msg = '',
        flag = false;
    type = type.replace(/^([n]?)(\d+)(\((.+)\))?$/, (all, $1, $2, $3, $4) => {
      flag = true;
      if ($4) msg = $4.replace(/\$/g, title);
      return prefix + range + '=' + $2;
    });
    return flag ? { type, msg } : false;
  };
  let reType = type => {
    let msg = '';
    type = type.replace(/^([^()]+)(\((.+)\))?$/, (all, $1, $2, $3) => {
      if ($3) msg = $3.replace(/\$/g, title);
      return __WEBPACK_IMPORTED_MODULE_0__config__["a" /* alias */][$1] || $1;
    });
    return { type, msg };
  };
  return t2 ? [reTypeRange(t1, 'min', prefix), reTypeRange(t2, 'max', prefix)] : [reTypeRange(type, 'min', prefix) || reType(type)];
}

function jsonFormat(type, title) {
  if (!type) return [];
  if (typeof type === 'string') type = type.match(/([^,\s]+=([/'"])[^/'"]+\2(\([^)]*\))?)|([^,\s]+\([^)]*\))|([^,\s]+)/g) || [];
  type = type.reduce((a, b) => {
    return [].push.apply(a, formatItem(b, title)), a;
  }, []);
  return type;
}
/*
  valid="用户名|*, maben, s10-15"
  valid-required-msg=""
  valid-error-msg=""
*/

//对有for的进行 两个元素相互绑定对象
function forElement(element, type, form) {
  let forEle = getJQelement(type.indexOf('for=') > -1 ? type.replace(/^.*for=([^,]+).*$/, '$1') : '', form);
  if (forEle) {
    let mergeDataValidFor = (element, forElement) => {
      let ele = element.data('valid-for');
      ele = ele ? ele.add(forElement) : forElement;
      element.data('valid-for', ele);
    };
    mergeDataValidFor(forEle, element);
    mergeDataValidFor(element, forEle);
  }
  return forEle;
}

function attrToJson(element, form) {
  element = $(element);
  let prefix = 'valid';
  let attr = element.attr(prefix).split(/\s*\|\s*/);
  let [title, type] = attr.length > 1 ? attr : ['', attr[0]];
  let msg = type => {
    type = element.attr(`${prefix}-${type}`);
    return type ? type.replace('$', title) : false;
  };
  let obj = {
    title,
    forElement: forElement(element, type, form),
    msg: msg('error') || false
  };

  if (/input|select|textarea/i.test(element[0].tagName)) {
    return _extends({}, obj, { type: jsonFormat(type, title), element });
  } else {
    return _extends({}, obj, {
      type: jsonFormat(type, title),
      element: (() => [element.find(':checkbox'), element.find(':radio')].reduce((a, b) => a.length > b.length ? a : b))()
    });
  }
}
/*
  将options里的自定义规则放到rules里面
*/
function rulesMerge(options, defaultOptions, callback) {
  Object.keys(options).forEach(v => {
    if (!(v in defaultOptions) && typeof options[v] === 'function') callback(v, options[v]);
  });
}

function arrMerge(a1, a2) {
  a2.forEach((v2, index2) => {
    if (!a1.some((v1, index1) => {
      if (v1.element[0] === v2.element[0]) {
        a1[index1] = v2;
        return true;
      }
    })) {
      a1.push(v2);
    }
  });
  return a1;
}

function getScrollElement(element) {
  element = element.parents().filter(function () {
    let val = $(this).css('overflow');
    return val === 'auto' || val === 'scroll' ? true : false;
  });
  return element.length > 0 ? element : $('html, body');
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_index_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_alert_tips_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_h5_dialog_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_none_js__ = __webpack_require__(24);



//import DefaultTips from './ui/default.tips.js';

const pluginName = 'validate';

let selectUI = type => {
  switch (type) {
    case 'none':
      return __WEBPACK_IMPORTED_MODULE_3__ui_none_js__["a" /* default */];
    //case 'default':
    //return DefaultTips;
    case 'h5dialog':
      return __WEBPACK_IMPORTED_MODULE_2__ui_h5_dialog_js__["a" /* default */];
    default:
      return __WEBPACK_IMPORTED_MODULE_1__ui_alert_tips_js__["a" /* default */];
  }
};

$.fn[pluginName] = function (...arg) {
  if (typeof arg[0] === 'string') {
    let method = arg[0];
    let $this = $(this).is('form') ? $(this) : $(this).closest('form');
    let plugin = $this.data('plugin_' + pluginName);
    switch (method) {
      case "getClass":
        return plugin;
      default:
        return $this.each(function () {
          if (plugin && plugin[method]) plugin[method].apply(plugin, arg.splice(1));
        });
    };
  } else {
    return this.each(function () {
      let plugin = $(this).data('plugin_' + pluginName);
      if (plugin) {
        return;
      } else {
        let options = arg[0];
        if (typeof options === 'function') options = { success: options };
        let curUI = selectUI(options.ui);
        $(this).data('plugin_' + pluginName, new curUI($(this), options));
      }
    });
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".valid-error{\n  border-color: #ff6555!important;\n  color: #cc0000!important;\n}\n\n.loader{\n  width: 22px; height: 22px;\n}\n\n.loader .ball-clip-rotate > div {\n  background-color: #ccc;\n  border-radius: 100%;\n  margin: 2px;\n  border: 2px solid #ccc;\n  border-bottom-color: transparent;\n  height: 14px;\n  width: 14px;\n  background: transparent !important;\n  display: inline-block;\n  animation: rotate 0.6s 0s linear infinite; \n}  \n\n@keyframes rotate {\n  0% {transform: rotate(0deg);}\n  100% {transform: rotate(360deg);} \n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(10)
var ieee754 = __webpack_require__(11)
var isArray = __webpack_require__(12)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__liepin_jquery_AlertTs__ = __webpack_require__(18);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



let dataMsg = 'valid-error-msg-forplugin';
let defaultStyle = {
  act: 'hide',
  cssStyle: 'error',
  top: 2,
  left: 15,
  css: {
    padding: '5px 10px'
  }
};

class AlertTips extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor(element, options = {}) {
    super(...arguments);
    this.options = $.extend(true, { alertTsUI: defaultStyle }, this.options);
    this.lastElement;
    this.bindEvent();
    this.submit();
  }
  show(element, msg) {
    element = this.getElement(element);
    if (!msg) msg = element.attr(dataMsg) || '';
    if (this.lastElement) {
      if (this.lastElement.element[0] === element[0] && msg === this.lastElement.msg) return;
      this.hide(this.lastElement.element);
    }
    let addui = (ui => ui ? eval(`(${ui})`) : false)(element.attr('valid-ui'));
    addui = addui ? $.extend({}, true, this.options.alertTsUI, addui) : this.options.alertTsUI;
    this.localization(element).AlertTs(_extends({}, addui, { content: msg })).AlertTs('show');
    this.lastElement = { element, msg };
  }
  hide(element) {
    element = element || this.lastElement && this.lastElement.element || false;
    if (element) element = this.localization(this.getElement(element));
    if (element && element.AlertTs) {
      element.AlertTs('hide');
      if (this.lastElement && this.lastElement.element[0] === element[0]) {
        this.lastElement = null;
      }
    }
  }
  bindEvent() {
    let that = this;
    function focus(flag) {
      if (!$(this).hasClass('valid-error') || flag === true) return;
      that.show($(this));
    }
    function change(event, once = false) {
      let $this = $(this);
      let notShowTips = $this.is(':radio, :checkbox, :hidden') ? false : true;
      if ($this.is(':radio, :checkbox')) {
        $this = $this.closest('[valid]');
      } else {
        if ($this.val() === '' && !$this.attr(dataMsg)) return;
      }
      that.scan($this, flag => {
        //对绑定了for的元素触发相互change
        let ele = $(this).data('valid-for');
        if (ele && !once) change.call(ele, event, true);
      }, notShowTips);
    }
    function blur(event, once = false) {
      if (!$(this).is(':radio, :checkbox, select')) {
        change.call($(this), event);
      }
      that.hide();
    }
    let eventStr = 'input:not(:submit, :button), textarea, select';
    this.form.on('focus.' + this.namespace, eventStr, focus).on('change.' + this.namespace, eventStr, change).on('blur.' + this.namespace, eventStr, blur);
  }
  scan(validItems = this.form, callback = $.noop, notips) {
    let that = this;
    if (typeof validItems === 'function') {
      [validItems, callback, notips] = [...arguments].reduce((a, b) => (a.push(b), a), [this.form]);
    }
    this.validScan(validItems, items => {
      let isForm = validItems.is('form');
      if (isForm) this.highlight(this.form.find('.valid-error').removeAttr(dataMsg), 'hide');
      let fail = items.reduce((a, v) => {
        let element = this.getElement(v.element);
        if (v.valid === true) {
          this.highlight(v.element, 'hide');
          element.removeAttr(dataMsg);
          this.hide(element);
        } else {
          if (element.val() === '' && !element.attr(dataMsg) && !isForm && !v.element.is(':checkbox, :radio')) {} else {
            element.attr(dataMsg, v.msg);
            this.highlight(element, 'show');
          }
          a.push({ element, msg: v.msg });
        }
        return a;
      }, []);
      if (notips !== true && fail.length > 0) {
        let [item] = fail;
        if (isForm) {
          item.element.trigger('focus.' + this.namespace, [true]);

          let top = this.localization(item.element).offset().top;
          if (top < (document.documentElement.scrollTop || document.body.scrollTop)) {
            window.scrollTo(0, top - 80);
          }
        }
        this.show(item.element, item.msg);
      };
      if (isForm) this.options.fail.call(this, fail);
      callback.call(this, fail.length > 0 ? false : true);
    });
  }
}
/* harmony default export */ __webpack_exports__["a"] = (AlertTips);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rules__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loading__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit__ = __webpack_require__(4);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }




'use strict';
let defaults = {
  rules: {},
  fail: () => {},
  success: () => {},
  scan: false,
  lang: 'cn'
};
class Validate {
  constructor(element, options = {}) {
    this.element = element;
    this.form = element.is('form') ? element : element.closest('form');
    this.options = _extends({}, defaults, options);
    __WEBPACK_IMPORTED_MODULE_2__unit__["d" /* rulesMerge */](options, defaults, (key, val) => this.options.rules[key] = val);
    this.rules = _extends({}, __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */].apply(this), this.options.rules);
    this.init();
  }
  init() {
    this.form.find('[valid]').toArray().forEach(v => __WEBPACK_IMPORTED_MODULE_2__unit__["b" /* attrToJson */](v, this.form));
  }
  validScan(items = this.form, scanResult = $.noop) {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator(function* () {
      if (typeof items === 'function') {
        [items, scanResult] = [..._arguments].reduce(function (a, b) {
          return a.push(b), a;
        }, [_this.form]);
      }
      let isForm = items.is('form');
      if (isForm) {
        items = items.find('[valid]');
      } else {
        items = items.filter('[valid]');
      }
      let resultArr = [];
      let arr = items.filter(':not([ignore],[disabled])').toArray().map(function (v) {
        return __WEBPACK_IMPORTED_MODULE_2__unit__["b" /* attrToJson */](v, _this.form);
      });
      for (let v of arr) yield function (item) {
        return new Promise((() => {
          var _ref = _asyncToGenerator(function* (resolve, reject) {
            let error;
            for (let validType of item.type) {
              yield _this.validItem(validType, item, isForm).catch(function (e) {
                return reject(error = e);
              });
              if (error) break;
            }
            resolve({ element: item.element, valid: true });
          });

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        })());
      }(v).then(function (obj) {
        return resultArr.push(obj);
      }).catch(function (obj) {
        return resultArr.push(obj);
      });

      if (_this.options.scan) {
        let result = yield _this.options.scan.call(_this);
        if ($.isPlainObject(result)) result = [result];
        if (isForm) {
          try {
            resultArr = __WEBPACK_IMPORTED_MODULE_2__unit__["a" /* arrMerge */](resultArr, result);
          } catch (e) {
            throw 'validate scan的返回值必须为{element:"", valid:"", msg:""}或数组';
          }
        } else {
          if (result.some(function (v) {
            for (let vv of arr) {
              if (v.element[0] === vv.element[0]) return true;
            }
          })) {
            resultArr = result;
          }
        }
      }
      scanResult.call(_this, resultArr);
    })();
  }
  validItem(validType, item, isForm) {
    let filterCondition = (_type, val) => {
      if (this.options.rules[_type]) {
        return false;
      } else if (!/required/.test(_type) && !/^[\w\W]+$/.test(val)) {
        return true;
      } else {
        return false;
      }
    };
    return new Promise((resolve, reject) => {
      let { element } = item;
      let { type, msg } = validType;
      let [_type, val] = type.split('=');
      if (!this.rules[_type]) resolve();
      let obj = _extends({}, item, { type, val: element.val(), isFormSubmit: isForm });
      let result = filterCondition(_type, obj.val) ? true : this.rules[_type].call(this, msg ? _extends({}, obj, { msg }) : obj, val);
      if (result instanceof Promise) {
        let _loading = Object(__WEBPACK_IMPORTED_MODULE_1__loading__["a" /* default */])(element);
        result.then(() => {
          resolve();
          _loading.hide();
        }).catch(msg => {
          reject({ msg, valid: false, element });
          _loading.hide();
        });
      } else {
        result === true ? resolve() : reject({ valid: false, msg: result, element });
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["a"] = (Validate);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = rule;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit__ = __webpack_require__(4);


function rule() {
  let that = this;
  let getMsg = tipMsg => (msg, key, obj) => msg || Object.keys(obj).reduce((a, b) => a.replace(new RegExp('\\$' + b, 'g'), obj[b]), tipMsg[key]);
  getMsg = getMsg(Object(__WEBPACK_IMPORTED_MODULE_0__config__["b" /* lang */])());
  return {
    required({ element, title = '', val, msg }) {
      switch (element.attr('type') || element[0].tagName.toLowerCase()) {
        case 'select':
          if (element[0].selectedIndex === 0) return getMsg(msg, 'select_required', { title });
          break;
        case 'checkbox':
        case 'radio':
          if (element.filter(':checked').length === 0) return getMsg(msg, 'select_required', { title });
          break;
        default:
          if (!/^[\w\W]+$/.test(val)) return getMsg(msg, 'required', { title });
      }
      return true;
    },
    float({ title = '', val, msg }) {
      return !/^\d+(\.\d+)?$/.test(val) ? getMsg(msg, 'float', { title }) : true;
    },
    number({ title = '', val, msg }) {
      return !/^\d+$/.test(val) ? getMsg(msg, 'number', { title }) : true;
    },
    nmax({ title = '', val, msg }, max) {
      if (parseInt(val, 10) > parseInt(max, 10)) {
        return getMsg(msg, 'number_max', { title, max });
      }
      return true;
    },
    nmin({ title = '', val, msg }, min) {
      if (parseInt(val, 10) < parseInt(min, 10)) {
        return getMsg(msg, 'number_min', { title, min });
      }
      return true;
    },
    max({ element, title = '', val, msg }, max) {
      if (element.is(':checkbox')) {
        if (element.filter(':checked').length > max) {
          return getMsg(msg, 'checked_max', { title, max });
        }
      } else {
        if (val.length > max) {
          return getMsg(msg, 'length_max', { title, max });
        }
      }
      return true;
    },
    min({ element, title = '', val, msg }, min) {
      if (element.is(':checkbox')) {
        if (element.filter(':checked').length < min) {
          return getMsg(msg, 'checked_min', { title, min });
        }
      } else {
        if (val.length < min) {
          return getMsg(msg, 'length_min', { title, min });
        }
      }
      return true;
    },
    email({ title = '', val, msg }) {
      if (!/^[a-z_0-9-\.]+@([a-z_0-9-]+\.)+[a-z0-9]{2,8}$/i.test(val)) {
        return getMsg(msg, 'email', { title });
      }
      return true;
    },
    mobile({ title = '手机号', val, msg }) {
      if (!/^(((\(\d{2,3}\))|(\d{3}\-))?(1[34578]\d{9}))$|^((001)[2-9]\d{9})$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileHK({ title = '手机号', val, msg }) {
      if (!/^[569]\d{7}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileMO({ title = '手机号', val, msg }) {
      if (!/^6\d{7}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileTW({ title = '手机号', val, msg }) {
      if (!/^9\d{8}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileSG({ title = '手机号', val, msg }) {
      if (!/^[89]\d{7}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileUS({ title = '手机号', val, msg }) {
      if (!/^[2-9]\d{9}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    mobileCA({ title = '手机号', val, msg }) {
      if (!/^[2-9]\d{9}$/.test(val)) {
        return getMsg(msg, 'mobile', { title });
      }
      return true;
    },
    phone({ title = '联系方式', val, msg }) {
      if (!/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(val)) {
        return getMsg(msg, 'phone', { title });
      }
      return true;
    },
    url({ title = '', val, msg }) {
      if (!/^(http:|https:|ftp:)\/\/(?:[0-9a-zA-Z]+|[0-9a-zA-Z][\w-]+)+\.[\w-]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(val)) {
        return getMsg(msg, 'url', { title });
      }
      return true;
    },
    idcard({ title = '身份证', val, msg }) {
      if (!/^\d{17}[xX\d]$|^\d{15}$/.test(val)) {
        return getMsg(msg, 'idcard', { title });
      }
      return true;
    },
    repeat({ title = '', val, msg }, max = 5) {
      if (new RegExp('(\\S)\\1{' + max + '}', 'g').test(val)) {
        return getMsg(msg, 'repeat', { title });
      }
      return true;
    },
    pattern({ title = '', val, msg }, reg) {
      try {
        if (!eval(reg).test(val)) {
          return getMsg(msg, 'pattern', { title });
        }
      } catch (e) {
        throw title + 'pattern的正则不正确';
      }
      return true;
    },
    higher({ element, forElement, title = '', val, msg }) {
      if (forElement.hasClass('valid-error')) return true;
      if (parseInt(val.replace(/\D/g, '')) < parseInt(forElement.val().replace(/\D/g, ''))) {
        return getMsg(msg, 'higher', { title });
      } else {
        return true;
      }
    },
    checked_required(options) {
      let { forElement } = options;
      if (!forElement.is(':checked')) return true;
      return this.rules.required(options);
    },
    repassword({ element, forElement, title = '', val, msg }) {
      let [v1, v2] = [element.val(), forElement.val()];
      if (v1 === '') return;
      if (v1 === v2) {
        return true;
      } else {
        return getMsg(msg, 'repassword', { title });
      }
    },
    some({ element, title, type, val, msg }) {
      let failArr = [];
      type = __WEBPACK_IMPORTED_MODULE_1__unit__["c" /* jsonFormat */](type.replace(/^[a-z]+=(['"])([^'"]+)\1/, '$2'), title);
      for (let v of type) {
        let [_type, _val] = v.type.split('=');
        let result = this.rules[_type].call(this, { element, val }, _val);
        failArr.push(result);
      }
      return failArr.some(v => v === true) || getMsg(msg, 'some', { title });
    },
    not({ element, title, type, val, msg }) {
      let failArr = [];
      type = __WEBPACK_IMPORTED_MODULE_1__unit__["c" /* jsonFormat */](type.replace(/^[a-z]+=(['"])([^'"]+)\1/, '$2'), title);
      for (let v of type) {
        let [_type, _val] = v.type.split('=');
        let result = this.rules[_type].call(this, { element, val }, _val);
        failArr.push(result);
      }
      return failArr.some(v => v === true) ? getMsg(msg, 'not', { title }) : true;
    }
  };
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = loading;
class Loading {
  constructor(element) {
    this.element = element;
    this.show();
  }
  bulid() {
    this.dom = $(`
      <div class="loader">
        <div class="ball-clip-rotate"><div></div></div>
      </div>
    `).appendTo('body');
  }
  resize() {
    let pos = this.element.offset();
    this.dom.css({
      position: 'absolute',
      top: pos.top + this.element.outerHeight() / 2 - this.dom.outerHeight() / 2,
      left: pos.left + this.element.outerWidth() - this.dom.outerWidth() - 3
    });
  }
  show() {
    this.bulid();
    this.resize();
    return this;
  }
  hide() {
    this.dom && this.dom.fadeOut('slow', () => this.dom.remove());
    return this;
  }
}

function loading(element) {
  return new Loading(...arguments);
}

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_style_css__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_style_css__);


(function($, window, undefined) {
  'use strict';
  const pluginName = 'AlertTs';
  const className = 'alert-ts';
  const defaults = {
    position: 'top',           //对齐方向  top,right,bottom,left
    left: 0,                   //弹框左偏移
    top: 3,                    //弹框上偏移
    act: 'hover',              //鼠标事件  hover, click(点击显示，空白消失), false(直接弹框，没有事件)
    hoverdelay : 200,
    proxy : false,             //事件代理 例 $('body').AlertTs({ proxy : '.btn' });
    arrow: {                   //可以简写为 arrow: 'center,8,0' 第一个数字为left，第二个为size, 类css随便调换位置
      align: 'left',           //角的对齐方式
      left: 0,                 //角的偏移
      size: 8,                 //角的大小
    },
    animation: 'fadein',       //动画效果  fadein, zoomin, bounceout
    zindex: 'auto',            //z轴层级，auto时，会自动获取，建议auto
    closex: false,             //true 则显示x按钮
    content: '',               //显示内容
    width: 'auto',             //宽度设置
    height: 'auto',            //高度设置
    cache: false,              //缓存，当弹层关闭时会删除插件创建的dom， true时，会保留。
    css: {                     //样式
      'close-color' : '',
      'close-size' : 14
    },
    cssStyle: 'default',       //皮肤  default,info,warning,error
    timeout: false,             //数字型 多少毫秒后弹框消失
    callback: {
      init: $.noop,
      show: $.noop,
      beforeshow: $.noop,
      hide: $.noop,
      windowborder: $.noop     //当弹框遇到浏览器边界时会处发  $('.btn').AlertTs({ windowborder : (v) => console.log(v) });
    }
  }

  class AlertTs {
    constructor(element, options){
      this.alias(options);
      this.element  = element;
      this.options  = $.extend(true, {}, defaults, options);
      this.helper   = null;
      this.$content = null;
      this.closex   = null;
      this.$arrow   = null;
      this.loading  = null;
      this._id      = ++$[pluginName].id;
      this._left    = 0;
      this._top     = 0;
      this._visible = false;
      this._timeout = false;
      this._timer   = false;
      this._helper  = false;  //_helper代表helper是否已经插入到dom结构中
      this._off     = false;
      this.scrollElement = this.getScrollElement();
      this.initialAttr();
      this.mergeOptions();
      this.toNumber();
      this.createUi();
      this.bindEvent();
      this.options.callback.init.call(this);
    }
    getScrollElement(){
      return this.element.parents().filter(function(){
        let val = $(this).css('overflow');
        return (val==='auto' || val==='scroll') ? true : false;
      });      
    }
    createUi(){
      let helper = $(`<div class="${className}"></div>`).css(this.options.css).data('plugin_' + pluginName, this.element);
      this.$content = $(`<div>${this.options.content}</div>`).appendTo(helper);
      if(this.options.arrow){
        this.$arrow = $(`<div class="${className}-arrow"><i></i><i class="a1"></i></div>`).appendTo(helper);
      }
      if(this.options.closex){
        helper.css('padding-right', Number.parseInt(helper.css('padding-right'), 10) + 8);
        this.closex = $("<span class='closex'>×</span>").appendTo(helper);
        if(this.options.css['close-size']) this.closex.css('font-size', this.options.css['close-size']);
        if(this.options.css['close-color']) this.closex.css('color', this.options.css['close-color']);
        if(this.options.position === 'left'){
          helper.css({
            'padding-left' : Number.parseInt(helper.css('padding-left'),10) + Number.parseInt(this.options.css['close-size']/2)
          })      
          this.closex.css({
            top : -4,
            left : 1
          });
        }else{
          helper.css({
            'padding-right' : Number.parseInt(helper.css('padding-right'),10) + Number.parseInt(this.options.css['close-size']/2)
          })
          this.closex.css({
            top : -4,
            right : 1
          });
        }
        this.closex.on('click', () => {
          if(typeof this.options.closex === 'function') this.options.closex.call(this);
          this.hide()
        });}
      this.options.cssStyle && helper.addClass(className + '-' + this.options.cssStyle);
      this.helper = helper;
    }
    createLoading(){
      this.loading = this.$content.html(`<div class="loading"><div><i/><i/><i/></div></div>`).children('.loading');
      let box = this.loading.find('div');
      box.css({
        'margin-left': -box.innerWidth() / 2,
        'margin-top' : -box.innerHeight() / 2
      });
    }
    show(options=false){
      if(this.options.callback.beforeshow.call(this) === false) return this;
      if(this._visible) return this;
      this._visible = true;
      (this.options.act === 'click' || this.options.act === 'toggle') && $(document).on(this.eventSpace('click'), event => {
        if (this.helper &&
          this.helper.has(event.target).length === 0 &&
          this.helper[0] != event.target &&
          this.element[0] != event.target &&
          this.element.has(event.target).length === 0) {
          this.hide();
        };
      });

      if(this.options.act==='toggle'){
        this.element.on(this.eventSpace('click', 'toggle'), ()=> {
          if(this._visible === true) this.hide();
        })
      }

      this.options.timeout && setTimeout( ()=> this.hide(), this.options.timeout );
      if(this._helper){
        this.helper.show();
      }else{
        this.helper.appendTo('body').css('display','block');
        this._helper = true;
      }
      !this.options.content && this.createLoading();
      this.refresh(options);
      this.options.callback.show.call(this);
      this.options.callback.windowborder && this._windowborder( this.options.callback.windowborder );
      switch(this.options.animation){
        case 'fadein' :
          this.helper.addClass('animated-'+this.options.animation+'-'+this.options.position);
        default :
          this.options.animation && this.helper.addClass('animated-'+this.options.animation)
      }
      $(document).on(this.eventSpace('DOMSubtreeModified'), ()=> this.setState());
      this.scrollElement.on(this.eventSpace('scroll'), ()=> this.rePosition());
      return this;
    }
    eventSpace(name, add=''){ return name + '.' + pluginName + add + this._id }
    hide(){
      if(!this._visible) return this;
      this._visible = false;
      (this.options.act === 'click' || this.options.act === 'toggle') && $(document).off(this.eventSpace('click'));
      this.options.act === 'toggle' && this.element.off(this.eventSpace('click', 'toggle'));
      $(document).off('DOMSubtreeModified.' + pluginName + this._id);
      this.scrollElement.off('scroll.' + pluginName + this._id);
      this.options.callback.hide.call(this);
      this.helper.removeClass('animated-zoomin');
      this.options.cache ? this.helper.hide() : this.removeTag();
      return this;
    }
    removeTag(){
      this.stop();
      this.helper.detach();
      this._helper = false;
    }
    destroy() {
      this._off && this._off();
      this.removeTag();
      this.element.removeData('plugin_' + pluginName);
    }
    reArrow(){
      if(!this.element || !this.helper.is(':visible')) return this;
      let that = this,
          size = this.options.arrow.size,
          position = this.options.position,
          left = this.options.arrow.left,
          a1 = this.$arrow.find('i:eq(0)'),
          a2 = this.$arrow.find('i:eq(1)'),
          aw = parseInt(this.helper.css('border-left-width'),10);
      this.$arrow.add(a1).add(a2).removeAttr('style');
      this._top = 0;
      this._left = 0;
      a1.css({
        'border-width' : that.options.arrow.size,
        ['border-' + position + '-color'] : that.helper.css('background-color')
      });
      a2.css({
        'border-width' : that.options.arrow.size,
        ['border-' + position + '-color'] : that.helper.css('border-left-color')
      });

      let arrowPoint = 0;
      let arrowBoxPoint;
      {
        let obj = {
          left : ()=>{
            arrowPoint = ((position == "top" || position == "bottom") && 10 || 5) + left;
            arrowBoxPoint = -arrowPoint-size+3;
          },
          center : ()=>{
            if (position == "top" || position == "bottom") {
              arrowPoint = that.helper.innerWidth() / 2 - size + left;
              arrowBoxPoint = -arrowPoint-size + that.element.outerWidth() / 2;
            } else {
              arrowPoint = that.helper.innerHeight() / 2 - size + left;
              arrowBoxPoint = -arrowPoint-size + that.element.outerHeight() / 2;
            };
          },
          right : ()=>{
            if (position == "top" || position == "bottom") {
              arrowPoint = that.helper.innerWidth() - size * 2 - 10 + left;
            } else {
              arrowPoint = that.helper.innerHeight() - size - 14 + left;
            };
            arrowBoxPoint = -arrowPoint-size+that.element.outerWidth()-3;
          }
        }
        obj[that.options.arrow.align]();
      };

      let helperPoint = {
        top : ()=>{
          this.$arrow.css({
            bottom: -size,
            left: arrowPoint,
            height: size + aw,
            width: size*2
          });
          a2.css('top', aw);
          this._left = arrowBoxPoint;
        },
        right : ()=>{
          this.$arrow.css({
            left: -size,
            top: arrowPoint,
            height: size*2,
            width : size + aw
          });
          a1.css('right', 0);
          a2.css('right', aw);
          this._top = arrowBoxPoint;
        },
        bottom : ()=>{
          this.$arrow.css({
            top: -size-aw,
            left: arrowPoint,
            height: size + aw,
            width: size*2
          });
          a1.css('bottom', 0);
          a2.css('bottom', aw);
          this._left = arrowBoxPoint;
        },
        left : ()=>{
          this.$arrow.css({
            right: -size,
            top: arrowPoint,
            height: size*2,
            width : size + aw          
          });
          a2.css('left', aw);
          this._top = arrowBoxPoint;
        }
      }
      helperPoint[position]();
      return this;
    }
    rePosition(){
      if(!this.element || !this.helper.is(':visible')) return this;
      let $ele = this.element,
          that = this,
          x = 0,
          y = 0,
          top = this.options.top,
          left = this.options.left,
          offset = this.element.offset(),
          arrow  = this.options.arrow,
          size   = arrow.size;
      x = offset.left;
      y = offset.top;
      let point = {
        top : ()=>{
          x = x + left;
          y = y - that.helper.outerHeight() - arrow.size - top;
        },
        right : ()=>{
          x = x + $ele.outerWidth() + arrow.size + left;
          y = y + top;
        },
        bottom : ()=>{
          x = x + left;
          y = y + $ele.outerHeight() + top + arrow.size;
        },
        left : ()=>{
          x = x - that.helper.outerWidth() - arrow.size - left;
          y = y + top;
        }
      }
      point[this.options.position]();
      this.helper.css({left: x + this._left, top: y + this._top});
      return this;
    }
    setState(callback=$.noop){
      if(!this.element || !this.helper){
        callback();
        return this;
      };
      if (!this._visible || !this.element.is(":visible")) {
        this.helper.hide();
        callback();
        return this;
      };
      this.rePosition();
    }
    play(){
      this._timer = setTimeout( ()=> {
        this.setState(()=> this.stop());
        this.play();
      }, 250);
      return this;
    }
    stop(){
      this._timer && clearTimeout(this._timer);
      return this;
    }
    reContent(str){
      if(!str) return this;
      if(!this._helper){
        this.helper.appendTo('body');
        this._helper = true;
      };
      this.$content.html(str);
      return this;
    }
    refresh(options){
      if(!this.element) return this;
      if(options){
        this.alias(options);
        $.extend(true, this.options, options); 
        this.mergeOptions().toNumber();
        this.reContent(options.content);
      }
      this.helper.css(this.options.css);
      this.options.cssStyle && this.helper.addClass(className + '-' + this.options.cssStyle);
      this.setZindex();
      this.reArrow();
      this.rePosition();
      return this;
    }
    bindEvent(){
      let $ele = this.element;
      let that = this;
      let proxy = this.options.proxy;
      switch(this.options.act){
        case 'toggle':
        case 'click' :
          let eventFunc = function(options){ that.show(options) }
          if(proxy){
            $ele.on('click.' + pluginName, proxy, function(){
              setTimeout(()=>{
                that.options.proxy = $ele;
                that.element = $(this);
                eventFunc.call(this, that.initialAttr());
              });
            });
          }else{
            $ele.on('click.' + pluginName, eventFunc);   
          }
          this._off = function(){
            $ele.off('click.' + pluginName);
            $(document).off('click.' + pluginName + this._id);
          };
          break;
        case 'hover' :
          let _in = {}, 
              _out = {}, 
              _delay = this.options.hoverdelay,
              _outfunc = ()=> that.hide();
          let mouseenterFunc = function(index=0, options){
            clearTimeout(_out[index]);
            _in[index] = setTimeout(()=> {
              that.show(options);
              if(that.helper){
                that.helper.off(`.${pluginName}`)
                           .on(`mouseenter.${pluginName}`, ()=> clearTimeout(_out[index]))
                           .on(`mouseleave.${pluginName}`, ()=> {_out[index] = setTimeout(_outfunc, _delay)});
              }            
            }, _delay);
          };
          let mouseleaveFunc = function(index){
            clearTimeout(_in[index]);
            _out[index] = setTimeout(_outfunc, _delay);   
          };
          if(this.options.proxy){
            $ele.on('mouseenter.' + pluginName, this.options.proxy, function(){
              that.options.proxy = $ele;
              that.element = $(this);
              mouseenterFunc.call(this, $(this).index(proxy), that.initialAttr());
            }).on('mouseleave.' + pluginName, this.options.proxy, function(){
              that.options.proxy = $ele;
              that.element = $(this);
              mouseleaveFunc.call(this, $(this).index(proxy));
            });
          }else{
            $ele.on('mouseenter.' + pluginName, mouseenterFunc)
                .on('mouseleave.' + pluginName, mouseleaveFunc);
          }
          this._off = function(){
            $ele.off('mouseenter.' + pluginName)
                .off('mouseleave.' + pluginName);
          };
          break;
        case 'hide' :
          break;
        default :
          this.show();
          this.play();
      }
    }
    initialAttr(){
      let that = this;
      let obj = {};
      //:代表别名
      ['position', 'title:content', 'zindex', 'top', 'left'].forEach(v => {  
        let arr = v.split(":");
        if (arr.length > 1) {
          if(this.element.attr("data-" + arr[0]) ) {
            this.options[arr[1]] = obj[arr[1]] = this.element.attr("data-" + arr[0]);
          }
        } else {
          if(this.element.attr("data-" + v) ) {
            this.options[v] = obj[arr[v]] = this.element.attr("data-" + v);
          }
        }
      });
      return obj;
    }
    toNumber(){
      var reg = new RegExp('^[-0-9]+(px|em|rem)?$');
      ['left', 'top', 'zindex', 'width', 'height', 'timeout', 'css>close-size', 'arrow>size', 'arrow>left'].forEach(v => {
        let arr = v.split('>');
        if(arr.length > 1){
          var key = this.options[arr[0]][arr[1]];
          if(!key)
            this.options[arr[0]][arr[1]] = 0;
          else if(reg.test(key))
            this.options[arr[0]][arr[1]] = parseInt(key, 10);
        }else{
          if(!this.options[v])
            this.options[v] = 0;
          else if(reg.test(this.options[v]))
            this.options[v] = parseInt(this.options[v], 10);
        }
      });
      return this;
    }
    mergeOptions(){
      Object.keys(this.options).forEach(v => {
        if(['size', 'align'].indexOf(v) > -1){
          this.options.arrow[v] = this.options[v];
        }else if(['init', 'show', 'windowborder', 'beforeshow', 'hide'].indexOf(v) > -1){
          this.options.callback[v] = this.options[v];
        }else if(/^padding/i.test(v) || /^border/i.test(v) || /^background/i.test(v) || v==='font-size' || v==='font-size' || v==='line-height' || v==='height' || v==='width' ){
          this.options.css[v] = this.options[v];
        }
      });
      return this;
    }
    setZindex(){
      let getAutoIndex = ()=>{
        let maxindex = 0;
        this.element.parents().each(function () {
          let getindex = parseInt($(this).css('z-index'), 10);
          if (maxindex < getindex) maxindex = getindex;
        });
        return maxindex + (++$[pluginName].zindex);
      };
      let zindex = this.options.zindex;
      if (zindex.toString().indexOf('auto') > -1) {
        this.helper.css('z-index', getAutoIndex());
      }else if(typeof zindex === 'string' && /^(\-|\+)/.test(zindex)){
        this.helper.css('z-index', getAutoIndex() + parseInt(zindex, 10));
      }else{
        this.helper.css('z-index', zindex);
      }
      return this;
    }
    alias(options){
      //arrow 简写
      if( typeof options.arrow === 'string' ){
        let arrowArr = options.arrow.split(',') ;
        let arrKey = [];
        for(let i in defaults.arrow) defaults.arrow.hasOwnProperty(i) && arrKey.push(i);
        options.arrow = $.extend({},defaults.arrow);
        arrowArr.forEach((v, i) => {
          v = v.trim();
          if(v) options.arrow[ arrKey[i] ] = v;
        });
      }
    }
    _windowborder(func) {
      let pad = 3,
          A, B,
          offsetLeft   = this.helper.offset().left,
          offsetTop    = this.helper.offset().top,
          scrollTop    = $(document).scrollTop(),
          scrollLeft   = $(document).scrollLeft(),
          windowWidth  = $(window).width(),
          windowHeight = $(window).height(),
          data = {
            top: false,
            right: false,
            bottom: false,
            left: false,
            width: this.helper.outerWidth(),
            height: this.helper.outerHeight()
          };

      A = offsetTop - pad;
      B = scrollTop;
      A < B && (data.top = B - A);

      A = offsetLeft + data.width + pad;
      B = scrollLeft + windowWidth;
      A > B && (data.right = A - B);

      A = offsetTop + data.height + pad;
      B = scrollTop + windowHeight;
      A > B && (data.bottom = A - B);

      A = offsetLeft - pad;
      B = scrollLeft;
      A < B && (data.left = B - A);
      func && func.call(this, data);
    };
  }

  $.fn[pluginName] = $.fn.alertTs = function (options) {
    options = options || {};
    if (typeof options == 'string') {
      let args = arguments,
          method = options;
      Array.prototype.shift.call(args);
      switch (method) {
        case "getClass":
          return $(this).data('plugin_' + pluginName);
        default:
          return this.each(function () {
            let plugin = $(this).data('plugin_' + pluginName);
            if (plugin && plugin[method]) plugin[method].apply(plugin, args);
          });
      };
    } else {
      return this.each(function () {
        if(options.proxy){
          let ele = $(this).find(options.proxy);
          let plugin = ele.data('plugin_' + pluginName);
          if(plugin){
            if(!['click', 'hover', 'hide'].some(v => v===options.act)){
              plugin.show(options);
            }else{
              plugin.refresh(options);
            }
          }else{
            ele.data('plugin_' + pluginName, new AlertTs($(this), options));
          }
        }else{
          let plugin = $(this).data('plugin_' + pluginName);
          if(plugin){
            if(!['click', 'hover', 'hide'].some(v => v===options.act)){
              plugin.show(options);
            }else{
              plugin.refresh(options);
            }
          }else{
            $(this).data('plugin_' + pluginName, new AlertTs($(this), options));
          }
        }
      });
    };
  };

  $[pluginName] = {
    id : 0,
    zindex : 100,
    parent: (element) => $(element).closest('.'+className).data("plugin_" + pluginName).data("plugin_" + pluginName)    
  }
}(jQuery, window));

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".alert-ts { position: absolute; display: none;\n  left:0;\n  top:0;\n  font-size: 12px;\n  line-height: 22px;\n  border-radius: 2px;\n  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);  \n}\n.alert-ts .closex { font-family: Verdana; padding-bottom: 1px; transition: all .3s ease-out; position: absolute; z-index: 3; cursor: pointer; }\n.alert-ts .closex:hover { -webkit-transform: rotate(180deg);}\n.alert-ts .alert-ts-arrow { position: absolute; overflow: hidden; }\n.alert-ts .alert-ts-arrow i { display: block; width: 0px; height: 0px; overflow: hidden; position: absolute; z-index: 2; border-style: solid; border-width: 1px; border-color: transparent transparent transparent transparent; }\n.alert-ts .alert-ts-arrow .a1 { z-index: 1; }\n.alert-ts .loading{min-width:80px; min-height:30px;}\n.alert-ts .loading div { position: absolute; top:50%; left:50%; font-size: 0; line-height: 0; text-align: center;}\n.alert-ts .loading div i {\n  background-color: #fff;\n  width: 10px;\n  height: 10px;\n  border-radius: 100%;\n  margin: 2px;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n  display: inline-block;\n  animation: ball-beat 0.7s 0s infinite linear;\n}\n.alert-ts .loading div i:nth-child(2n-1) { -webkit-animation-delay: 0.35s; animation-delay: 0.35s; }\n\n\n/* \n  皮肤 \n*/\n/* default */\n.alert-ts-default {\n  padding: 8px 10px;\n  border: 1px solid #e2e2e2;\n  background-color: #fff;\n  color: #666;\n}\n.alert-ts-default .loading i { background-color: #d2d2d2 !important; }\n.alert-ts-default .closex { color: #d2d2d2; }\n\n/* info */\n.alert-ts-info {\n  padding: 8px 10px;\n  border: 1px solid #ceeaff;\n  background-color: #e8f8ff;\n  color: #6699cc;\n}\n.alert-ts-info .loading i { background-color: #b7e7fe !important; }\n.alert-ts-info .closex { color: #a8d7f5; }\n\n/* warning */\n.alert-ts-warning {\n  padding: 8px 10px;\n  border: 1px solid #ffe99d;\n  background-color: #fff8d2;\n  color: #cc8c28;\n}\n.alert-ts-warning .loading i { background-color: #f9d574 !important; }\n.alert-ts-warning .closex { color: #ebd97b; }\n\n/* error */\n.alert-ts-error {\n  padding: 8px 10px;\n  border: 1px solid #ffd0d0;\n  background-color: #fff0ee;\n  color: #cc0000;\n}\n.alert-ts-error .loading i { background-color: #ffbaba !important; }\n.alert-ts-error .closex { color:#edb6b6;}\n\n\n\n\n\n\n\n\n\n\n\n.animated-zoomin { animation: zoomin .2s cubic-bezier(0.39, 0.58, 0.57, 1) }\n.animated-fadein-top{ animation: fadein-top .3s cubic-bezier(0.39, 0.58, 0.57, 1) }\n.animated-fadein-right{ animation: fadein-right .3s cubic-bezier(0.39, 0.58, 0.57, 1) }\n.animated-fadein-bottom{ animation: fadein-bottom .3s cubic-bezier(0.39, 0.58, 0.57, 1) }\n.animated-fadein-left{ animation: fadein-left .3s cubic-bezier(0.39, 0.58, 0.57, 1) }\n.animated-bounceout { animation: bounce-in .75s cubic-bezier(0.39, 0.58, 0.57, 1) }\n/* 动画 */\n@-webkit-keyframes zoomin {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(.1, .1, .1);\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes zoomin {\n  from {\n    opacity: 0;\n    transform: scale3d(.1, .1, .1);\n  }\n  to {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes ball-beat {\n  50% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.75);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n  } \n}\n@keyframes ball-beat {\n  50% {\n    opacity: 0.2;\n    transform: scale(0.75);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  } \n}\n@-webkit-keyframes bounce-in {\n  from, 20%, 40%, 60%, 80%, to {\n    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n  }\n  0% {\n    opacity: 0;\n    -webkit-transform: scale3d(.3, .3, .3);\n    transform: scale3d(.3, .3, .3);\n  }\n\n  20% {\n    -webkit-transform: scale3d(1.1, 1.1, 1.1);\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    -webkit-transform: scale3d(.9, .9, .9);\n    transform: scale3d(.9, .9, .9);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: scale3d(1.03, 1.03, 1.03);\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n  80% {\n    -webkit-transform: scale3d(.97, .97, .97);\n    transform: scale3d(.97, .97, .97);\n  }\n  to {\n    opacity: 1;\n    -webkit-transform: scale3d(1, 1, 1);\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@keyframes bounce-in {\n  from, 20%, 40%, 60%, 80%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n  }\n  0% {\n    opacity: 0;\n    transform: scale3d(.3, .3, .3);\n  }\n\n  20% {\n    transform: scale3d(1.1, 1.1, 1.1);\n  }\n\n  40% {\n    transform: scale3d(.9, .9, .9);\n  }\n\n  60% {\n    opacity: 1;\n    transform: scale3d(1.03, 1.03, 1.03);\n  }\n  80% {\n    transform: scale3d(.97, .97, .97);\n  }\n  to {\n    opacity: 1;\n    transform: scale3d(1, 1, 1);\n  }\n}\n\n@-webkit-keyframes fadein-bottom {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -10px, 0);\n  }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n  }\n}\n@keyframes fadein-bottom {\n  from {\n    opacity: 0;\n    transform: translate3d(0, -10px, 0);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@-webkit-keyframes fadein-right {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(-10px, 0, 0);\n  }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n  }\n}\n@keyframes fadein-right {\n  from {\n    opacity: 0;\n    transform: translate3d(-10px, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@-webkit-keyframes fadein-left {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(10px, 0, 0);\n  }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n  }\n}\n@keyframes fadein-left {\n  from {\n    opacity: 0;\n    transform: translate3d(10px, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@-webkit-keyframes fadein-top {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, 10px, 0);\n  }\n  to {\n    opacity: 1;\n    -webkit-transform: none;\n  }\n}\n@keyframes fadein-top {\n  from {\n    opacity: 0;\n    transform: translate3d(0, 10px, 0);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_h5dialog_css__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_h5dialog_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_h5dialog_css__);



const className = 'valid-h5dialog';

class H5Dialog extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor(element, options = {}) {
    super(...arguments);
    this.bulidElement;
    this.bindEvent();
    this.submit();
  }
  show({ element, msg }) {
    if (this.bulidElement) return;
    this.highlight(element, 'show');
    this.bulidElement = $(`<div class="${className}">${msg}</div>`).appendTo('body');
    setTimeout(this.hide.bind(this), 2000);
  }
  hide() {
    this.bulidElement.addClass('valid-h5dialog-hide').on('animationend', function () {
      $(this).remove();
    });
    this.bulidElement = null;
  }
  bindEvent() {
    let that = this;
    this.form.on('input.' + this.namespace, 'input:not(:submit, :button), textarea, select', function () {
      that.highlight($(this), 'hide');
    });
  }
  scan(validItems = this.form, callback = $.noop) {
    if (typeof validItems === 'function') {
      [validItems, callback] = [...arguments].reduce((a, b) => (a.push(b), a), [this.form]);
    }
    this.validScan(validItems, items => {
      items = items.filter(v => v.valid === false);
      if (items.length > 0) {
        this.show(items[0]);
        this.options.fail(items.map(v => ({ element: this.getElement(v.element), msg: v.msg })));
        callback(false);
      } else {
        callback(true);
      }
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = H5Dialog;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./h5dialog.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./h5dialog.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".valid-h5dialog {\n  position: fixed;\n  padding: 10px 18px;\n  background-color: rgba(0, 0, 0, .75);\n  color: #fff;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  border-radius: 4px;\n  animation: valid-h5dialog-show .5s ease-out;\n  font-size: 14px;\n}\n\n.valid-h5dialog-hide {\n  animation: valid-h5dialog-hide .3s ease-in;\n}\n\n@keyframes valid-h5dialog-show{\n  0% { opacity: 0 }\n  100% { opacity: 1 }\n}\n@keyframes valid-h5dialog-hide{\n  0% { opacity: 1 }\n  100% { opacity: 0 }\n}", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(2);

class None extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor(element, options = {}) {
    super(...arguments);
    this.submit();
  }
  scan(validItems = this.form, callback = $.noop) {
    if (typeof validItems === 'function') {
      [validItems, callback] = [...arguments].reduce((a, b) => (a.push(b), a), [this.form]);
    }
    this.validScan(validItems, items => {
      items = items.filter(v => v.valid === false);
      if (items.length > 0) {
        this.options.fail(items.map(v => ({ element: this.getElement(v.element), msg: v.msg })));
        callback(false);
      } else {
        callback(true);
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["a"] = (None);

/***/ })
/******/ ]);