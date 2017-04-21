import {alias} from './config';
export function getJQelement(element, form='form'){
  if(!element) return;
  if(typeof element === 'string'){
    element = /^[.#]/.test(element) ? $(element, form) : $(`[name='${element}']`, form);
  }else if(element instanceof jQuery){
    element = element;
  }else{
    element = $(element, form);
  }
  return element.length>0 ? element : false;
}

function formatItem(type, title){
  let [t1, t2] = type.split('-');
  let reTypeRange = (type, range) => {
    let msg = '', flag = false;
    type = type.replace(/^([n]?)(\d+)(\((.+)\))?$/, (all, $1, $2, $3, $4)=> {
      flag = true;
      if($4) msg = $4.replace(/\$/g, title);
      return $1+range+'='+$2;
    });
    return flag ? {type, msg} : false;
  }
  let reType = (type) => {
    let msg = '';
    type = type.replace(/^([^()]+)(\((.+)\))?$/, (all, $1, $2, $3)=> {
      if($3) msg = $3.replace(/\$/g, title);
      return alias[$1] || $1;
    });
    return {type, msg};
  }
  return t2 ?
    [reTypeRange(t1, 'min'), reTypeRange(t2, 'max')] :
    [reTypeRange(type, 'min') || reType(type)];
}

export function jsonFormat(data){
  let {type, title} = data;
  if(!type) return [];
  if(typeof type === 'string') type = type.split(/\s*,\s*/);
  type = type.reduce((a, b)=> {
    return [].push.apply(a, formatItem(b, title)), a;
  }, []);
  return {...data, element: data.element, type};
}

/*
  valid="用户名|*, maben, s10-15"
  valid-required-msg=""
  valid-error-msg=""
*/
export function attrToJson(element, form, rules){
  element = $(element);
  let prefix = 'valid';
  let attr = element.attr(prefix).split('|');
  let [title, type] = attr.length>1 ? attr : ['', attr[0]];
  let msg = type => element.attr(`${prefix}-${type}`);
  let obj = {
    title,
    type,
    forElement: (_type=> getJQelement(_type.indexOf('for')>-1 ? _type.replace(/^.*for=([^,]+).*$/, '$1') : '', form))(type),
    msg: msg('required') || msg('error') || false
  };

  if(obj.forElement){
    obj.forElement.data('valid-for', element);
  }

  if(/input|select|textarea/i.test(element[0].tagName)){
    return jsonFormat({...obj, element})
  }else{
    return jsonFormat({
      ...obj,
      element: (()=> {
        let [ele1, ele2] = [element.find(':checkbox'), element.find(':radio')];
        return ele1.length > ele2.length ? ele1 : ele2;
      })()
    })
  }
}

/*
  将options里的自定义规则放到rules里面
*/
export function rulesMerge(options, defaultOptions, callback){
  Object.keys(options).forEach(v=> {
    if(!(v in defaultOptions) && typeof options[v]==='function') callback(v, options[v]);
  })
}
