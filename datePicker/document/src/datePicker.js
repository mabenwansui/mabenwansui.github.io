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

  __webpack_require__(52);

/***/ },

/***/ 52:
/***/ function(module, exports) {

  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

  var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  //import './css/style.css';

  (function ($, window, undefined) {
    'use strict';

    var pluginName = 'DatePicker';
    var className = 'date-picker';
    var defaults = {
      left: 0,
      top: 0,
      readonly: true,
      errortext: 'auto',
      btnbar: false,
      startdate: null,
      enddate: null,
      minyear: 1975,
      maxyear: 2025,
      zindex: 'auto',
      cssStyle: null,
      callback: $.noop
    };

    var DatePicker = function () {
      function DatePicker(element, options) {
        _classCallCheck(this, DatePicker);

        this.element = element;
        this.options = $.extend(true, {}, defaults, options);
        this.helper = null;
        this.year = null;
        this.month = null;
        this.day = null;
        this.icon = null;
        this._visible = false;
        this._id = ++$[pluginName].id;
        this._errorTimer = null;
        this._startdate = null;
        this._enddate = null;
        this._initialAttr();
        this.createUi();
        this.refresh();
        this.bindEvent();
      }

      _createClass(DatePicker, [{
        key: 'createUi',
        value: function createUi() {
          var html = '\n        <div class="' + className + '-ui">\n          <div class="title">\n            <div class="prev"><i></i></div>\n            <div class="year">\n              <h2></h2><i class="arrow"></i>\n              <ul class="drop-down"></ul>                \n            </div>\n            <div class="month">\n              <h2></h2><i class="arrow"></i>\n              <ul class="drop-down"></ul>              \n            </div>\n            <div class="next"><i></i></div>\n          </div>\n          <table>\n            <thead>\n              <tr>\n                <th>一</th>\n                <th>二</th>\n                <th>三</th>\n                <th>四</th>\n                <th>五</th>\n                <th class="weekend">六</th>\n                <th class="weekend">日</th>\n              </tr>\n            </thead>\n            <tbody></tbody>           \n          </table>\n          <div class=\'buttons-bar\'>\n            <a href="javascript:;" class="today">返回今天</a>\n            <a href="javascript:;" class="clear">清空</a>\n          </div>           \n        </div>';
          this.helper = $(html).appendTo('body');
          if (this.options.btnbar) this.helper.find('.buttons-bar').show();
          this.element.parent().css('position', 'relative');
          this.icon = $('<i class="' + className + '-icon"></i>').insertAfter(this.element.css('cursor', 'pointer'));
        }
      }, {
        key: 'refreshSelectYear',
        value: function refreshSelectYear() {
          var $year = this.helper.find('.year').removeClass('select');
          var html = '';
          for (var i = this.options.minyear; i <= this.options.maxyear; i++) {
            if (this._startdate && i < this._startdate.year || this._enddate && i > this._enddate.year) {
              html += '<li class="disabled">' + i + '</li>';
            } else if (i === this.year) {
              html += '<li class="cur">' + i + '</li>';
            } else {
              html += '<li>' + i + '</li>';
            }
          }
          $year.find('ul').html(html);
          if ($year.find('ul li:not(.disabled)').length > 1) $year.addClass('select');
        }
      }, {
        key: 'refreshSelectMonth',
        value: function refreshSelectMonth() {
          var $month = this.helper.find('.month').removeClass('select');
          var start = this._startdate;
          var end = this._enddate;
          var html = '';
          for (var i = 1; i <= 12; i++) {
            var curDate = this.year + this._pad(i);
            if (start && curDate < start.year + this._pad(start.month) || end && curDate > end.year + this._pad(end.month)) {
              html += '<li class="disabled">' + i + '</li>';
            } else {
              html += '<li>' + i + '</li>';
            }
          }
          $month.find('ul').html(html);
          if ($month.find('ul li:not(.disabled)').length >= 3) $month.addClass('select');
          if (start && this.year + this._pad(this.month) <= start.year + this._pad(start.month)) this.helper.find('.prev').addClass('e-disabled');else this.helper.find('.prev').removeClass('e-disabled');

          if (end && this.year + this._pad(this.month) >= end.year + this._pad(end.month)) this.helper.find('.next').addClass('e-disabled');else this.helper.find('.next').removeClass('e-disabled');
        }
      }, {
        key: 'refreshDate',
        value: function refreshDate() {
          var that = this;
          var html = '<tr>';
          var ul = this.helper.find('tbody');
          var j = 0;
          {
            if (!this.year || this.month) {
              var d = new Date();
              if (!this.year) this.year = d.getFullYear();
              if (!this.month) this.month = d.getMonth() + 1;
            }
            this.helper.find('.year h2').html(this.year + '年');
            this.helper.find('.month h2').html(this.month + '月');
          }

          //补齐前面的日
          {
            var _getPrevMonth2 = this._getPrevMonth();

            var _getPrevMonth3 = _slicedToArray(_getPrevMonth2, 2);

            var year = _getPrevMonth3[0];
            var month = _getPrevMonth3[1];

            var day = this._getDay(year, month);
            var w = new Date(this.year, this.month - 1, 1).getDay() - 1;
            day = day - w;
            for (var i = 0; i < w; i++, j++) {
              html += '<td class="text-gray" data-value="' + year + '-' + this._pad(month) + '-' + this._pad(++day) + '">' + day + '</td>';
            }
          }

          //填充日
          {
            for (var _i = 0, _d = this._getDay(this.year, this.month); _i < _d; _i++, j++) {
              if (j === 7) {
                j = 0;
                html += '</tr><tr>';
              };
              if (j === 5 || j === 6) {
                html += '<td class="weekend" data-value="' + this.year + '-' + this._pad(this.month) + '-' + this._pad(_i + 1) + '">' + (_i + 1) + '</td>';
              } else {
                html += '<td data-value="' + this.year + '-' + this._pad(this.month) + '-' + this._pad(_i + 1) + '">' + (_i + 1) + '</td>';
              }
            }
          }

          //补齐后面的日
          {
            var _getNextMonth2 = this._getNextMonth();

            var _getNextMonth3 = _slicedToArray(_getNextMonth2, 2);

            var _year = _getNextMonth3[0];
            var _month = _getNextMonth3[1];

            for (var _i2 = 1; j < 7; j++, _i2++) {
              html += '<td class="text-gray" data-value="' + _year + '-' + this._pad(_month) + '-' + this._pad(_i2) + '">' + _i2 + '</td>';
            }
          }

          html += '</tr>';
          ul.html(html);

          //高亮可选择的日历
          ul.find('td').each(function () {
            var v = $(this).data('value');
            if (v < that.options.startdate || v > that.options.enddate) $(this).addClass('disabled');else if (v === that.format(that.element.val().trim(), 'yyyy-MM-dd')) {
              $(this).addClass('active');
            }
          });

          //设置当前天
          {
            var _d2 = new Date();
            ul.find('td[data-value="' + _d2.getFullYear() + '-' + this._pad(_d2.getMonth() + 1) + '-' + this._pad(_d2.getDate()) + '"]').addClass('today');
          }
        }
      }, {
        key: 'refresh',
        value: function refresh(options) {
          if (options) $.extend(true, this.options, options);

          if (this.options.startdate) this._startdate = this._stringToDate(this.options.startdate);
          if (this.options.enddate) this._enddate = this._stringToDate(this.options.enddate);
          this.element.prop('readonly', this.options.readonly);

          {
            var v = this.element.val().trim();
            if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(v)) {
              ;

              var _stringToDate2 = this._stringToDate(v);

              this.year = _stringToDate2.year;
              this.month = _stringToDate2.month;
              this.day = _stringToDate2.day;
            }
          }

          if (this.element.is(':disabled')) this.icon.addClass('disabled');
          if (this.options.cssstyle) this.helper.addClass(className + '-ui-' + this.options.cssstyle);

          this.setZindex();
          this.refreshDate();
          this.refreshSelectYear();
          this.refreshSelectMonth();
          this.rePosition();
          return this;
        }
      }, {
        key: 'bindEvent',
        value: function bindEvent() {
          var _this = this;

          var that = this;
          //弹出日期
          this.element.add(this.icon).on('click.' + pluginName, function () {
            if (_this.element.prop('disabled')) return _this;
            _this.show();
          });

          //选择日期
          this.helper.find('table').on('click', 'td:not(.disabled)', function () {
            $(this).closest('table').find('.active').removeClass('active');
            that.element.val($(this).addClass('active').data('value'));
            that.options.callback.call(that, $(this).data('value'), {
              year: that.year,
              month: that.month,
              day: $(this).text()
            }) !== false && that.hide();
          });

          //出错提示
          this.helper.on('click', '.disabled', function () {
            return _this.errorTips();
          });

          //上个月
          this.helper.find('.prev').on('click', function () {
            if ($(this).hasClass('e-disabled')) return this;

            var _that$_getPrevMonth = that._getPrevMonth();

            var _that$_getPrevMonth2 = _slicedToArray(_that$_getPrevMonth, 2);

            that.year = _that$_getPrevMonth2[0];
            that.month = _that$_getPrevMonth2[1];

            that.refreshDate();
            that.refreshSelectMonth();
          });

          //下个月
          this.helper.find('.next').on('click', function () {
            if ($(this).hasClass('e-disabled')) return this;

            var _that$_getNextMonth = that._getNextMonth();

            var _that$_getNextMonth2 = _slicedToArray(_that$_getNextMonth, 2);

            that.year = _that$_getNextMonth2[0];
            that.month = _that$_getNextMonth2[1];

            that.refreshDate();
            that.refreshSelectMonth();
          });

          //操作按钮组
          this.helper.find('.buttons-bar').on('click', 'a', function () {
            var $this = $(this);
            if ($this.hasClass('today')) {
              var _ref = [];
              that.year = _ref[0];
              that.month = _ref[1];
              that.day = _ref[2];

              that.refreshDate();
              that.refreshSelectMonth();
              that.helper.find('.today').addClass('today-effect').on('animationend', function () {
                $(this).off('animationend').removeClass('today-effect');
              });
            } else if ($this.hasClass('clear')) {
              that.element.val('');
              var _ref2 = [];
              that.year = _ref2[0];
              that.month = _ref2[1];
              that.day = _ref2[2];

              that.refresh();
              if (typeof that.options.btnbar === 'function') that.options.btnbar.call(that);
            }
          });

          //弹出年月下拉框
          this.helper.on('click', '.year, .month', function (event) {
            var ul = $(this).find('ul');
            if (ul.has(event.target).length > 0 || ul[0] === event.target) {
              event.stopPropagation();return;
            }
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            } else {
              $(this).addClass('active').hasClass('year') && ul.scrollTop((that.year - that.options.minyear - 4) * ul.find('li:first').outerHeight());
            }
          });

          //选择下拉后的年月
          this.helper.find('.drop-down').on('click', 'li:not(.disabled)', function () {
            var select = $(this).closest('.select');
            if (select.hasClass('year')) that.year = parseInt($(this).text(), 10);else that.month = parseInt($(this).text(), 10);
            that.refreshDate();
            that.refreshSelectMonth();
            select.removeClass('active');
            return false;
          });

          //点击空白隐藏弹框
          $(document).on('click.' + pluginName + this._id, function (event) {
            var target = event.target;
            if (_this._visible === true && _this.helper && _this.helper.has(target).length === 0 && _this.helper[0] != target && _this.element[0] != target && _this.icon[0] != target && _this.element.has(target).length === 0) {
              _this.hide();
            };
            var year = _this.helper.find('.year'),
                month = _this.helper.find('.month');
            if (year.has(target).length === 0 && year[0] != target) {
              year.removeClass('active');
            };
            if (month.has(target).length === 0 && month[0] != target) {
              month.removeClass('active');
            };
          });
        }
      }, {
        key: 'rePosition',
        value: function rePosition() {
          if (!this.element) return this;
          //对齐图标
          var position = this.element.position();
          this.icon.css({
            left: position.left + parseInt(this.element.css('margin-left'), 10) + this.element.outerWidth() - this.icon.outerWidth() - (parseInt(this.element.css('padding-right'), 10) || 5),
            top: position.top + parseInt(this.element.css('margin-top'), 10) + this.element.outerHeight() / 2 - this.icon.outerHeight() / 2
          });
          if (!this._visible) return this;
          var that = this,
              offset = this.element.offset(),
              x = offset.left + this.options.left,
              y = offset.top + this.element.outerHeight() + this.options.top;
          this.helper.css({ left: x, top: y });
        }
      }, {
        key: 'show',
        value: function show() {
          if (this._visible) return this;
          this._visible = true;
          this.rePosition();
          this.helper.show().addClass('animated-fadein-bottom');
        }
      }, {
        key: 'hide',
        value: function hide() {
          this._visible = false;
          this.helper.hide().removeClass('animated-fadein-bottom');
          this.helper.find('.error-tips').hide();
        }
      }, {
        key: 'setZindex',
        value: function setZindex() {
          var _this2 = this;

          var getAutoIndex = function getAutoIndex() {
            var maxindex = 0;
            _this2.element.parents().each(function () {
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
        key: 'errorTips',
        value: function errorTips() {
          var tips = this.helper.find('.error-tips');
          var text = this.options.errortext;

          if (this.options.errortext === 'auto') {
            if (this.options.startdate && !this.options.enddate) {
              text = '请选择$start之后的日期';
            } else if (!this.options.startdate && this.options.enddate) {
              text = '请选择$end之前的日期';
            } else {
              text = '请选择$start到$end范围内的日期';
            }
          }

          text = text.replace('$start', this.options.startdate || '').replace('$end', this.options.enddate || '');
          if (tips.length === 0) {
            tips = $('<div class="error-tips">' + text + '</div>').appendTo(this.helper);
          } else {
            tips.show();
          }
          tips.addClass('animated-fadein-top');
          this._errorTimer && clearTimeout(this._errorTimer);
          this._errorTimer = setTimeout(function () {
            return tips.removeClass('animated-fadein-top').fadeOut();
          }, 3000);
        }
      }, {
        key: '_getDay',
        value: function _getDay(year, month) {
          return new Date(year, month, 0).getDate();
        }
      }, {
        key: '_getNextMonth',
        value: function _getNextMonth() {
          var year = void 0,
              month = void 0;
          if (parseInt(this.month, 10) + 1 > 12) {
            year = parseInt(this.year) + 1;
            month = 1;
          } else {
            year = this.year;
            month = parseInt(this.month) + 1;
          }
          return [year, month];
        }
      }, {
        key: '_getPrevMonth',
        value: function _getPrevMonth() {
          var year = void 0,
              month = void 0;
          if (parseInt(this.month, 10) - 1 <= 0) {
            month = 12;
            year = parseInt(this.year, 10) - 1;
          } else {
            month = parseInt(this.month, 10) - 1;
            year = this.year;
          }
          return [year, month];
        }
      }, {
        key: 'format',
        value: function format(date, str) {
          var _this3 = this;

          var year = void 0,
              month = void 0,
              day = void 0;
          if (date) {
            if (typeof date === 'string') {
              date = this._stringToDate(date);
              year = date.year;
              month = date.month;
              day = date.day;
            }
          } else {
            year = this.year;
            month = this.month;
            day = this.day;
          }
          return str.replace(/y{1,4}/g, function ($1) {
            return year.toString().substr(year.toString().length - $1.length);
          }).replace(/M{1,2}/g, function ($1) {
            return $1.length == 2 ? _this3._pad(month) : month;
          }).replace(/d{1,2}/g, function ($1) {
            return $1.length == 2 ? _this3._pad(day) : day;
          });
        }
      }, {
        key: '_pad',
        value: function _pad(str) {
          return (str / Math.pow(10, 2)).toFixed(2).substr(2);
        }
      }, {
        key: '_stringToDate',
        value: function _stringToDate(str) {
          if (typeof str === 'string' && /^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
            str = str.split('-');
            return {
              year: parseInt(str[0], 10),
              month: parseInt(str[1], 10),
              day: parseInt(str[2])
            };
          } else {
            return false;
          }
        }
      }, {
        key: '_initialAttr',
        value: function _initialAttr() {
          var _this4 = this;

          //:代表别名
          ['startdate', 'enddate'].forEach(function (v) {
            var arr = v.split(":");
            if (arr.length > 1) {
              if (_this4.element.attr("data-" + arr[0])) _this4.options[arr[1]] = _this4.element.attr("data-" + arr[0]);
            } else {
              if (_this4.element.attr("data-" + v)) _this4.options[v] = _this4.element.attr("data-" + v);
            }
          });
          return this;
        }
      }]);

      return DatePicker;
    }();

    $.fn[pluginName] = function (options) {
      var _arguments = arguments,
          _this5 = this;

      options = options || {};
      if (typeof options == 'string') {
        var _ret = function () {
          var args = _arguments,
              method = options;
          Array.prototype.shift.call(args);
          switch (method) {
            case "getClass":
              return {
                v: $(_this5).data('plugin_' + pluginName)
              };
            default:
              return {
                v: _this5.each(function () {
                  var plugin = $(this).data('plugin_' + pluginName);
                  if (plugin && plugin[method]) plugin[method].apply(plugin, args);
                })
              };
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        return this.each(function () {
          var plugin = $(this).data('plugin_' + pluginName);
          if (!plugin) $(this).data('plugin_' + pluginName, new DatePicker($(this), options));
        });
      };
    };

    $[pluginName] = {
      id: 0,
      zindex: 999
    };
  })(jQuery, window);

/***/ }

/******/ });