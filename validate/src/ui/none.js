import Base from './base';
class None extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.submit();
  }
  scan(validItems=this.form, callback=$.noop){
    if(typeof validItems === 'function'){
      [validItems, callback] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> {
      items = items.filter(v=> v.valid === false);
      if(items.length>0){
        this.options.fail( items.map(v=> ({element: this.getElement(v.element), msg:v.msg})) );
        callback(false);
      }else{
        callback(true);
      }
    });
  }
}
export default None;