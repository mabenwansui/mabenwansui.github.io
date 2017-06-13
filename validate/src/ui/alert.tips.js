import Base from './base';
import '@liepin/jquery-AlertTs';
let dataMsg = 'valid-error-msg-forplugin';
let defaultStyle = {
  act: 'hide',
  cssStyle: 'error',
  top: 2,
  left: 15,
  css: {
    padding: '5px 10px'
  }
}
class AlertTips extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.options = $.extend(true, {alertTsUI:defaultStyle}, this.options);
    this.lastElement;
    this.bindEvent();
    this.submit();
  }
  show(element, msg){
    element = this.getElement(element);
    if(!msg) msg = element.attr(dataMsg) || '';
    if(this.lastElement){
      if(this.lastElement.element[0]===element[0] && msg===this.lastElement.msg) return;
      this.hide(this.lastElement.element);
    }
    let addui = (ui => ui ? eval(`(${ui})`) : false )(element.attr('valid-ui'));
    addui = addui ? $.extend({}, true, this.options.alertTsUI, addui) : this.options.alertTsUI;
    this.localization(element).AlertTs({...addui, content: msg}).AlertTs('show');
    this.lastElement = {element, msg};
  }
  hide(element){
    element = element || (this.lastElement && this.lastElement.element) || false;
    if(element) element = this.localization(this.getElement(element));
    if(element && element.AlertTs){
      element.AlertTs('hide');
      this.lastElement = null;
    }
  }
  bindEvent(){
    let that = this;
    function focus(flag){
      if(!$(this).hasClass('valid-error') || flag===true) return;
      that.show($(this));
    }
    function change(event, once=false){
      let $this = $(this);
      if($this.is(':radio, :checkbox')){
        $this = $this.closest('[valid]');
      }else{
        if($this.val()==='' && !$this.attr(dataMsg)) return;
      }
      //对绑定了for的元素触发相互change
      that.scan($this, flag => {
        let ele = $(this).data('valid-for');
        if(ele && !once) change.call(ele, event, true);
      });
    }
    function blur(){
      let $this = $(this);
      let val = $this.val();
      let dataVal = $this.data('valid-value');
      if(val!=='' && (!dataVal || val!==dataVal)){
        $this.data('valid-value', val);
        change.call(this);
      }
      that.hide();
    }
    let eventStr = 'input:not(:submit, :button), textarea, select';
    this.form
      .on('focus.'+this.namespace, eventStr, focus)
      .on('change.'+this.namespace, eventStr, change)
      .on('blur.'+this.namespace, eventStr, blur);
  }
  scan(validItems=this.form, callback=$.noop, notips){
    let that = this;
    if(typeof validItems === 'function'){
      [validItems, callback, notips] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> {
      items.each(function(){
        let $this = $(this);
        that.highlight($this, 'hide');
        that.hide();
        that.getElement($this).removeAttr(dataMsg);
      });
      callback(true);
    }, items=> {
      let isForm = validItems.is('form');
      if(isForm){
        let successItems = that.form.find('.valid-error').removeAttr(dataMsg);
        this.highlight(successItems, 'hide');
      }
      items = items.map(v=> {
        let element = this.getElement(v.element);
        element.attr(dataMsg, v.msg);
        element.data('valid-value', element.val());
        this.highlight(element, 'show');
        return {element, msg:v.msg};
      });
      if(notips!==true){
        let [item] = items;
        if(isForm){
          item.element.trigger('focus.'+this.namespace, [true]);
          //应该找到它最近的带滚动条的
          let top = this.localization(item.element).offset().top;
          window.scrollTo(0, top - 80);
        }
        this.show(item.element, item.msg);
      };
      if(isForm) this.options.fail.call(this, items);
      callback(false);
    });
  }
}
export default AlertTips;
