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
    this.validScan(validItems, items=> callback(true), items=> {
      this.options.fail( items.map(v=> ({element: this.getElement(v.element), msg:v.msg})) );
      callback(false);
    });
  }
}
export default None;