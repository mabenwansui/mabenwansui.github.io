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
  if(/^for=|^[a-z]+\s*=\s*(['"])[^'"]+\1$/.test(type)) return [{type, msg:''}];
  let [t1, t2] = (type=> {
    type = type.match(/^([^()]*?(?:\(.*?\))?)-([^()]*?(?:\(.*?\))?)$/) || [];
    return type.slice(1);
  })(type);
  let prefix = t2 ? type.replace(/^(\D*).*/, '$1') : '';   //取出类似于n这样的字母
  let reTypeRange = (type, range, prefix) => {
    let msg = '', flag = false;
    type = type.replace(/^([n]?)(\d+)(\((.+)\))?$/, (all, $1, $2, $3, $4)=> {
      flag = true;
      if($4) msg = $4.replace(/\$/g, title);
      return prefix+range+'='+$2;
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
    [reTypeRange(t1, 'min', prefix), reTypeRange(t2, 'max', prefix)] :
    [reTypeRange(type, 'min', prefix) || reType(type)];
}

export function jsonFormat(type, title){
  if(!type) return [];
  if(typeof type === 'string') type = type.match(/([^,\s]+=([/'"])[^/'"]+\2(\([^)]*\))?)|([^,\s]+\([^)]*\))|([^,\s]+)/g) || [];
  type = type.reduce((a, b)=> {
    return [].push.apply(a, formatItem(b, title)), a;
  }, []);
  return type;
}
/*
  valid="用户名|*, maben, s10-15"
  valid-required-msg=""
  valid-error-msg=""
*/

//对有for的进行 两个元素相互绑定对象
export function forElement(element, type, form){
  let forEle = getJQelement(type.indexOf('for=')>-1 ? type.replace(/^.*for=([^,]+).*$/, '$1') : '', form);
  if(forEle) {
    let mergeDataValidFor = (element, forElement) => {
      let ele = element.data('valid-for');
      ele = ele ? ele.add(forElement) : forElement;
      element.data('valid-for', ele);
    }
    mergeDataValidFor(forEle, element);
    mergeDataValidFor(element, forEle);
  }
  return forEle;
}

export function attrToJson(element, form){
  element = $(element);
  let prefix = 'valid';
  let attr = element.attr(prefix).split(/\s*\|\s*/);
  let [title, type] = attr.length>1 ? attr : ['', attr[0]];
  let msg = type => {
    type = element.attr(`${prefix}-${type}`);
    return type ? type.replace('$', title) : false;
  }
  let obj = {
    title,
    forElement: forElement(element, type, form),
    msg: msg('error') || false
  };

  if(/input|select|textarea/i.test(element[0].tagName)){
    return {...obj, type: jsonFormat(type, title), element};
  }else{
    return {
      ...obj,
      type: jsonFormat(type, title),
      element: (()=> [element.find(':checkbox'), element.find(':radio')].reduce((a, b)=> a.length > b.length ? a : b))()
    };
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

export function arrMerge(a1, a2){
  a2.forEach((v2, index2)=> {
    if(!a1.some((v1, index1)=> {
      if(v1.element[0] === v2.element[0]){
        a1[index1] = v2;
        return true;
      } 
    })){ a1.push(v2) }
  })
  return a1;
}

export function getScrollElement(element){
  element = element.parents().filter(function(){
    let val = $(this).css('overflow');
    return (val==='auto' || val==='scroll') ? true : false;
  });
  return element.length>0 ? element : $('html, body');
}