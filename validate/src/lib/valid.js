import rules from './rules';
import loading from './loading';
import * as unit from './unit';

'use strict';
let defaults = {
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
    this.init();
  }
  init(){
    this.form.find('[valid]').toArray().forEach(v=> unit.attrToJson(v, this.form));
  }
  async validScan(items=this.form, successCallback=$.noop, failCallback=$.noop){
    if(typeof items === 'function'){
      [items, successCallback, failCallback] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }

    if(items.is('form')){
      items = items.find('[valid]');
    }else{
      items = items.filter('[valid]');
    }

    let failArr = [];
    let arr = items.filter(':not([ignore],[disabled])').toArray().map(v=> unit.attrToJson(v, this.form));
    for(let v of arr) await (item=> new Promise(async (resolve, reject)=> {
      let error;
      for(let validType of item.type){
        await this.validItem(validType, item).catch(e=> reject(error=e));
        if(error) break;
      }
      resolve();
    }))(v).catch(e=> failArr.push(e));
    failArr.length===0 ? successCallback.call(this, items) : failCallback.call(this, failArr);
  }
  validItem(validType, item){
    let filterCondition = (_type, val) => {
      if(this.options.rules[_type]){
        return false;
      }else if(!/required/.test(_type) && !/^[\w\W]+$/.test(val)){
        return true;
      }else{
        return false;
      }
    }
    return new Promise((resolve, reject)=> {
      let {element} = item;
      let {type, msg} = validType;
      let [_type, val] = type.split('=');
      if(!this.rules[_type]) resolve();
      let obj = {...item, type, val: element.val()};
      let result = filterCondition(_type, obj.val) ? true :
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
export default Validate;
