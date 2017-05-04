import '@liepin/jquery-AlertTs';
let namespace = 'valid';
let dataMsg = 'valid-error-msg-forplugin';
let isRadioCheckbox = element => {
  return (element.is(':radio') || element.is(':checkbox')) ? true : false;
}
let getElement = element => isRadioCheckbox(element) ? element.closest('[valid]') : element;
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
  constructor(form, options){
    this.form = form;
    this.options = $.extend(true, {ui:defaultStyle}, options);
    this.timer;
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
    let ui = addui ? $.extend({}, true, this.options.ui, addui) : this.options.ui;
    element.AlertTs({...ui, content: msg}).AlertTs('show');
    this.lastElement = {element, msg};
  }
  hide(element=this.lastElement && this.lastElement.element){
    element = element ? getElement(element) : false;
    if(element && element.AlertTs){
      element.AlertTs('hide');
      this.lastElement = null;
    }
  }
  highlight(element, type){
    type==='show' ? getElement(element).addClass('valid-error') : getElement(element).removeClass('valid-error');
  }
  bindEvent(){
    let that = this;
    function focus(flag){
      if(!$(this).hasClass('valid-error') || flag===true) return;
      that.show($(this));
    }
    function change(event, once=false){
      let $this = $(this);
      if(isRadioCheckbox($this)){
        $this = $this.closest('[valid]');
      }else{
        if($this.val()==='' && !$this.attr(dataMsg)) return;
      }
      //对绑定了for的元素触发相互change
      that.scan($this, function(flag){
        if(this && !once) change.call(this, event, true);
      }.bind($(this).data('valid-for')))
    }
    function blur(){
      let $this = $(this);
      let val = $this.val();
      let dataVal = $this.data('valid-value');
      if($this.is(':radio,:checkbox')){
        that.hide();
        return;
      }
      if(val!=='' && (!dataVal || val!==dataVal)){
        $this.data('valid-value', val);
        change.call(this);
      }
      that.hide();
    }
    this.form
      .on('focus.'+namespace, 'input:not(:submit, :button), select', focus)
      .on('change.'+namespace, 'input:radio, input:checkbox, select', change)
      .on('blur.'+namespace, 'input:not(:submit,:button), textarea', blur)
  }
  scan(validItems=this.form, callback=$.noop){
    let that = this;
    this.form.validate('scan', validItems, items=> {
      items.each(function(){
        let element = getElement($(this));
        that.highlight(element, 'hide');
        that.hide(element);
        element.removeAttr(dataMsg);        
      });
      callback(true);
    }, items=> {
      if(validItems.is('form')){
        let successItems = that.form.find('.valid-error');
        this.highlight(successItems, 'hide');
        successItems.removeAttr(dataMsg);
      }
      items = items.map(v=> {
        let element = getElement(v.element);
        this.highlight(element, 'show');
        element.attr(dataMsg, v.msg);
        element.data('valid-value', element.val());
        return {element, msg:v.msg};
      });
      items[0].element.trigger('focus.'+namespace, [true]);
      this.show(items[0].element, items[0].msg);
      this.options.fail(items);
      callback(false);
    });
  }
  submit(){
    let that = this;
    this.form.on('submit', function(){
      that.scan();
      return false;
    });
  }
}
export default function bindAlertTips(){
  return new BindAlertTips(...arguments);
}