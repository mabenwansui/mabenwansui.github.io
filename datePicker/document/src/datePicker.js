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

  __webpack_require__(53);

/***/ },

/***/ 53:
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
      display: false,
      errortext: 'auto',
      btnbar: false,
      startdate: false,
      enddate: false,
      minyear: 1975,
      maxyear: 2025,
      h: false,
      m: false,
      s: false,
      h_range: false,
      m_range: false,
      s_range: false,
      zindex: 'auto',
      cssStyle: null,
      init: $.noop,
      prev: $.noop,
      next: $.noop,
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
        this._startdate = false;
        this._enddate = false;
        this._dateRE = function (str) {
          return (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)
          );
        };
        this._timeRE = function (str) {
          return (/^\d{4}-\d{1,2}-\d{1,2} (\d{1,2}:)*\d{1,2}$/.test(str)
          );
        };
        this._initialAttr();
        this.createUi();
        this.refresh();
        this.bindEvent();
        this.options.init && this.options.init.call(this);
      }

      _createClass(DatePicker, [{
        key: 'createUi',
        value: function createUi() {
          var html = '\n        <div class="' + className + '-ui">\n          <div class="title">\n            <div class="prev"><i></i></div>\n            <div class="year">\n              <h2></h2><i class="arrow"></i>\n              <ul class="drop-down"></ul>                \n            </div>\n            <div class="month">\n              <h2></h2><i class="arrow"></i>\n              <ul class="drop-down"></ul>              \n            </div>\n            <div class="next"><i></i></div>\n          </div>\n          <table>\n            <thead>\n              <tr>\n                <th>一</th>\n                <th>二</th>\n                <th>三</th>\n                <th>四</th>\n                <th>五</th>\n                <th class="weekend">六</th>\n                <th class="weekend">日</th>\n              </tr>\n            </thead>\n            <tbody></tbody>           \n          </table>\n          <div class="hms-bar"></div>\n          <div class=\'buttons-bar\'>\n            <a href="javascript:;" class="today">返回今天</a>\n            <a href="javascript:;" class="clear">清空</a>\n          </div>           \n        </div>';
          if (this.options.display === 'inline') {
            this.helper = $(html).insertAfter(this.element);
            this.helper.css({
              display: 'inline-block',
              position: 'relative'
            });
            this.icon = $();
          } else {
            this.helper = $(html).appendTo('body');
            this.element.parent().css('position', 'relative');
            this.icon = $('<i class="' + className + '-icon"></i>').insertAfter(this.element.css('cursor', 'pointer'));
          }
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

          return html;
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
              $(this).trigger('click', [true]);
            }
          });

          //设置当前天
          {
            var _d2 = new Date();
            ul.find('td[data-value="' + _d2.getFullYear() + '-' + this._pad(_d2.getMonth() + 1) + '-' + this._pad(_d2.getDate()) + '"]').addClass('today');
          }
        }
      }, {
        key: 'assignment',
        value: function assignment() {
          var v = this.element.val().trim();
          if (!v) return this;
          if (this._timeRE(v)) {
            var _stringToDate2 = this._stringToDate(v);

            this.year = _stringToDate2.year;
            this.month = _stringToDate2.month;
            this.day = _stringToDate2.day;
            this.h = _stringToDate2.h;
            this.m = _stringToDate2.m;
            this.s = _stringToDate2.s;

            this.refreshHms();
          } else if (this._dateRE(v)) {
            var _stringToDate3 = this._stringToDate(v);

            this.year = _stringToDate3.year;
            this.month = _stringToDate3.month;
            this.day = _stringToDate3.day;
          }
          this.refreshDate();
          this.refreshSelectYear();
          this.refreshSelectMonth();
        }
      }, {
        key: 'refresh',
        value: function refresh(options) {
          if (options) $.extend(true, this.options, options);

          if (this.options.startdate) this._startdate = this._stringToDate(this.options.startdate);
          if (this.options.enddate) this._enddate = this._stringToDate(this.options.enddate);
          this.element.prop('readonly', this.options.readonly);

          if (this.options.h || this.options.m || this.options.s) {
            var d = new Date();
            this.h = /^\d+$/.test(this.options.h) ? this.options.h : d.getHours();
            this.m = /^\d+$/.test(this.options.m) ? this.options.m : d.getMinutes();
            this.s = /^\d+$/.test(this.options.s) ? this.options.s : d.getSeconds();
            this.refreshHms();
          }
          this.setZindex();
          this.refreshDate();
          this.refreshSelectYear();
          this.refreshSelectMonth();
          if (this.element.is(':disabled')) this.icon.addClass('disabled');
          if (this.options.cssstyle) this.helper.addClass(className + '-ui-' + this.options.cssstyle);
          if (this.options.btnbar) this.helper.find('.buttons-bar').show();
          this.rePosition();
          return this;
        }
      }, {
        key: 'bindEvent',
        value: function bindEvent() {
          var _this = this;

          var that = this;
          //弹出日期
          if (this.options.display === 'inline') {
            this.element.hide();
            this.show();
          } else {
            this.element.add(this.icon).on('click.' + pluginName, function () {
              if (_this.element.prop('disabled')) return _this;
              _this.show();
            });
          }
          //选择日期
          this.helper.find('table').on('click', 'td:not(.disabled)', function (e, flag) {
            var $this = $(this);
            $this.closest('table').addClass('selected').find('.active').removeClass('active');
            $this.addClass('active');
            that.day = parseInt($this.text(), 10);
            if (that.helper.find('a.ok').length === 0) {
              var value = $this.data('value');
              that.element.val(value);
              !flag && that.options.callback.call(that, value, {
                element: $this,
                year: that.year,
                month: that.month,
                day: that.day
              }) !== false && that.hide();
            }
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
              var _ref = []; //返回今天

              that.year = _ref[0];
              that.month = _ref[1];

              that.refreshDate();
              that.refreshSelectMonth();
              that.helper.find('.today').addClass('today-effect').on('animationend', function () {
                $(this).off('animationend').removeClass('today-effect');
              });
            } else if ($this.hasClass('clear')) {
              //清空
              that.element.val('');
              that.helper.find('table.selected').removeClass('selected');
              var _ref2 = [];
              that.year = _ref2[0];
              that.month = _ref2[1];
              that.day = _ref2[2];

              that.refresh();
              if (typeof that.options.btnbar === 'function') that.options.btnbar.call(that);
            } else if ($this.hasClass('ok')) {
              //确定
              if (that.helper.find('table.selected').length === 0) {
                that.errorTips('请选择日期');
              } else {
                (function () {
                  var obj = {};
                  ['year', 'month', 'day', 'h', 'm', 's'].forEach(function (v) {
                    return that[v] && (obj[v] = that[v]);
                  });
                  var value = that.format(obj, 'yyyy-MM-dd hh:mm:ss');
                  that.element.val(value);
                  that.options.callback.call(that, value, obj) !== false && that.hide();
                })();
              }
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

          this.helper.on('click', '.error-tips', function () {
            $(this).fadeOut();
          });

          //点击空白隐藏弹框
          $(document).on('click.' + pluginName + this._id, function (event) {
            var target = event.target;
            if (!_this.options.display) {
              if (_this._visible === true && _this.helper && _this.helper.has(target).length === 0 && _this.helper[0] != target && _this.element[0] != target && _this.icon[0] != target && _this.element.has(target).length === 0) {
                _this.hide();
              };
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
        key: 'createHms',
        value: function createHms(type) {
          var _this2 = this;

          var map = {
            h: ['时', 24],
            m: ['分', 60],
            s: ['秒', 60]
          };
          var html = '\n        <div class="section">\n          <h4><span></span>' + map[type][0] + '</h4>\n          <div class="slider">\n            <div class="handle"></div>\n            <div class="line e-disabled start" title="超出可选择的时间范围"></div>\n            <div class="line e-disabled end" title="超出可选择的时间范围"></div>\n            <div class="line"></div>\n          </div>\n        </div>\n      ';
          this['$' + type] = $(html).appendTo(this.helper.find('.hms-bar').show());

          var start = 0,
              end = map[type][1];
          {
            var val = this.options[type + '_range'];
            if (/^\d+$|^\d+-\d+$/.test(val)) {
              var arr = val.trim().split('-');
              start = parseInt(arr[0], 10);
              arr[1] && (end = parseInt(arr[1], 10));
            }
          }

          this.drag({
            element: this['$' + type],
            total: map[type][1],
            start: start,
            end: end,
            defaultValue: this[type],
            callback: function callback(time) {
              _this2[type] = time;
              _this2['$' + type].find('h4 span').text(time);
            }
          });
        }
      }, {
        key: 'refreshHms',
        value: function refreshHms() {
          var _this3 = this;

          var i = 0;
          this.helper.find('.hms-bar').empty();
          ['h', 'm', 's'].forEach(function (v) {
            if (_this3.options[v]) {
              _this3.createHms(v);
              i++;
            }
          });
          if (i > 0) {
            var bar = this.helper.find('.buttons-bar');
            if (bar.find('.ok').length === 0) {
              bar.addClass('okbar');
              this.options.btnbar = true;
              this.$ok = $('<a href="javascript:;" class="ok">确定</a>').prependTo(bar);
            }
          }
        }
      }, {
        key: 'drag',
        value: function drag(_ref3) {
          var element = _ref3.element;
          var total = _ref3.total;
          var start = _ref3.start;
          var end = _ref3.end;
          var defaultValue = _ref3.defaultValue;
          var callback = _ref3.callback;

          var box = element.find('.slider');
          var handle = element.find('.handle');
          var handle_w = handle.outerWidth();
          var box_w = box.outerWidth() - handle_w;
          var getX = function getX(value) {
            return Math.ceil(box_w / total * value, 10);
          };
          var getV = function getV(value) {
            return parseInt(value / (box_w / total), 10);
          };

          box.find('.line:not(.e-disabled)').on('click', function (e) {
            var x = e.pageX - box.offset().left - handle_w / 2;
            handle.trigger('position', [x, function (v) {
              return callback(v);
            }]);
          });

          handle.on({
            'selectstart': function selectstart() {
              return false;
            },
            'position': function position(e, x, callback) {
              var _start = getX(start);
              var _end = getX(end);
              var loc = x;
              if (x < _start) loc = _start;else if (x > _end) loc = _end;
              $(this).css('left', loc);
              callback && callback(getV(loc));
            },
            'mousedown': function mousedown(e) {
              var $this = $(this).addClass('active');
              var x = e.pageX - $this.offset().left;
              $(document).on({
                'mousemove.datepickerdrag': function mousemoveDatepickerdrag(e) {
                  $this.trigger('position', [e.pageX - box.offset().left - x, function (v) {
                    return callback(v);
                  }]);
                },
                'mouseup.datepickerdrag': function mouseupDatepickerdrag(e) {
                  $this.removeClass('active');
                  $(this).unbind("mousemove.datepickerdrag").unbind("mouseup.datepickerdrag");
                }
              });
            }
          });

          //初始化默认值
          {
            if (start !== 0) {
              if (defaultValue < start) defaultValue = start;
              box.find('.start').show().css('width', getX(start));
            }
            if (end !== 0) {
              box.find('.end').show().css('width', getX(end === 0 ? 0 : total - end));
              if (defaultValue > end) defaultValue = end;
            }
            handle.css('left', getX(defaultValue));
            callback(defaultValue);
          }
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          $(document).off('click.' + pluginName + this._id);
          this.element.off('click.' + pluginName);
          this.helper.remove();
          this.icon.remove();
          this.element.css('cursor', 'auto').removeData('plugin_' + pluginName);
          if (this.options.readonly) this.element.prop('readonly', false);
        }
      }, {
        key: 'rePosition',
        value: function rePosition() {
          if (!this.element || this.options.display === 'inline') return this;
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
          this.assignment();
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
          var _this4 = this;

          var getAutoIndex = function getAutoIndex() {
            var maxindex = 0;
            _this4.element.parents().each(function () {
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
        value: function errorTips(str) {
          var tips = this.helper.find('.error-tips');
          var text = this.options.errortext;

          if (str) {
            text = str;
          } else {
            if (this.options.errortext === 'auto') {
              if (this.options.startdate && !this.options.enddate) {
                text = '请选择$start之后的日期';
              } else if (!this.options.startdate && this.options.enddate) {
                text = '请选择$end之前的日期';
              } else {
                text = '请选择$start到$end范围内的日期';
              }
            } else if (this.options.errortext === false) {
              return false;
            }
            text = text.replace('$start', this.options.startdate || '').replace('$end', this.options.enddate || '');
          }
          if (tips.length === 0) {
            tips = $('<div class="error-tips">' + text + '</div>').appendTo(this.helper);
          } else {
            tips.show().html(text);
          }
          tips.addClass('animated-fadein-top');
          this._errorTimer && clearTimeout(this._errorTimer);
          this._errorTimer = setTimeout(function () {
            return tips.removeClass('animated-fadein-top').fadeOut();
          }, 2500);
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
        value: function format(date, _format) {
          var _this5 = this;

          if (typeof date === 'string') date = this._stringToDate(date);
          if (date) {
            var _ret2 = function () {
              var obj = {
                M: 'month',
                d: 'day',
                h: 'h',
                m: 'm',
                s: 's'
              };
              Object.keys(obj).forEach(function (v) {
                return !date[obj[v]] && (_format = _format.replace(new RegExp('[^a-zA-z]' + v + '+'), ''));
              });
              _format = _format.replace(/y{1,4}/g, function ($1) {
                return date.year.toString().substr(date.year.toString().length - $1.length);
              });
              Object.keys(obj).forEach(function (v, i) {
                _format = _format.replace(new RegExp(v + '{1,2}', 'g'), function ($1) {
                  return $1.length == 2 ? _this5._pad(date[obj[v]]) : date[obj[v]];
                });
              });
              return {
                v: _format
              };
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
          }
        }
      }, {
        key: '_pad',
        value: function _pad(str) {
          return (str / Math.pow(10, 2)).toFixed(2).substr(2);
        }
      }, {
        key: '_stringToDate',
        value: function _stringToDate(str) {
          str = str.trim();
          if (this._dateRE(str) || this._timeRE(str)) {
            var _ret3 = function () {
              str = str.split(' ');
              var date = str[0].split('-');
              var time = str[1] ? str[1].split(':') : false;
              var obj = {};
              ['year', 'month', 'day'].forEach(function (v, i) {
                return obj[v] = parseInt(date[i], 10);
              });
              if (time) ['h', 'm', 's'].forEach(function (v, i) {
                return time[i] && (obj[v] = parseInt(time[i], 10));
              });
              return {
                v: obj
              };
            }();

            if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
          } else {
            return false;
          }
        }
      }, {
        key: '_initialAttr',
        value: function _initialAttr() {
          var _this6 = this;

          //:代表别名
          ['startdate', 'enddate'].forEach(function (v) {
            var arr = v.split(":");
            if (arr.length > 1) {
              if (_this6.element.attr("data-" + arr[0])) _this6.options[arr[1]] = _this6.element.attr("data-" + arr[0]);
            } else {
              if (_this6.element.attr("data-" + v)) _this6.options[v] = _this6.element.attr("data-" + v);
            }
          });
          return this;
        }
      }]);

      return DatePicker;
    }();

    $.fn[pluginName] = function (options) {
      var _arguments = arguments,
          _this7 = this;

      options = options || {};
      if (typeof options == 'string') {
        var _ret4 = function () {
          var args = _arguments,
              method = options;
          Array.prototype.shift.call(args);
          switch (method) {
            case "getClass":
              return {
                v: $(_this7).data('plugin_' + pluginName)
              };
            default:
              return {
                v: _this7.each(function () {
                  var plugin = $(this).data('plugin_' + pluginName);
                  if (plugin && plugin[method]) plugin[method].apply(plugin, args);
                })
              };
          };
        }();

        if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
      } else {
        return this.each(function () {
          var plugin = $(this).data('plugin_' + pluginName);
          if (!plugin) $(this).data('plugin_' + pluginName, new DatePicker($(this), options));
        });
      };
    };

    $[pluginName] = {
      id: 0,
      zindex: 100
    };
  })(jQuery, window);

/***/ }

/******/ });