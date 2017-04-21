import lang from './lang';
export default function rule(){
  let that = this;
  let empty = val => !/^[\w\W]+$/.test(val);
  let getMsg = (tipMsg) => (msg, key, obj) => msg || Object.keys(obj).reduce((a, b)=> a.replace(new RegExp('\\$'+b, 'g'), obj[b]), tipMsg[key]);
  getMsg = getMsg(lang());
  return {
    required({element, forElement, title, type, val, msg}) {
      switch(element.attr('type') || element[0].tagName.toLowerCase()){
        case 'select':
          if(element[0].selectedIndex === 0) return getMsg(msg, 'select_required', {title});
          break;
        case 'checkbox':
        case 'radio':
          if(element.filter(':checked').length === 0) return getMsg(msg, 'select_required', {title});
          break;
        default:
          if(empty(val)) return getMsg(msg, 'required', {title});
      }
      return true;
    },
    number({element, title, val, msg}){
      if( !empty(val) && !/^\d+(\.\d+)?$/.test(val) ){
        return getMsg(msg, 'number', {title});
      }
      return true;
    },
    integer({element, title, val, msg}){
      if( !empty(val) && !/^\d+$/.test(val) ){
        return getMsg(msg, 'integer', {title});
      }
      return true;
    },
    nmax({element, title, val, msg}, max){
      if(parseInt(val, 10) > parseInt(max, 10)){
        return getMsg(msg, 'number_max', {title, max});
      }
      return true;
    },
    nmin({element, title, val, msg}, min){
      if(parseInt(val, 10) < parseInt(min,10)){
        return getMsg(msg, 'number_min', {title, min});
      }
      return true;
    },
    max({element, title, val, msg}, max){
      if(element.attr('type')==='checkbox'){
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
    min({element, title, val, msg}, min){
      if(element.attr('type')==='checkbox'){
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
    email({element, title, val, msg}){
      if( val !== "" && !/^[a-z_0-9-\.]+@([a-z_0-9-]+\.)+[a-z0-9]{2,8}$/i.test(val) ){
        return getMsg(msg, 'email', {title});
      }
      return true;
    },
    pattern({element, title, val, msg}, reg){
      if(!reg.test(val)){
        return getMsg(msg, 'pattern', {title});
      }
      return true;
    },
    ismax({element, forElement, title, val, msg}){
      if(element.val() < forElement.val()){
        return getMsg(msg, 'ismax', {title});
      }else{
        return true;
      }
    },
    repassword({element, forElement, title, val, msg}){
      let [v1, v2] = [element.val(), forElement.val()];
      if(v1 === '') return;
      if(v1 === v2){
        return true;
      }else{
        return getMsg(msg, 'repassword', {title});
      }
    }
  }
}