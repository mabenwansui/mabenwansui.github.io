import '../css/tips.css';
import Base from './base';

let dataMsg = 'valid-error-msg-forplugin';
let className = 'valid-tips';
class Tips extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.lastElement;
    this.bindEvent();
    this.submit();
  }
  build(msg){
    return $(`<div class="${className}">${msg}</div>`);
  }
  show(element, msg){
    element = this.localization(this.getElement(element));
    let tipsName = element.attr('data-tips');
    let tipsElement = $(`.valid-tips[data-tips="${tipsName}"]`);

    tipsElement.html(function(index, v){
      let $this = $(this);
      !$this.data('html') && $this.data('html', v);
      $this.attr('data-tips-status', '1');
      return $this.data('html').replace(/\{msg\}/, msg);
    });

    let group = tipsElement.parents('.valid-tips-group');
    if(group.length > 0) group.show();
    tipsElement.show();
  }
  hide(element){
    if(element){
      element = this.localization(this.getElement(element));
      let tipsName = element.attr('data-tips');
      let tipsElement = $(`.valid-tips[data-tips="${tipsName}"]`);
      tipsElement.hide().html(function(){
        let $this = $(this);
        $this.removeAttr('data-tips-status').html($this.data('html'));
      });
    }else{
      this.form.find('.valid-tips').each(function(){
        let $this = $(this);
        $this.hide().removeAttr('data-tips-status').html($this.data('html'));
      });
    }
  }
  groupTipsShow(){
    $('.valid-tips-group').each(function(){
      let element = $(this).find('.valid-tips[data-tips-status="1"]:first');
      if(element.length>0){
        $(this).show();
        element.show().siblings('.valid-tips').hide();
      }else{
        $(this).hide();
      }
    });
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
      let isForm = validItems.is('form');
      if(isForm) this.highlight(this.form.find('.valid-error').removeAttr(dataMsg), 'hide');
      let fail = items.reduce((a, v)=> {
        let element = this.getElement(v.element);
        if(v.valid===true){
          this.highlight(v.element, 'hide');
          element.removeAttr(dataMsg);
          this.hide(element);
        }else{
          if(element.val()==='' && !element.attr(dataMsg) && !isForm && !v.element.is(':checkbox, :radio')){
          }else{
            element.attr(dataMsg, v.msg);
            this.highlight(element, 'show');
            this.show(element, v.msg);
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
          if (top < (document.documentElement.scrollTop || document.body.scrollTop)) {
            window.scrollTo(0, top - 80);
          }
        }
      };
      if(isForm) this.options.fail.call(this, fail);
      this.groupTipsShow();
      callback.call(this, fail.length>0 ? false : true);
    });
  }
}
export default Tips;