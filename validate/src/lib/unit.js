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


function aliasFunc(obj){
  let arr = Object.keys(obj).reduce((a, b)=> (a.push([new RegExp(`^(\\${b})\\(([^\\)]+)\\)$`), obj[b]]), a), []);
  //arr.push([/^([a-z]?)\^?(\d+)$/, '$1min=$2'])
  //arr.push([/^([a-z]?)(\d+)[-](\d+)$/, (all, $1, $2, $3) => `${$1}min=${$2},${$1}max=${$3}`])
  return arr;
}
var alias = {
  '*': 'required',
  'e': 'email',
  'n': 'number',
  'f': 'float',
}

function formatItem(type){
  let [t1, t2] = type.split('-');
  let reTypeRange = (type, range) => {
    let msg = '', flag = false;
    type = type.replace(/^([n]?)(\d+)(\((.+)\))?$/, (all, $1, $2, $3, $4)=> {
      flag = true;
      if($4) msg = $4;
      return $1+range+'='+$2;
    });
    return flag ? {type, msg} : false;
  }
  let reType = (type) => {
    let msg = '';
    type = type.replace(/^([^()]+)(\((.+)\))?$/, (all, $1, $2, $3)=> {
      if($3) msg = $3;
      return alias[$1] || $1;
    });
    return {type, msg};
  }
  if(t2){
    return [reTypeRange(t1, 'min'), reTypeRange(t2, 'max')];
  }else{
    return [reTypeRange(type, 'min') || reType(type)];
  }
}
let maben;
maben = formatItem('1-7(大$)');
//console.log(maben);
//maben = formatItem('1(最大值)-6(最小值)');
console.dir(maben);

//function formatType(type){
//  return type.map(v=> {
//    let msg='';
//    let type = v.replace(/^([^()]+)(\((.+)\))?$/, (all, $1, $2, $3) => {
//      $1 = $1.replace(/^([a-z]?)(\d+)[-](\d+)$/, (all, $1, $2, $3) => `${$1}min=${$2},${$1}max=${$3}`)
//
//      if($3){
//        msg = $3;
//        return alias[$1] || $1;
//      }else{
//        return all;
//      }
//    })
//    return {type, msg}
//  })
//}


export function jsonFormat(data){
  let {type} = data;
  if(!type) return [];
  if(typeof type === 'string') type = type.split(/\s*,\s*/);

  console.log(formatType(['required(请填写$)', 'min=6, max=10']));

  //将*, 6-10替换成 ['required', 'min=6, max=10'] 并转换成 ['required', 'min=6', 'max=10']
  //type = type.map(v=> A.reduce((a, b)=> a.replace(b[0], b[1]), v))
  //type = type.map(v=> alias.reduce((a, b)=> {
  //  a.replace(b[0], (all, $1, $2)=> {
  //    //console.log($1);
  //    //console.log($2);
  //    return $1;
  //  })
  //}), v))
  //.reduce((a, b)=> ([].push.apply(a, b.split(/\s*,\s*/)), a), []);
  //console.log(type);
  //return {...data, element: data.element, type};
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
  let msg = type => element.attr(`${prefix}-${type}-msg`);
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
