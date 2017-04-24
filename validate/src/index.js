import './css/index';
import rules from './lib/rules';
import loading from './lib/loading';
import * as unit from './lib/unit';
import bindAlertTips from './lib/bind.alert.tips';

'use strict';
const [pluginName, className] = ['validate', 'validate'];
var defaults = {
  rules   : {},
  debug   : false,  //回调不执行
  fail    : ()=>{},
  success : ()=>{},
  lang    : 'cn'
}
class Validate{
  constructor(element, options={}){
    this.element = element;
    this.form = element.is('form') ? element : element.closest('form');
    this.options = {...defaults, ...options};
    unit.rulesMerge(options, defaults, (key, val)=> (this.options.rules[key]=val));
    this.rules = {...rules.apply(this), ...this.options.rules}
    this.alertTips = bindAlertTips(this.form, this.options);
  }
  async scan(items=this.form, successCallback=$.noop, failCallback=$.noop){
    if(typeof items === 'function'){
      failCallback = successCallback;
      successCallback = items;
      items = this.form;
    }
    if(items.is('form')) items = items.find('[valid]');
    let failArr = [];
    let arr = items.filter(':not([ignore])').toArray().map(v=> unit.attrToJson(v, this.form));
    for(let v of arr) await (item=> {
      return new Promise(async (resolve, reject)=> {
        let error;
        for(let validType of item.type){
          await this.validItem(validType, item).catch(e=> reject(error=e));
          if(error) break;
        }
        resolve();
      })
    })(v).catch(e=> failArr.push(e));
    failArr.length===0 ? successCallback.call(this, items) : failCallback.call(this, failArr);
  }
  validItem(validType, item){
    return new Promise((resolve, reject)=> {
      let {element} = item;
      let {type, msg} = validType;
      let [_type, val] = type.split('=');
      if(!this.rules[_type]) resolve();
      let result = this.rules[_type].call(
        this, 
        msg ? {...item, val: element.val(), msg} : {...item, val: element.val()}, 
        val
      );
      if(result instanceof Promise){
        let _loading = loading(element);
        result.then(resolve).catch(msg=> {
          reject({msg, valid: false, element});
          _loading.hide();
        });
      }else{
        result===true ? resolve() : reject({valid: false, msg: result, element});
      }
    });
  }
}

$.fn[pluginName] = function (...arg) {
  if (typeof arg[0] === 'string') {
    let method = arg[0];
    let $this = $(this).is('form') ? $(this) : $(this).closest('form');
    let plugin = $this.data('plugin_' + pluginName);
    switch (method) {
      case "getClass":
        return plugin;
      default:
        return $this.each(function(){
          if(plugin && plugin[method]) plugin[method].apply(plugin, arg.splice(1));
        });
    };
  } else {
    return this.each(function(){
      let plugin = $(this).data('plugin_' + pluginName);
      if(plugin){
        return;
      }else{
        $(this).data('plugin_' + pluginName, new Validate($(this), arg[0]));
      }
    });
  };
};


/*
  api
  $('form').validate({
    maben(){
      
    }
  }).done(data => {
    
  })
*/