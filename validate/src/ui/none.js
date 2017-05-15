import Base from './base';
class None extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.bindEvent();
    this.submit();
  }
  bindEvent(){
    let that = this;
    function change(event){
      let $this = $(this);
      if($this.is(':radio, :checkbox')){
        $this = $this.closest('[valid]');
      }else{
        if($this.val()==='') return;
      }
      that.scan($this);
    }
    this.form
      .on('change.'+this.namespace, 'input:checkbox,input:radio, select', change)
      .on('blur.'+this.namespace, 'input:not(:submit, :button, :radio, :checkbox, select), textarea, select', change);
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