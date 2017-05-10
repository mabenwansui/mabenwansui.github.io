import './css/index.css';
import rules from './lib/rules';
import loading from './lib/loading';
import * as unit from './lib/unit';
import bindAlertTips from './lib/bind.alert.tips';

'use strict';
const [pluginName, className] = ['validate', 'validate'];
var defaults = {
  rules   : {},
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
    this.tips = bindAlertTips(this);
    this.init();
  }
  init(){
    this.form.find('[valid]').toArray().forEach(v=> unit.attrToJson(v, this.form));
  }
  async scan(items=this.form, successCallback=$.noop, failCallback=$.noop){
    if(typeof items === 'function'){
      [items, successCallback, failCallback] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    if(items.is('form')) items = items.find('[valid]');
    let failArr = [];
    let arr = items.filter(':not([ignore],[disabled])').toArray().map(v=> unit.attrToJson(v, this.form));
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
      let obj = {...item, type, val: element.val()};
      let result = (!/required/.test(_type) && !/^[\w\W]+$/.test(obj.val)) ? true : 
        this.rules[_type].call(
          this,
          msg ? {...obj, msg} : obj,
          val
        );
      if(result instanceof Promise){
        let _loading = loading(element);
        result.then(()=>{
          resolve();
          _loading.hide();
        }).catch(msg=> {
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
        let options = arg[0];
        if(typeof options === 'function') options = {success: options};
        $(this).data('plugin_' + pluginName, new Validate($(this), options));
      }
    });
  };
};
