import Base from './base';
import '../css/default.css';


/***
  
  未完成，保留

***/

let className = 'valid-default-tips';
class DefaultTips extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.lastElement;
    this.bindEvent();
    this.submit();    
  }
  bulid(msg){
    return $(`<div class="${className}">${msg}</div>`);
  }
  show(element, msg){
    this.hide(element);
    element = this.localization(this.getElement(element));
    return this.bulid(msg).insertAfter(element);
  }
  hide(element){
    if(element){
      element = this.localization(this.getElement(element));
      element.next('.'+className).remove();
    }else{
      this.form.find('.'+className).remove();
    }
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
    let eventStr = 'input:not(:submit, :button), textarea, select';
    this.form
      .on('change.'+this.namespace, eventStr, change)
      .on('blur.'+this.namespace, eventStr, change);
  }
  scan(validItems=this.form, callback=$.noop, notips){
    let that = this;
    if(typeof validItems === 'function'){
      [validItems, callback, notips] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> {
      items.each(function(){
        that.highlight($(this), 'hide');
        that.hide($(this));
      });
      callback(true);
    }, items=> {
      let isForm = validItems.is('form');
      if(isForm){
        let successItems = that.form.find('.valid-error');
        this.highlight(successItems, 'hide');
      }
      items = items.map(v=> {
        let element = this.getElement(v.element);
        this.highlight(element, 'show');
        this.show(element, v.msg);
        return {element, msg:v.msg};
      });
      this.options.fail(items);
      callback(false);
    });
  }
}
export default DefaultTips;