//import './css/style.css';
;(function($, window, undefined) {
  'use strict';
  const pluginName = 'Validate';
  const className = 'validate';
  const defaults = {
    rules     : [],
    debug    : false,  //回调不执行
    ignore   : [],     //对某些元素不验证
    fail     : false,
    success  : false
  }
  let tipMsg = {
    required        : '请填写$title !',
    select_required : '请选择$title !',
    length_max      : '$title不能大于$max个字符 !',
    length_min      : '$title不能小于$min个字符 !',
    number_max      : '$title不能大于$max !',
    number_min      : '$title不能小于$min !',
    checked_min     : '$title至少选择$min项 !',
    checked_max     : '$title最多选择$max项 !',
    email           : '$title格式输入不正确 !',
    number          : '$title请填写整数 !',
    float           : '$title请填写数字 !',
    mobile          : '$title输入不正确 !',
    pattern         : '$title不符合规范 !'
  }  

  class Validate {
    constructor(element, options){
      this.form = this.element = element;
      this.options = $.extend(true, {}, defaults, options);
      this.validateRule = $.extend(this._validateRule(), this.options.dyrules);
      this.tips = this._tips();
      this._element;
      this.bindFormSubmit();
      this.refresh();
      this._loading($('[name="user"]'));
      setTimeout( ()=> this._loading($('[name="user"]'), false), 2000 )
    }
    _validateRule(){
      let that = this;
      let reg = val => new RegExp('\\$'+val, 'g');
      let empty = val => !/^[\w\W]+$/.test(val);
      return {
        required: function ({type, title, element, val, valid, msg}) {
          switch(element.attr('type') || element[0].tagName.toLowerCase()){
            case 'select':
              if(element[0].selectedIndex === 0){
                valid = false;
                if(!msg) msg = tipMsg.select_required.replace(reg('title'), title);
              }
              break;
            case 'checkbox':
            case 'radio':
              if(element.filter(':checked').length === 0){
                valid = false;
                if(!msg) msg = tipMsg.select_required.replace(reg('title'), title);
              }
              break;
            default:
              if( empty(val) ){
                valid = false;
                if(!msg) msg = tipMsg.required.replace(reg('title'), title);
              }
          }
          return {element, valid, msg};
        },
        number : function({element, title, val, valid, msg}){
          if( !empty(val) && !/^\d+(\.\d+)?$/.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.number.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        integer : function({element, title, val, valid, msg}){
          if( !empty(val) && !/^\d+$/.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.integer.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        nmax : function({element, title, val, valid, msg}, max){
          if(parseInt(val, 10) > parseInt(max,10)){
            valid = false;
            if(!msg) msg = tipMsg.number_max.replace(reg('title'), title).replace(reg('max'), max);
          }
          return {element, valid, msg};
        },
        smax : function({element, title, val, valid, msg}, max){
          if(val.length > max){
            valid = false;
            if(!msg) msg = tipMsg.length_max.replace(reg('title'), title).replace(reg('max'), max);
          }
          return {element, valid, msg};
        },
        max : function({element, title, val, valid, msg}, max){
          if(element.attr('type')==='checkbox'){
            if(element.filter(':checked').length > max){
              valid = false;
              if(!msg) msg = tipMsg.checked_max.replace(reg('title'), title).replace(reg('max'), max);
            }
          }    
          return {element, valid, msg};
        },
        nmin : function({element, title, val, valid, msg}, min){
          if(parseInt(val, 10) < parseInt(min,10)){
            valid = false;
            if(!msg) msg = tipMsg.number_min.replace(reg('title'), title).replace(reg('min'), min);
          }
          return {element, valid, msg};
        },
        smin : function({element, title, val, valid, msg}, min){
          if(val.length < min){
            valid = false;
            if(!msg) msg = tipMsg.length_min.replace(reg('title'), title).replace(reg('min'), min);
          }
          return {element, valid, msg};
        },
        min : function({element, title, val, valid, msg}, min){
          if(element.attr('type')==='checkbox'){
            if(element.filter(':checked').length < min){
              valid = false;
              if(!msg) msg = tipMsg.checked_min.replace(reg('title'), title).replace(reg('min'), min);
            }
          }            
          return {element, valid, msg};          
        },
        email : function({element, title, val, valid, msg}){
          if( val !== "" && !/^[a-z_0-9-\.]+@([a-z_0-9-]+\.)+[a-z0-9]{2,8}$/i.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.email.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        ajax : function({element, title, val, valid}, options){
          return new Promise((resolve, reject) => {
            //options = $.extend({
            //  cache: false,
            //  dataType:'json',
            //}, options, {
            //  success: function(data){
            //    resolve(options.success && options.success(data) || {valid:true});
            //  },
            //  error: function(e){
            //    resolve(options.error && options.error(e) || {valid:false, msg:e});
            //  }
            //});
            //$.ajax(options);
            setTimeout(function(){
              resolve({
                element,
                valid : false,
                msg : 'ajax'
              });
            },500);
          });
        },
        pattern : function({element, title, val, valid, msg}, reg){
          if(!reg.test(val)){
            valid = false;
            if(!msg) msg = tipMsg.pattern.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        dy : function({element, title, val, valid, msg}, func){
          return func && func.call(that, element, title) || {element, valid, msg};
        }
      }
    }
    _loading(element, isShow=true){
      if(isShow){
        let _loading = element.data('valid-loading');
        if(_loading) return _loading; 
        let html = `
          <div class="loader">
            <div class="ball-clip-rotate">
              <div></div>
            </div>
          </div>
        `;
        let pos = element.position();
        let loading = $(html).appendTo('body');
        loading.css({
          position : 'absolute',
          top  : pos.top + element.outerHeight()/2 - loading.height()/2,
          left : pos.left + element.outerWidth() - loading.width() - 3
        });
        element.data('valid-loading', loading);
        return loading;
      }else{
        let _loading = element.data('valid-loading');
        _loading.fadeOut('slow', () => _loading.remove());
      }
    }
    _runYield(gen, success, fail, end){
      let g = gen();
      let next = (v)=>{
        let result = g.next(v);
        if(result.done) {
          end && end();
          return false;
        }
        result.value.then(result => {
          success && success(result);
          next(result);
        }).catch(result => {
          fail && fail(result);
          next(result);
        });
      }
      next();
    }
    /*
      data为一个解析过的数组  //插件自用
      或者  一个jquery对象
        如: $('[name = 'user']')
      或者  是一个数组, 数组的每一项是一个jquery对象
        如: [$('[name = 'user']'), $('.language :radio')]
    */
    scan(data, callback){
      let that = this;
      let failArr = [];
      let _success = function({element, msg}){
        element.removeData('valid-msg');
        that.tips.highlight(element, msg, false);
      };
      let _fail = function({element, msg}){
        failArr.push({element, msg});
        element.data('valid-msg', msg);
        that.tips.highlight(element, msg, true);
      };
      let _end = () => callback && callback(failArr.length>0 ? false : true, failArr);

      let arr = [];
      if(data instanceof jQuery){
        arr.push(that._attrToJson(data));
      }else if($.isArray(data)){
        arr = data.map( v=> (v instanceof jQuery) ? that._attrToJson(v) : v );
      }
      arr.length>0 && this._runYield(function* (){
        for(let i=0, len=arr.length; i<len; i++) yield _scan(arr[i]);
      }, _success, _fail, _end);

      function _scan(v){       
        return new Promise((resolve, reject) => {
          that._element = v;
          that._element.val = that._element.name.val().trim();
          that._runYield(function* (){
            let result, type=that._element.type;
            let reData = (name) => {
              return {
                type  : that._element.type,
                title : that._element.title,
                val   : that._element.val,
                element : that._element.name,
                valid : true,
                msg   : (function(){
                          let msg = that._element['msg_'+name] || that._element.msg || '';
                          if(msg) msg = msg.replace(/\$title/, that._element.title);
                          return msg;
                        })()
              }
            };            
            for(let i=0, len=type.length; i<len; i++){
              let v = type[i].split('=');
              let ruleFunc = that.validateRule[v[0]];
              if(!ruleFunc) break;
              result = ruleFunc.call(that, reData(v[0]), v[1]);
              if(result.valid === false) reject(result);
            }
            if(that._element.ajax){
              result = yield that.validateRule.ajax(reData(v[0]), that._element.ajax) || {};
              if(result.valid === false) reject(result);
            }
            if(that._element.dy){
              result = that.validateRule.dy(reData(v[0]), that._element.dy) || {};
              if(result.valid === false) reject(result);
            }
            resolve({element:that._element.name, valid:true});
          });
        });
      }
    }
    _ruleSort(){
      let ele = $('input, select, textarea', this.form);
      this.options.rules.sort((a,b) => {
        return ele.index(a.name) - ele.index(b.name);
      });
    }    
    refresh(){
      let that = this;
      this.options.rules = this.options.rules.map( v => this._jsonFormat(v) );
      this.form.find(`[valid-type]`).each(function(){ that._attrToJson($(this)) });
      this._ruleSort();
      that.options.rules.forEach(function(v){ that.tips.bindTips(v) });
    }
    _needValidate(element){
      return ( 
        element.attr(`${pluginName.toLowerCase()}-type`) ||
        this.options.rules.some(v => v.name[0] === element[0])
      ) ? true : false;
    }
    _jsonFormat(v){
      function arrayToJson(val){
        if($.isArray(val)) {
          let o={}, arr=['name', 'title', 'type', 'msg_required', 'msg'];
          val.forEach((v, i) => {
            if($.isPlainObject(v)){
              $.extend(o, v);
            }else{
              arr[i] && (o[arr[i]] = v);
            }
          });
          return o;
        }else{
          return val;
        }
      }
      function getType(arr){
        let type = obj.type;
        if(!type) return [];
        if(typeof obj.type === 'string')
          type = type.split(/\s*,\s*/);
        
        //将简写替换成全称      
        let A = [
          [/^\*$/, 'required'],
          [/^e$/,  'email'],
          [/^n$/,  'number'],
          [/^f$/,  'float'],
          [/^([a-z]?)\^?(\d+)$/, '$1min=$2'],
          [/^([a-z]?)(\d+)\$$/g, '$1max=$2'],
          [/^([a-z]?)(\d+)[-](\d+)$/, (all, $1, $2, $3) => `${$1}min=${$2},${$1}max=${$3}`],
        ];

        //将 '*,6-10,n' 替换成 ['required', 'min=6, max=10', 'number']
        type = type.map(v=> {
          A.forEach(value => v=v.replace(value[0], value[1]));
          return v;
        });
        console.log(type);

        //平铺数组 ['required', 'min=6, max=10', 'number'] 转换成 ['required', 'min=6', 'max=10', 'number']
        type.forEach((v,i) => {
          if(v.indexOf(',') > -1)
            [].splice.apply(type, [i,1].concat(v.split(',')));
        });
        return type;
      }
      function getName(){
        let name = obj.name;
        if( typeof name === 'string' ){
          if( /^[.#]/.test(name) ){
            name = that.form.find(name);
          }else{
            name = that.form.find(`[name='${name}']`);
          }
        }else if(name instanceof jQuery){
          name = name;
        }else{
          name = $(name);
        }
        if(name.length > 1) name.attr('valid-g', +new Date());
        return name.length>0 ? name : false;
      }

      let that = this;
      let obj = arrayToJson(v);
      obj.name = getName();
      obj.type = getType();
      return obj;
    }
    _attrToJson(ele){
      let prefix = 'valid';
      let mergeRule = (obj) => {
        let exists;
        this.options.rules = this.options.rules.map((v, i) => {
          if(v.name[0] === obj.name[0]){         
            v = $.extend(obj, v);
            exists = v;
          };
          return v;
        });
        if(exists){
          return exists;
        }else{
          this.options.rules.push(obj);
          return obj;
        }
      };

      let obj = {
        type: ele.attr(`${prefix}-type`),
        title: ele.attr(`${prefix}-title`)
      };
      let group = ele.attr(`${prefix}-group`);
      let associatedElements = ele.attr(`${prefix}-g`);
      if(group){
        obj.name = ele.find(`:${group}`);
        obj.tips = ele;
      }else if(associatedElements){
        obj.name = this.form.find(`[${prefix}-g="${associatedElements}"]`);
      }else{
        obj.name = ele;
      }
      Object.keys(this.validateRule).forEach(v=>{
        let attrValue = ele.attr(`${prefix}-msg-${v}`);
        if(attrValue) obj[`msg_${v}`] = attrValue;
      });
      let attrValue = ele.attr(`${prefix}-msg`);
      if(attrValue) obj[`msg`] = attrValue;
      obj = this._jsonFormat(obj);

      return mergeRule(obj);
    }
    _getAttrJson(ele){
      return this.options.rules.filter(v => v.name.filter(ele).length>0)[0] || {};
    }
    _tips(){
      let that = this;
      return {
        highlight(element, msg, flag){
          flag = flag ? 'addClass' : 'removeClass';
          element = element.is(':checkbox, :radio') ? element.parent() : element;
          element[flag]('valid-error');
        },
        showTips(element, msg){
          if(this.lastAlertTsElement && this.lastAlertTsElement[0]!==element[0]) this.hideTips(this.lastAlertTsElement);
          element.AlertTs({
            act: 'hide',
            cssStyle: 'error',
            top: 2,
            left: 15,
            content: msg,
            css: {
              padding: '5px 10px'
            },
          }).AlertTs('show');
          this.lastAlertTsElement = element;
        },
        hideTips(element){
          element.AlertTs && element.AlertTs('hide');
        },
        bindTips(rule){
          let self = this;
          let timer;
          let element = rule.name;
          element.off(`.${pluginName}`).on({
            [`focus.${pluginName}`]: function(){
              timer = setTimeout(() => {
                if($(this).data('valid-msg')) self.showTips(rule.tips ? rule.tips : $(this), $(this).data('valid-msg'));
              }, $(this).is(':checkbox,:radio') ? 200 : 0);
            },
            [`blur.${pluginName}`]: function(){
              timer && clearTimeout(timer);
              self.hideTips(rule.tips ? rule.tips : $(this));
            },
            [`change.${pluginName}`]: function(){
              timer && clearTimeout(timer);
              that.scan(element, valid => {
                if(valid){
                  self.hideTips(rule.tips ? rule.tips : element);
                }else if( element.is(':radio, :checkbox') ){
                  $(this).triggerHandler('focus');
                }
              });
            }
          });
        }         
      } //end return
    }
    bindFormSubmit(){
      var that = this;
      this.form.on('submit', (e, valid=true)=> {
        if(valid === true){
          that.scan(that.options.rules, (valid, failArr) => {
            let result = false;
            if(!valid){
              if(that.options.fail) result = that.options.fail.call(that, failArr);
              let element = failArr[0].element;
              element.triggerHandler('focus');
            }else{
              if(that.options.success) result = that.options.success.call(that);
            }
            if(result === true) that.form.trigger('submit', [false]);
          });
          return false;
        }else{
          return true;
        }
      });
    }
  }

  $.fn[pluginName] = function (options) {
    options = options || {};
    if (typeof options === 'string') {
      let args = arguments,
          method = options;
      Array.prototype.shift.call(args);
      switch (method) {
        case "getClass":
          return $(this).data('plugin_' + pluginName);
        default:
          return this.each(function(){
            let plugin = $(this).data('plugin_' + pluginName);
            if (plugin && plugin[method]) plugin[method].apply(plugin, args);
          });
      };
    } else {
      return this.each(function(){
        let plugin = $(this).data('plugin_' + pluginName);
        if(plugin){
          plugin.refresh();
        }else{
          if(typeof options === 'function'){
            options = {
              success : options
            }
          }
          $(this).data('plugin_' + pluginName, new Validate($(this), options));
        }
      });
    };
  };

}(jQuery, window));