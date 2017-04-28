import rules from './rules';
import loading from './loading';
import * as unit from './unit';
import bindAlertTips from './bind.alert.tips';

'use strict';
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
    this.tips = bindAlertTips(this.form, this.options);
  }
  async scan(items=this.form, successCallback=$.noop, failCallback=$.noop){
    if(typeof items === 'function'){
      failCallback = successCallback;
      successCallback = items;
      items = this.form;
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
      let result = (_type!=='required' && _type!=='isrequired' && !/^[\w\W]+$/.test(obj.val)) ? true : 
        this.rules[_type].call(
          this, 
          msg ? {...obj, msg} : obj,
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
export default Validate;