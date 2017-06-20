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
    function change(event, once = false){
      let $this = $(this);
      let notShowTips = $this.is(':radio, :checkbox, :hidden') ? false : true;
      if($this.is(':radio, :checkbox')){
        $this = $this.closest('[valid]');
      }else{
        if($this.val()==='' && !$this.attr(dataMsg)) return;
      }
      that.scan($this, flag => {   //对绑定了for的元素触发相互change
        let ele = $(this).data('valid-for');
        if(ele && !once) change.call(ele, event, true);
      }, notShowTips);
    }
    function blur(event, once = false){
      if(!$(this).is(':radio, :checkbox, select')){
        change.call($(this), event);
      }
      that.hide();
    }
    let eventStr = 'input:not(:submit, :button), textarea, select';
    this.form
      .on('focus.'+this.namespace, eventStr, focus)
      .on('change.'+this.namespace, ':radio, :checkbox, select', change)
      .on('blur.'+this.namespace, eventStr, blur);
  }
  scan(validItems=this.form, callback=$.noop, notips){
    let that = this;
    if(typeof validItems === 'function'){
      [validItems, callback, notips] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> {
      let isForm = validItems.is('form');
      if(isForm) this.highlight(this.form.find('.valid-error').removeAttr(dataMsg), 'hide');
      let fail = items.reduce((a, v)=> {
        let element = this.getElement(v.element);
        if(v.valid===true){
          this.highlight(v.element, 'hide');
          element.removeAttr(dataMsg);          
          this.hide();
        }else{
          if(element.val()==='' && !element.attr(dataMsg) && !isForm && !v.element.is(':checkbox, :radio')){
          }else{
            element.attr(dataMsg, v.msg);
            this.highlight(element, 'show');
          }
          a.push({element, msg:v.msg});
        }
        return a;
      }, []);
      if(notips!==true && fail.length>0){
        let [item] = fail;
        if(isForm){
          item.element.trigger('focus.'+this.namespace, [true]);
          let top = this.localization(item.element).offset().top;
          window.scrollTo(0, top - 80);
        }
        this.show(item.element, item.msg);
      };
      if(isForm) this.options.fail.call(this, fail);
      callback.call(this, fail.length>0 ? false : true);
    });
  }
}
export default AlertTips;
