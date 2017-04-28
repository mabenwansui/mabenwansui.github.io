import '@liepin/jquery-AlertTs';
let namespace = 'valid';
let dataMsg = 'valid-error-msg-forplugin';
let isRadioCheck = element => {
  return (element.is(':radio') || element.is(':checkbox')) ? true : false;
}
let getElement = element => isRadioCheck(element) ? element.closest('[valid]') : element;
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
  itemSuccessCallback(element){
    this.highlight(element, 'hide');
    this.hide(element);
    element.removeAttr(dataMsg);
  }
  itemFailCallback(arr){
    let [v] = arr;
    getElement(v.element).attr(dataMsg, v.msg);
    v.element.trigger('focus.'+namespace, [true]);
    this.highlight(v.element, 'show');
    this.show(v.element, v.msg);
  }
  bindEvent(){
    let that = this;
    function focus(flag){
      if(!$(this).hasClass('valid-error') || flag===true) return;
      that.show($(this));
    }
    function change(){
      let $this = $(this);
      let validFor = element => {
        element = element.data('valid-for');
        if(element) setTimeout(()=> element.trigger('change.'+namespace), 0);    
      }
      if(isRadioCheck($this)){
        $this = $this.closest('[valid]');
        validFor($this);
      }else{
        validFor($this);
        if($this.val()==='' && !$this.attr(dataMsg)) return;  
      }
      that.form.validate('scan', $this, that.itemSuccessCallback.bind(that), that.itemFailCallback.bind(that));
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
  submit(){
    let that = this;
    this.form.on('submit', function(){
      $(this).validate('scan', that.options.success, function(arr){
        for(let v of arr){
          that.highlight(v.element, 'show');
          v.element.attr(dataMsg, v.msg);
          v.element.data('valid-value', v.element.val());
        }
        that.show(getElement(arr[0].element), arr[0].msg);
        that.options.fail(arr);
      });
      return false;
    });
  }
}
export default function bindAlertTips(){
  return new BindAlertTips(...arguments);
}