import '@liepin/jquery-AlertTs';
let namespace = 'valid';
let dataMsg = 'valid-error-msg-forplugin';
let isRadioCheck = element => {
  let _type = element.attr('type');
  return (_type==='radio' || _type==='checkbox') ? true : false;
}
let getElementTips = element => isRadioCheck(element) ? element.closest('[valid]') : element;
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
    this.lastElementMsg;
    this.bindEvent();
    this.submit();
  }
  show(element, msg){
    element = getElementTips(element);
    if(this.lastElementMsg){
      if(this.lastElementMsg[0] === element[0]) return;
      this.hide(this.lastElementMsg);
    }
    if(!msg) msg = element.attr(dataMsg) || '';
    let addui = (ui => ui ? eval(`(${ui})`) : false )(element.attr('valid-ui'));
    let ui = addui ? $.extend({}, true, this.options.ui, addui) : this.options.ui;
    element.AlertTs({...ui, content: msg}).AlertTs('show');
    this.lastElementMsg = element;
  }
  hide(element=this.lastElementMsg){
    element = element ? getElementTips(element) : false;
    if(element && element.AlertTs){
      element.AlertTs('hide');
      this.lastElementMsg = null;
    }
  }
  highlight(element, type){
    type==='show' ? getElementTips(element).addClass('valid-error') : getElementTips(element).removeClass('valid-error');
  }
  itemSuccessCallback(element){
    this.highlight(element, 'hide');
    this.hide(element);
    element.removeAttr(dataMsg);
  }
  itemFailCallback(arr){
    let [v] = arr;
    v.element.attr(dataMsg, v.msg);
    this.highlight(v.element, 'show');
    this.show(v.element, v.msg);
  }
  bindEvent(){
    let that = this;
    function focus(){
      if(!$(this).hasClass('valid-error')) return;
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
      $this.validate('scan', $this, that.itemSuccessCallback.bind(that), that.itemFailCallback.bind(that));
    }
    function blur(){ that.hide() }

    let validDom = 'input:not(:submit,:button), select, textarea';
    this.form
      .on('focus.'+namespace, validDom, focus)
      .on('change.'+namespace, validDom, change)
      .on('blur.'+namespace, validDom, blur);
  }
  submit(){
    let that = this;
    this.form.on('submit', function(){
      $(this).validate('scan', that.options.success, function(arr){
        for(let v of arr){
          that.highlight(v.element, 'show');
          v.element.attr(dataMsg, v.msg);
        }
        that.show(getElementTips(arr[0].element), arr[0].msg);
        that.options.fail(arr);
      });
      return false;
    });
  }
}
export default function bindAlertTips(){
  return new BindAlertTips(...arguments);
}