import '@liepin/jquery-AlertTs';
let namespace = Date.now();
let dataMsg = 'data-valid-error-msg';
let isRadioCheck = element => {
  let _type = element.attr('type');
  return (_type==='radio' || _type==='checkbox') ? true : false;
}
let getElementTips = element => isRadioCheck(element) ? element.closest('[valid]') : element;

class BindAlertTips{
  constructor(form){
    this.form = form;
    this.lastElementMsg;
    this.bindEvent();
  }
  show(element, msg){
    element = getElementTips(element);
    if(this.lastElementMsg){
      if(this.lastElementMsg[0] === element[0]) return;
      this.hide(this.lastElementMsg);
    }
    if(!msg) msg = element.attr(dataMsg) || '';
    element.AlertTs({
      act: 'hide',
      cssStyle: 'error',
      top: 2,
      left: 15,
      content: msg,
      css: {
        padding: '5px 10px'
      }
    }).AlertTs('show');
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
      if(isRadioCheck($this)){
        $this = $this.closest('[valid]');
      }else{
        if($this.val()==='') return;  
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
  submit(form){
    let that = this;
    form.on('submit', function(){
      $(this).validate('scan', $.noop, function(arr){
        for(let v of arr){
          that.highlight(v.element, 'show');
          v.element.attr(dataMsg, v.msg);
        }
        that.show(getElementTips(arr[0].element), arr[0].msg);
      });
      return false;
    });
  }
}
export default function bindAlertTips(){
  return new BindAlertTips(...arguments);
}