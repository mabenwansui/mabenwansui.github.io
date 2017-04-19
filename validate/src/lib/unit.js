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

//将从dom上，或者js里获取的验证规则转换为对象
export function jsonFormat(data){
  let getType = (type) => {
    if(!type) return [];
    if(typeof type === 'string') type = type.split(/\s*,\s*/);
    let A = [
      [/^\*$/, 'required'],
      [/^e$/, 'email'],
      [/^n$/, 'number'],
      [/^f$/, 'float'],
      [/^([a-z]?)\^?(\d+)$/, '$1min=$2'],
      [/^([a-z]?)(\d+)\$$/g, '$1max=$2'],
      [/^([a-z]?)(\d+)[-](\d+)$/, (all, $1, $2, $3) => `${$1}min=${$2},${$1}max=${$3}`],
    ];
    //将 '*, s6-10' 替换成 ['required', 'smin=6, smax=10']
    type = type.map((v, i)=> A.reduce((a, b)=> a.replace(b[0], b[1]), v));
    //平铺数组 ['required', 'min=6, max=10', 'number'] 转换成 ['required', 'min=6', 'max=10', 'number']
    type.forEach((v, i)=> [].splice.apply(type, [i,1].concat(v.split(/\s*,\s*/))));
    return type; 
  }
  return {...data, element: getJQelement(data.element), type: getType(data.type)};
}

/*
  valid="用户名|*, maben, s10-15"
  valid-required-msg=""
  valid-error-msg=""
*/
export function attrToJson(element){
  element = $(element);
  let prefix = 'valid';
  let attr = element.attr(prefix).split('|');
  let [title, type] = attr.length>1 ? attr : ['', attr[0]];
  let msg = type => element.attr(`${prefix}-${type}-msg`);
  let obj = {
    title,
    type,
    forElement: (_type=> getJQelement(_type.indexOf('for')>-1 ? _type.replace(/^.*for=([^,]+).*$/, '$1') : ''))(type),
    required: msg('required'),
    error: msg('error')
  };

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
