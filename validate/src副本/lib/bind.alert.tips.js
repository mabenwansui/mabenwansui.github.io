import '@liepin/jquery-AlertTs';
let namespace = 'valid';
let dataMsg = 'valid-error-msg-forplugin';
let getElement = element => element.is(':radio, :checkbox') ? element.closest('[valid]') : element;
let defaultStyle = {
  act: 'hide',
  cssStyle: 'error',
  top: 2,
  left: 15,
  css: {
    padding: '5px 10px'
  }
}
class BindAlertTips{
  constructor(valid){
    this.valid = valid;
    this.form = valid.form;
    this.options = $.extend({}, true, {ui:defaultStyle}, valid.options);
    this.lastElement;
    this.bindEvent();
    this.submit();
  }
  show(element, msg){
    element = getElement(element);
    if(!msg) msg = element.attr(dataMsg) || '';
    if(this.lastElement){
      if(this.lastElement.element[0]===element[0] && msg===this.lastElement.msg) return;
      this.hide(this.lastElement.element);
    }
    let addui = (ui => ui ? eval(`(${ui})`) : false )(element.attr('valid-ui'));
    addui = addui ? $.extend({}, true, this.options.ui, addui) : this.options.ui;
    this.localization(element).AlertTs({...addui, content: msg}).AlertTs('show');
    this.lastElement = {element, msg};
  }
  hide(element){
    element = element || (this.lastElement && this.lastElement.element) || false;
    if(element) element = this.localization(getElement(element));
    if(element && element.AlertTs){
      element.AlertTs('hide');
      this.lastElement = null;
    }
  }
  localization(element){
    let ui = element.attr('data-ui');
    if(ui){
      switch(ui.toLowerCase()){
        case 'selectui':
          element = element.parent();
          break;
        default:
          element = element.parent().find(`.${ui}`);          
      }
    }
    return element;
  }
  highlight(element, type){
    element = this.localization(getElement(element));
    type==='show' ? element.addClass('valid-error') : element.removeClass('valid-error');
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
      .on('focus.'+namespace, eventStr, focus)
      .on('change.'+namespace, eventStr, change)
      .on('blur.'+namespace, eventStr, blur);
  }
  scan(validItems=this.form, callback=$.noop, notips){
    let that = this;
    if(typeof validItems === 'function'){
      [validItems, callback, notips] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.valid.scan(validItems, items=> {
      items.each(function(){
        let $this = $(this);
        that.highlight($this, 'hide');
        that.hide();
        getElement($this).removeAttr(dataMsg);
      });
      callback(true);
    }, items=> {
      let isForm = validItems.is('form');
      if(isForm){
        let successItems = that.form.find('.valid-error').removeAttr(dataMsg);;
        this.highlight(successItems, 'hide');
      }
      items = items.map(v=> {
        let element = getElement(v.element).attr(dataMsg, v.msg);
        element.data('valid-value', element.val());
        this.highlight(element, 'show');
        return {element, msg:v.msg};
      });
      if(notips!==true){
        let [item] = items;
        isForm && item.element.trigger('focus.'+namespace, [true]);
        this.show(item.element, item.msg);
      };
      this.options.fail(items);
      callback(false);
    });
  }
  submit(){
    let that = this;
    this.form.on('submit', function(event, valid=false){
      if(valid===false){
        that.scan(flag=> {
          if(flag && that.options.success()===true) that.form.trigger('submit', [true]);
        });
        return false;
      }else{
        return true;
      }
    });
  }
}
export default function bindAlertTips(){
  return new BindAlertTips(...arguments);
}