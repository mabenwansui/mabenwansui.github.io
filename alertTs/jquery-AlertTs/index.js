import './css/style.css';

(function($, window, undefined) {
  'use strict';
  const pluginName = 'AlertTs';
  const className = 'alert-ts';
  const defaults = {
    position: 'top',           //对齐方向  top,right,bottom,left
    left: 0,                   //弹框左偏移
    top: 3,                    //弹框上偏移
    act: 'hover',              //鼠标事件  hover, click(点击显示，空白消失), false(直接弹框，没有事件)
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
      this.initialAttr();
      this.mergeOptions();
      this.toNumber();
      this.createUi();
      this.bindEvent();
      this.options.callback.init.call(this);
    }
    createUi(){
      let helper = $(`<div class="${className}"></div>`).css(this.options.css);
      this.$content = $(`<div>${this.options.content}</div>`).appendTo(helper);
      if(this.options.arrow){
        this.$arrow = $(`<div class="arrow"><i></i><i class="a1"></i></div>`).appendTo(helper);
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
      if(this._visible) return this;
      this._visible = true;
      this.options.act === 'click' && $(document).on('click.' + pluginName + this._id, event => {
        if (this.helper &&
          this.helper.has(event.target).length === 0 &&
          this.helper[0] != event.target &&
          this.element[0] != event.target &&
          this.element.has(event.target).length === 0) {
          this.hide();
        };
      });

      this.options.timeout && setTimeout( ()=> this.hide(), this.options.timeout );
      this.options.callback.beforeshow.call(this);
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
      return this;
    }
    hide(){
      if(!this._visible) return this;
      this._visible = false;
      this.options.act === 'click' && $(document).off('click.' + pluginName + this._id);
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
            } else {
              arrowPoint = that.helper.innerHeight() / 2 - size + left;
            };
            arrowBoxPoint = -arrowPoint-size + that.element.outerWidth() / 2;
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
    play(){
      this._timer = setTimeout( ()=> {
        if(!this.element || !this.helper){
          this.stop();
          return this;
        };
        if (!this._visible || !this.element.is(":visible")) {
          this.helper.hide();
          this.stop();
          return this;
        };
        this.rePosition();
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
              _delay = 200,
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
      if (zindex.indexOf('auto') > -1) {
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
    parent: (element) => element.closest("." + classname + "-k").data("plugin_" + pluginName).data("plugin_" + pluginName)    
  }
}(jQuery, window));