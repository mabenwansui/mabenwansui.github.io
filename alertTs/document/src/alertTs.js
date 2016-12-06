/******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};

/******/  // The require function
/******/  function __webpack_require__(moduleId) {

/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;

/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      exports: {},
/******/      id: moduleId,
/******/      loaded: false
/******/    };

/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/    // Flag the module as loaded
/******/    module.loaded = true;

/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }


/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;

/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;

/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "//concat.lietou-static.com/dev/msk/pc/v3/build/";

/******/  // Load entry module and return exports
/******/  return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  __webpack_require__(56);

/***/ },

/***/ 56:
/***/ function(module, exports) {

  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  //import './css/style.css';

  (function ($, window, undefined) {
    'use strict';

    var pluginName = 'AlertTs';
    var className = 'alert-ts';
    var defaults = {
      position: 'top', //对齐方向  top,right,bottom,left
      left: 0, //弹框左偏移
      top: 3, //弹框上偏移
      act: 'hover', //鼠标事件  hover, click(点击显示，空白消失), false(直接弹框，没有事件)
      proxy: false, //事件代理 例 $('body').AlertTs({ proxy : '.btn' });
      arrow: { //可以简写为 arrow: 'center,8,0' 第一个数字为left，第二个为size, 类css随便调换位置
        align: 'left', //角的对齐方式
        left: 0, //角的偏移
        size: 8 },
      animation: 'fadein', //动画效果  fadein, zoomin, bounceout
      zindex: 'auto', //z轴层级，auto时，会自动获取，建议auto
      closex: false, //true 则显示x按钮
      content: '', //显示内容
      width: 'auto', //宽度设置
      height: 'auto', //高度设置
      cache: false, //缓存，当弹层关闭时会删除插件创建的dom， true时，会保留。
      css: { //样式
        'close-color': '',
        'close-size': 14
      },
      cssStyle: 'default', //皮肤  default,info,warning,error
      timeout: false, //数字型 多少毫秒后弹框消失
      callback: {
        init: $.noop,
        show: $.noop,
        beforeshow: $.noop,
        hide: $.noop,
        windowborder: $.noop //当弹框遇到浏览器边界时会处发  $('.btn').AlertTs({ windowborder : (v) => console.log(v) });
      }
    };

    var AlertTs = function () {
      function AlertTs(element, options) {
        _classCallCheck(this, AlertTs);

        this.alias(options);
        this.element = element;
        this.options = $.extend(true, {}, defaults, options);
        this.helper = null;
        this.$content = null;
        this.closex = null;
        this.$arrow = null;
        this.loading = null;
        this._id = ++$[pluginName].id;
        this._left = 0;
        this._top = 0;
        this._visible = false;
        this._timeout = false;
        this._timer = false;
        this._helper = false; //_helper代表helper是否已经插入到dom结构中
        this._off = false;
        this.initialAttr();
        this.mergeOptions();
        this.toNumber();
        this.createUi();
        this.bindEvent();
        this.options.callback.init.call(this);
      }

      _createClass(AlertTs, [{
        key: 'createUi',
        value: function createUi() {
          var _this = this;

          var helper = $('<div class="' + className + '"></div>').css(this.options.css);
          this.$content = $('<div>' + this.options.content + '</div>').appendTo(helper);
          if (this.options.arrow) {
            this.$arrow = $('<div class="arrow"><i></i><i class="a1"></i></div>').appendTo(helper);
          }
          if (this.options.closex) {
            helper.css('padding-right', Number.parseInt(helper.css('padding-right'), 10) + 8);
            this.closex = $("<span class='closex'>×</span>").appendTo(helper);
            if (this.options.css['close-size']) this.closex.css('font-size', this.options.css['close-size']);
            if (this.options.css['close-color']) this.closex.css('color', this.options.css['close-color']);
            if (this.options.position === 'left') {
              helper.css({
                'padding-left': Number.parseInt(helper.css('padding-left'), 10) + Number.parseInt(this.options.css['close-size'] / 2)
              });
              this.closex.css({
                top: -4,
                left: 1
              });
            } else {
              helper.css({
                'padding-right': Number.parseInt(helper.css('padding-right'), 10) + Number.parseInt(this.options.css['close-size'] / 2)
              });
              this.closex.css({
                top: -4,
                right: 1
              });
            }
            this.closex.on('click', function () {
              if (typeof _this.options.closex === 'function') _this.options.closex.call(_this);
              _this.hide();
            });
          }
          this.options.cssStyle && helper.addClass(className + '-' + this.options.cssStyle);
          this.helper = helper;
        }
      }, {
        key: 'createLoading',
        value: function createLoading() {
          this.loading = this.$content.html('<div class="loading"><div><i/><i/><i/></div></div>').children('.loading');
          var box = this.loading.find('div');
          box.css({
            'margin-left': -box.innerWidth() / 2,
            'margin-top': -box.innerHeight() / 2
          });
        }
      }, {
        key: 'show',
        value: function show() {
          var _this2 = this;

          var options = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
          if(this.options.callback.beforeshow.call(this) === false) return this;
          if (this._visible) return this;
          this._visible = true;
          this.options.act === 'click' && $(document).on('click.' + pluginName + this._id, function (event) {
            if (_this2.helper && _this2.helper.has(event.target).length === 0 && _this2.helper[0] != event.target && _this2.element[0] != event.target && _this2.element.has(event.target).length === 0) {
              _this2.hide();
            };
          });

          this.options.timeout && setTimeout(function () {
            return _this2.hide();
          }, this.options.timeout);
          this.options.callback.beforeshow.call(this);
          if (this._helper) {
            this.helper.show();
          } else {
            this.helper.appendTo('body').css('display', 'block');
            this._helper = true;
          }
          !this.options.content && this.createLoading();
          this.refresh(options);
          this.options.callback.show.call(this);
          this.options.callback.windowborder && this._windowborder(this.options.callback.windowborder);
          switch (this.options.animation) {
            case 'fadein':
              this.helper.addClass('animated-' + this.options.animation + '-' + this.options.position);
            default:
              this.options.animation && this.helper.addClass('animated-' + this.options.animation);
          }
          return this;
        }
      }, {
        key: 'hide',
        value: function hide() {
          if (!this._visible) return this;
          this._visible = false;
          this.options.act === 'click' && $(document).off('click.' + pluginName + this._id);
          this.options.callback.hide.call(this);
          this.helper.removeClass('animated-zoomin');
          this.options.cache ? this.helper.hide() : this.removeTag();
          return this;
        }
      }, {
        key: 'removeTag',
        value: function removeTag() {
          this.stop();
          this.helper.detach();
          this._helper = false;
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this._off && this._off();
          this.removeTag();
          this.element.removeData('plugin_' + pluginName);
        }
      }, {
        key: 'reArrow',
        value: function reArrow() {
          var _this3 = this;

          if (!this.element || !this.helper.is(':visible')) return this;
          var that = this,
              size = this.options.arrow.size,
              position = this.options.position,
              _left = this.options.arrow.left,
              a1 = this.$arrow.find('i:eq(0)'),
              a2 = this.$arrow.find('i:eq(1)'),
              aw = parseInt(this.helper.css('border-left-width'), 10);
          this.$arrow.add(a1).add(a2).removeAttr('style');
          this._top = 0;
          this._left = 0;
          a1.css(_defineProperty({
            'border-width': that.options.arrow.size
          }, 'border-' + position + '-color', that.helper.css('background-color')));
          a2.css(_defineProperty({
            'border-width': that.options.arrow.size
          }, 'border-' + position + '-color', that.helper.css('border-left-color')));

          var arrowPoint = 0;
          var arrowBoxPoint = void 0;
          {
            var obj = {
              left: function left() {
                arrowPoint = ((position == "top" || position == "bottom") && 10 || 5) + _left;
                arrowBoxPoint = -arrowPoint - size + 3;
              },
              center: function center() {
                if (position == "top" || position == "bottom") {
                  arrowPoint = that.helper.innerWidth() / 2 - size + _left;
                } else {
                  arrowPoint = that.helper.innerHeight() / 2 - size + _left;
                };
                arrowBoxPoint = -arrowPoint - size + that.element.outerWidth() / 2;
              },
              right: function right() {
                if (position == "top" || position == "bottom") {
                  arrowPoint = that.helper.innerWidth() - size * 2 - 10 + _left;
                } else {
                  arrowPoint = that.helper.innerHeight() - size - 14 + _left;
                };
                arrowBoxPoint = -arrowPoint - size + that.element.outerWidth() - 3;
              }
            };
            obj[that.options.arrow.align]();
          };

          var helperPoint = {
            top: function top() {
              _this3.$arrow.css({
                bottom: -size,
                left: arrowPoint,
                height: size + aw,
                width: size * 2
              });
              a2.css('top', aw);
              _this3._left = arrowBoxPoint;
            },
            right: function right() {
              _this3.$arrow.css({
                left: -size,
                top: arrowPoint,
                height: size * 2,
                width: size + aw
              });
              a1.css('right', 0);
              a2.css('right', aw);
              _this3._top = arrowBoxPoint;
            },
            bottom: function bottom() {
              _this3.$arrow.css({
                top: -size - aw,
                left: arrowPoint,
                height: size + aw,
                width: size * 2
              });
              a1.css('bottom', 0);
              a2.css('bottom', aw);
              _this3._left = arrowBoxPoint;
            },
            left: function left() {
              _this3.$arrow.css({
                right: -size,
                top: arrowPoint,
                height: size * 2,
                width: size + aw
              });
              a2.css('left', aw);
              _this3._top = arrowBoxPoint;
            }
          };
          helperPoint[position]();
          return this;
        }
      }, {
        key: 'rePosition',
        value: function rePosition() {
          if (!this.element || !this.helper.is(':visible')) return this;
          var $ele = this.element,
              that = this,
              x = 0,
              y = 0,
              _top = this.options.top,
              _left2 = this.options.left,
              offset = this.element.offset(),
              arrow = this.options.arrow,
              size = arrow.size;
          x = offset.left;
          y = offset.top;
          var point = {
            top: function top() {
              x = x + _left2;
              y = y - that.helper.outerHeight() - arrow.size - _top;
            },
            right: function right() {
              x = x + $ele.outerWidth() + arrow.size + _left2;
              y = y + _top;
            },
            bottom: function bottom() {
              x = x + _left2;
              y = y + $ele.outerHeight() + _top + arrow.size;
            },
            left: function left() {
              x = x - that.helper.outerWidth() - arrow.size - _left2;
              y = y + _top;
            }
          };
          point[this.options.position]();
          this.helper.css({ left: x + this._left, top: y + this._top });
          return this;
        }
      }, {
        key: 'play',
        value: function play() {
          var _this4 = this;

          this._timer = setTimeout(function () {
            if (!_this4.element || !_this4.helper) {
              _this4.stop();
              return _this4;
            };
            if (!_this4._visible || !_this4.element.is(":visible")) {
              _this4.helper.hide();
              _this4.stop();
              return _this4;
            };
            _this4.rePosition();
            _this4.play();
          }, 250);
          return this;
        }
      }, {
        key: 'stop',
        value: function stop() {
          this._timer && clearTimeout(this._timer);
          return this;
        }
      }, {
        key: 'reContent',
        value: function reContent(str) {
          if (!str) return this;
          if (!this._helper) {
            this.helper.appendTo('body');
            this._helper = true;
          };
          this.$content.html(str);
          return this;
        }
      }, {
        key: 'refresh',
        value: function refresh(options) {
          if (!this.element) return this;
          if (options) {
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
      }, {
        key: 'bindEvent',
        value: function bindEvent() {
          var _this5 = this;

          var $ele = this.element;
          var that = this;
          var proxy = this.options.proxy;

          (function () {
            switch (_this5.options.act) {
              case 'click':
                var eventFunc = function eventFunc(options) {
                  that.show(options);
                };
                if (proxy) {
                  $ele.on('click.' + pluginName, proxy, function () {
                    var _this6 = this;

                    setTimeout(function () {
                      that.options.proxy = $ele;
                      that.element = $(_this6);
                      eventFunc.call(_this6, that.initialAttr());
                    });
                  });
                } else {
                  $ele.on('click.' + pluginName, eventFunc);
                }
                _this5._off = function () {
                  $ele.off('click.' + pluginName);
                  $(document).off('click.' + pluginName + this._id);
                };
                break;
              case 'hover':
                var _in = {},
                    _out = {},
                    _delay = 200,
                    _outfunc = function _outfunc() {
                  return that.hide();
                };
                var mouseenterFunc = function mouseenterFunc() {
                  var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
                  var options = arguments[1];

                  clearTimeout(_out[index]);
                  _in[index] = setTimeout(function () {
                    that.show(options);
                    if (that.helper) {
                      that.helper.off('.' + pluginName).on('mouseenter.' + pluginName, function () {
                        return clearTimeout(_out[index]);
                      }).on('mouseleave.' + pluginName, function () {
                        _out[index] = setTimeout(_outfunc, _delay);
                      });
                    }
                  }, _delay);
                };
                var mouseleaveFunc = function mouseleaveFunc(index) {
                  clearTimeout(_in[index]);
                  _out[index] = setTimeout(_outfunc, _delay);
                };
                if (_this5.options.proxy) {
                  $ele.on('mouseenter.' + pluginName, _this5.options.proxy, function () {
                    that.options.proxy = $ele;
                    that.element = $(this);
                    mouseenterFunc.call(this, $(this).index(proxy), that.initialAttr());
                  }).on('mouseleave.' + pluginName, _this5.options.proxy, function () {
                    that.options.proxy = $ele;
                    that.element = $(this);
                    mouseleaveFunc.call(this, $(this).index(proxy));
                  });
                } else {
                  $ele.on('mouseenter.' + pluginName, mouseenterFunc).on('mouseleave.' + pluginName, mouseleaveFunc);
                }
                _this5._off = function () {
                  $ele.off('mouseenter.' + pluginName).off('mouseleave.' + pluginName);
                };
                break;
              case 'hide':
                break;
              default:
                _this5.show();
                _this5.play();
            }
          })();
        }
      }, {
        key: 'initialAttr',
        value: function initialAttr() {
          var _this7 = this;

          var that = this;
          var obj = {};
          //:代表别名
          ['position', 'title:content', 'zindex', 'top', 'left'].forEach(function (v) {
            var arr = v.split(":");
            if (arr.length > 1) {
              if (_this7.element.attr("data-" + arr[0])) {
                _this7.options[arr[1]] = obj[arr[1]] = _this7.element.attr("data-" + arr[0]);
              }
            } else {
              if (_this7.element.attr("data-" + v)) {
                _this7.options[v] = obj[arr[v]] = _this7.element.attr("data-" + v);
              }
            }
          });
          return obj;
        }
      }, {
        key: 'toNumber',
        value: function toNumber() {
          var _this8 = this;

          var reg = new RegExp('^[-0-9]+(px|em|rem)?$');
          ['left', 'top', 'zindex', 'width', 'height', 'timeout', 'css>close-size', 'arrow>size', 'arrow>left'].forEach(function (v) {
            var arr = v.split('>');
            if (arr.length > 1) {
              var key = _this8.options[arr[0]][arr[1]];
              if (!key) _this8.options[arr[0]][arr[1]] = 0;else if (reg.test(key)) _this8.options[arr[0]][arr[1]] = parseInt(key, 10);
            } else {
              if (!_this8.options[v]) _this8.options[v] = 0;else if (reg.test(_this8.options[v])) _this8.options[v] = parseInt(_this8.options[v], 10);
            }
          });
          return this;
        }
      }, {
        key: 'mergeOptions',
        value: function mergeOptions() {
          var _this9 = this;

          Object.keys(this.options).forEach(function (v) {
            if (['size', 'align'].indexOf(v) > -1) {
              _this9.options.arrow[v] = _this9.options[v];
            } else if (['init', 'show', 'windowborder', 'beforeshow', 'hide'].indexOf(v) > -1) {
              _this9.options.callback[v] = _this9.options[v];
            } else if (/^padding/i.test(v) || /^border/i.test(v) || /^background/i.test(v) || v === 'font-size' || v === 'font-size' || v === 'line-height' || v === 'height' || v === 'width') {
              _this9.options.css[v] = _this9.options[v];
            }
          });
          return this;
        }
      }, {
        key: 'setZindex',
        value: function setZindex() {
          var _this10 = this;

          var getAutoIndex = function getAutoIndex() {
            var maxindex = 0;
            _this10.element.parents().each(function () {
              var getindex = parseInt($(this).css('z-index'), 10);
              if (maxindex < getindex) maxindex = getindex;
            });
            return maxindex + ++$[pluginName].zindex;
          };
          var zindex = this.options.zindex;
          if (zindex.indexOf('auto') > -1) {
            this.helper.css('z-index', getAutoIndex());
          } else if (typeof zindex === 'string' && /^(\-|\+)/.test(zindex)) {
            this.helper.css('z-index', getAutoIndex() + parseInt(zindex, 10));
          } else {
            this.helper.css('z-index', zindex);
          }
          return this;
        }
      }, {
        key: 'alias',
        value: function alias(options) {
          //arrow 简写
          if (typeof options.arrow === 'string') {
            (function () {
              var arrowArr = options.arrow.split(',');
              var arrKey = [];
              for (var i in defaults.arrow) {
                defaults.arrow.hasOwnProperty(i) && arrKey.push(i);
              }options.arrow = $.extend({}, defaults.arrow);
              arrowArr.forEach(function (v, i) {
                v = v.trim();
                if (v) options.arrow[arrKey[i]] = v;
              });
            })();
          }
        }
      }, {
        key: '_windowborder',
        value: function _windowborder(func) {
          var pad = 3,
              A = void 0,
              B = void 0,
              offsetLeft = this.helper.offset().left,
              offsetTop = this.helper.offset().top,
              scrollTop = $(document).scrollTop(),
              scrollLeft = $(document).scrollLeft(),
              windowWidth = $(window).width(),
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
        }
      }]);

      return AlertTs;
    }();

    $.fn[pluginName] = $.fn.alertTs = function (options) {
      var _arguments = arguments,
          _this11 = this;

      options = options || {};
      if (typeof options == 'string') {
        var _ret3 = function () {
          var args = _arguments,
              method = options;
          Array.prototype.shift.call(args);
          switch (method) {
            case "getClass":
              return {
                v: $(_this11).data('plugin_' + pluginName)
              };
            default:
              return {
                v: _this11.each(function () {
                  var plugin = $(this).data('plugin_' + pluginName);
                  if (plugin && plugin[method]) plugin[method].apply(plugin, args);
                })
              };
          };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      } else {
        return this.each(function () {
          if (options.proxy) {
            var ele = $(this).find(options.proxy);
            var plugin = ele.data('plugin_' + pluginName);
            if (plugin) {
              if (!['click', 'hover', 'hide'].some(function (v) {
                return v === options.act;
              })) {
                plugin.show(options);
              } else {
                plugin.refresh(options);
              }
            } else {
              ele.data('plugin_' + pluginName, new AlertTs($(this), options));
            }
          } else {
            var _plugin = $(this).data('plugin_' + pluginName);
            if (_plugin) {
              if (!['click', 'hover', 'hide'].some(function (v) {
                return v === options.act;
              })) {
                _plugin.show(options);
              } else {
                _plugin.refresh(options);
              }
            } else {
              $(this).data('plugin_' + pluginName, new AlertTs($(this), options));
            }
          }
        });
      };
    };

    $[pluginName] = {
      id: 0,
      zindex: 100,
      parent: function parent(element) {
        return element.closest("." + classname + "-k").data("plugin_" + pluginName).data("plugin_" + pluginName);
      }
    };
  })(jQuery, window);

/***/ }

/******/ });