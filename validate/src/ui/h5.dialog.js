import Base from './base';
import '../css/h5dialog.css';

const className = 'valid-h5dialog';

export default class H5Dialog extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.bulidElement;
    this.bindEvent();
    this.submit();
  }
  show({element, msg}){
    if(this.bulidElement) return;
    this.highlight(element, 'show');
    this.bulidElement = $(`<div class="${className}">${msg}</div>`).appendTo('body');
    setTimeout(this.hide.bind(this), 2000);
  }
  hide(){                                                
    this.bulidElement.addClass('valid-h5dialog-hide').on('animationend', function(){
      $(this).remove();
    });
    this.bulidElement = null;
  }
  bindEvent(){
    let that = this;
    this.form.on('input.'+this.namespace, 'input:not(:submit, :button), textarea, select', function(){
      that.highlight($(this), 'hide');
    });
  }
  scan(validItems=this.form, callback=$.noop){
    if(typeof validItems === 'function'){
      [validItems, callback] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> {
      items = items.filter(v=> v.valid===false);
      if(items.length>0){
        this.show(items[0]);
        this.options.fail( items.map(v=> ({element: this.getElement(v.element), msg:v.msg})) );
        callback(false);
      }else{
        callback(true);
      }
    });
  }
}
