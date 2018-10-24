import {lang} from './config';
import * as unit from './unit';
export default function rule(){
  let that = this;
  let getMsg = tipMsg => (msg, key, obj) => msg || Object.keys(obj).reduce((a, b)=> a.replace(new RegExp('\\$'+b, 'g'), obj[b]), tipMsg[key]);
  getMsg = getMsg(lang());
  return {
    required({element, title='', val, msg}) {
      switch(element.attr('type') || element[0].tagName.toLowerCase()){
        case 'select':
          if(element[0].selectedIndex === 0) return getMsg(msg, 'select_required', {title});
          break;
        case 'checkbox':
        case 'radio':
          if(element.filter(':checked').length === 0) return getMsg(msg, 'select_required', {title});
          break;
        default:
          if(!/^[\w\W]+$/.test(val.trim())){
            if(element.attr('data-ui')==='SelectUI'){
              return getMsg(msg, 'select_required', {title});
            }else{
              return getMsg(msg, 'required', {title});
            }
          }
      }
      return true;
    },
    float({title='', val, msg}){
      return !/^\d+(\.\d+)?$/.test(val) ? getMsg(msg, 'float', {title}) : true;
    },
    number({title='', val, msg}){
      return !/^\d+$/.test(val) ? getMsg(msg, 'number', {title}) : true;
    },
    nmax({title='', val, msg}, max){
      if(parseInt(val, 10) > parseInt(max, 10)){
        return getMsg(msg, 'number_max', {title, max});
      }
      return true;
    },
    nmin({title='', val, msg}, min){
      if(parseInt(val, 10) < parseInt(min,10)){
        return getMsg(msg, 'number_min', {title, min});
      }
      return true;
    },
    max({element, title='', val, msg}, max){
      if(element.is(':checkbox')){
        if(element.filter(':checked').length > max){
          return getMsg(msg, 'checked_max', {title, max});
        }
      }else{
        if(val.length > max){
          return getMsg(msg, 'length_max', {title, max});
        }
      }
      return true;
    },
    min({element, title='', val, msg}, min){
      if(element.is(':checkbox')){
        if(element.filter(':checked').length < min){
          return getMsg(msg, 'checked_min', {title, min});
        }
      }else{
        if(val.length < min){
          return getMsg(msg, 'length_min', {title, min});
        }
      }  
      return true;
    },
    email({title='', val, msg}){
      if(!/^[a-z_0-9-\.]+@([a-z_0-9-]+\.)+[a-z0-9]{2,8}$/i.test(val)){
        return getMsg(msg, 'email', {title});
      }
      return true;
    },
    mobile({title='手机号', val, msg}){
      if(!/^(((\(\d{2,3}\))|(\d{3}\-))?(1[2-9]\d{9}))$|^((001)[2-9]\d{9})$/.test(val)) {
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileHK({title='手机号', val, msg}){
      if(!/^[569]\d{7}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileMO({title='手机号', val, msg}){
      if(!/^6\d{7}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileTW({title='手机号', val, msg}){
      if(!/^9\d{8}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileSG({title='手机号', val, msg}){
      if(!/^[89]\d{7}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileUS({title='手机号', val, msg}){
      if(!/^[2-9]\d{9}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },
    mobileCA({title='手机号', val, msg}){
      if(!/^[2-9]\d{9}$/.test(val)){
        return getMsg(msg, 'mobile', {title});
      }
      return true;
    },      
    phone({title='联系方式', val, msg}){
      if(!/^((\d{11})|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})))$/.test(val)) {
        return getMsg(msg, 'phone', {title});
      }
      return true;
    },
    url({title='', val, msg}){
      if(!/^(http:|https:|ftp:)\/\/(?:[0-9a-zA-Z]+|[0-9a-zA-Z][\w-]+)+\.[\w-]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(val)){
        return getMsg(msg, 'url', {title});
      }
      return true;
    },
    idcard({title='身份证', val, msg}){
      if(!/^\d{17}[xX\d]$|^\d{15}$/.test(val)){
        return getMsg(msg, 'idcard', {title});
      }
      return true;
    },
    repeat({title='', val, msg}, max=5){
      if (new RegExp('(\\S)\\1{'+max+'}', 'g').test(val)) {
        return getMsg(msg, 'repeat', {title});
      }
      return true;
    },
    pattern({title='', val, msg}, reg){
      try{
        if(!eval(reg).test(val)){
          return getMsg(msg, 'pattern', {title});
        }
      }catch(e){
        throw(title+'pattern的正则不正确');
      }
      return true;
    },
    higher({element, forElement, title='', val, msg}){
      if(forElement.hasClass('valid-error')) return true;
      if(parseInt(val.replace(/\D/g, '')) < parseInt(forElement.val().replace(/\D/g, ''))){
        return getMsg(msg, 'higher', {title});
      }else{
        return true;
      }
    },
    checked_required(options){
      let {forElement} = options;
      if(!forElement.is(':checked')) return true;
      return this.rules.required(options);
    },    
    repassword({element, forElement, title='', val, msg}){
      let [v1, v2] = [element.val(), forElement.val()];
      if(v1 === '') return;
      if(v1 === v2){
        return true;
      }else{
        return getMsg(msg, 'repassword', {title});
      }
    },
    some({element, title, type, val, msg}){
      let failArr=[];
      type = unit.jsonFormat(type.replace(/^[a-z]+=(['"])([^'"]+)\1/, '$2'), title);
      for(let v of type){
        let [_type, _val] = v.type.split('=');
        let result = this.rules[_type].call(this, {element, val}, _val);
        failArr.push(result);
      }
      return failArr.some(v=> v===true) || getMsg(msg, 'some', {title});
    },
    not({element, title, type, val, msg}){
      let failArr=[];
      type = unit.jsonFormat(type.replace(/^[a-z]+=(['"])([^'"]+)\1/, '$2'), title);
      for(let v of type){
        let [_type, _val] = v.type.split('=');
        let result = this.rules[_type].call(this, {element, val}, _val);
        failArr.push(result);
      }
      return failArr.some(v=> v===true) ? getMsg(msg, 'not', {title}) : true;
    }
  }
}