//import './css/style.css';

;(function($, window, undefined) {
  'use strict';
  const pluginName = 'Validate';
  const className = 'validate';
  const defaults = {
    rule     : [],
    debug    : false,  //回调不执行
    tips     : 'AlertTs',
    tipsconf : {

    },
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
      this.validateRule = this._validateRule();
      this._element;
      this._tipsType = this._tipsType()[this.options.tips];
      this.bindEvent();
      this.refresh();
    }
    _validateRule(){
      let that = this;
      let reg = name => new RegExp('\\$'+name, 'g');
      let initial = (name) => {
        return {
          type  : this._element.type,
          title : this._element.title,
          val   : this._element.val,
          element : this._element.name,
          valid : true,
          msg   : (function(){
                    let msg = that._element['msg_'+name] || that._element.msg || '';
                    if(msg) msg = msg.replace(reg('title'), that._element.title);
                    return msg;
                  })()
        }
      };
      return {
        required: function () {
          let {type, title, element, val, valid, msg} = initial('required');
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
              if( !/^[\w\W]+$/.test(val) ){
                valid = false;
                if(!msg) msg = tipMsg.required.replace(reg('title'), title);
              }
          }
          return {element, valid, msg};
        },
        number : function(){
          let {type, title, element, val, valid, msg} = initial('number');
          if( !/^\d+$/.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.number.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        float : function(){
          let {type, title, element, val, valid, msg} = initial('float');
          if( !/^\d+(\.\d+)?$/.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.float.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        max : function(max){
          let {type, title, element, val, valid, msg} = initial('max');
          if(type.indexOf('number')>-1){
            if(parseInt(val, 10) > parseInt(max,10)){
              valid = false;
              if(!msg) msg = tipMsg.number_max.replace(reg('title'), title).replace(reg('max'), max);
            }
          }else if(element.attr('type')==='checkbox'){
            if(element.filter(':checked').length > max){
              valid = false;
              if(!msg) msg = tipMsg.checked_max.replace(reg('title'), title).replace(reg('max'), max);
            }
          }else{
            if(val.length > max){
              valid = false;
              if(!msg) msg = tipMsg.length_max.replace(reg('title'), title).replace(reg('max'), max);
            }
          }
          return {element, valid, msg};
        },
        min : function(min){
          let {type, title, element, val, valid, msg} = initial('min');
          if(type.indexOf('number')>-1){
            if(parseInt(val, 10) < parseInt(min,10)){
              valid = false;
              if(!msg) msg = tipMsg.number_min.replace(reg('title'), title).replace(reg('min'), min);
            }
          }else if(element.attr('type')==='checkbox'){
            if(element.filter(':checked').length < min){
              valid = false;
              if(!msg) msg = tipMsg.checked_min.replace(reg('title'), title).replace(reg('min'), min);
            }
          }else{
            if(val.length < min){
              valid = false;
              if(!msg) msg = tipMsg.length_min.replace(reg('title'), title).replace(reg('min'), min);
            }
          }
          return {element, valid, msg};          
        },
        email : function(){
          let {type, title, element, val, valid, msg} = initial('email');
          if( val !== "" && !/^[a-z_0-9-\.]+@([a-z_0-9-]+\.)+[a-z0-9]{2,8}$/i.test(val) ){
            valid = false;
            if(!msg) msg = tipMsg.email.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        ajax : function(options){
          let {title, element, val, valid} = initial();
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
        pattern : function(reg){
          let {element, title, val, valid, msg} = initial('pattern');
          if(!reg.test(val)){
            valid = false;
            if(!msg) msg = tipMsg.pattern.replace(reg('title'), title);
          }
          return {element, valid, msg};
        },
        dy : function(func){
          let {type, title, element, val, valid, msg} = initial();
          return func && func.call(that, element, title) || {element, valid, msg};
        }
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
      let _success = function(result){
        result.element.removeData('validate-msg');
        that._tipsType.highlight(result.element, result.msg, false);
      };
      let _fail = function(result){
        failArr.push(result);
        result.element.data('validate-msg', result.msg);
        that._tipsType.highlight(result.element, result.msg, true);
      };
      let _end = () => callback && callback(failArr);

      let arr = [];
      if(data instanceof jQuery){
        arr.push(that._attributeToJson(data));
      }else if($.isArray(data)){
        arr = data.map( v=> (v instanceof jQuery) ? that._attributeToJson(v) : v );
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
            for(let i=0, len=type.length; i<len; i++){
              let v = type[i].split('=');
              let ruleFunc = that.validateRule[v[0]];
              if(!ruleFunc) break;
              result = ruleFunc(v[1]);
              if(result.valid === false) reject(result);
            }
            if(that._element.ajax){
              result = yield that.validateRule.ajax(that._element.ajax) || {};
              if(result.valid === false) reject(result);
            }
            if(that._element.dy){
              result = that.validateRule.dy(that._element.dy) || {};
              if(result.valid === false) reject(result);
            }
            resolve({element:that._element.name, valid:true});
          });
        });
      }
    }
    refresh(){
      this.options.rule = this.options.rule.map( v => this._jsonFormat(v) );
    }
    _needValidate(element){
      return ( 
        element.attr(`${pluginName.toLowerCase()}-type`) ||
        this.options.rule.some(v => v.name[0] === element[0])
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
          [/^\^?(\d+)$/, 'min=$1'],
          [/^(\d+)\$$/,  'max=$1'],
          [/^(\d+)[-](\d+)$/, (all, $1, $2) => `min=${$1},max=${$2}`],
        ];
        //将 '*,6-10,n' 替换成 ['required', 'min=6, max=10', 'number']
        type = type.map(v=> {
          A.forEach(value => v=v.replace(value[0], value[1]));
          return v;
        });

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
        if(name.length > 1) name.attr('validate-g', +new Date());
        return name.length>0 ? name : false;
      }

      let that = this;
      let obj = arrayToJson(v);
      obj.name = getName();
      obj.type = getType();
      return obj;
    }
    _attributeToJson(ele){
      let prefix = pluginName.toLowerCase();
      let mergeRule = (obj) => {
        let exists;
        this.options.rule = this.options.rule.map((v, i) => {
          if(v.name[0] === obj.name[0]){
            //{
            //  let arr = obj.type.concat(v.type);
            //  v.type = arr.filter((v, i) => {
            //    v = v.split('=')[0];
            //    return !arr.slice(++i).some(val => val.split('=')[0] === v);
            //  });
            //}            
            v = $.extend(obj, v);
            exists = v;
          };
          return v;
        });
        if(exists){
          return exists;
        }else{
          this.options.rule.push(obj);
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
    _ruleSort(){
      let ele = $('input, select, textarea', this.form);
      this.options.rule.sort((a,b) => {
        return ele.index(a.name) - ele.index(b.name);
      });
    }    
    _tipsType(){
      let that = this;
      return {
        AlertTs : {
          init(){

          },
          highlight(element, msg, flag){
            flag = flag ? 'addClass' : 'removeClass';
            element = element.is(':checkbox, :radio') ? element.parent() : element;
            element[flag]('validate-error');
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
          bindEvent(){
            that.form.find('input, textarea, select').off(`.${pluginName}`);
            let self = this;
            //let filterType = 'input:not(:radio,:checkbox,:button,:submit), textarea';
            let filterType = 'input:not(:button,:submit), select, textarea';
            that.form.find(filterType)
              .on(`focus.${pluginName}`, function(){
                var $this = $(this);
                if($this.data('validate-msg')) self.showTips($this, $this.data('validate-msg'));
              })
              .on(`blur.${pluginName}`, function(){
                self.hideTips($(this));
              });
            //change
            that.form.find('input:not(:button,:submit), select, textarea').on(`change.${pluginName}`, function(){
              that.scan($(this));
            });
          },
          validate(){
            that.form.find(`[validate-type]`).each(function(){ that._attributeToJson($(this)) });
            that._ruleSort();
            that.scan(that.options.rule, (failArr) => {
              let result = false;
              if(failArr.length > 0){
                if(that.options.fail) result = that.options.fail.call(that, failArr);
                let element = failArr[0].element;
                element.triggerHandler('focus');
              }else{
                if(that.options.success) result = that.options.success.call(that);
              }
              if(result === true) that.form.trigger('submit', [false]);
            });
          }          
        }
      } //end return
    }
    bindEvent(){
      var that = this;
      this._tipsType.bindEvent();
      this.form.on('submit', (e, valid=true)=> {
        if(valid === true){
          this._tipsType.validate();
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