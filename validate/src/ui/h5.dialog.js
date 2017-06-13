import Base from './base';
import '../css/h5dialog.css';

const className = 'valid-h5dialog';

export default class H5Dialog extends Base{
  constructor(element, options={}){
    super(...arguments);
    this.submit();
    this.bulidElement;
  }
  show(msg){
    if(this.bulidElement) return;
    this.bulidElement = $(`<div class="${className}">${msg}</div>`).appendTo('body');
    setTimeout(this.hide.bind(this), 2000);
  }
  hide(){                                                
    this.bulidElement.addClass('valid-h5dialog-hide').on('animationend', function(){
      $(this).remove();
    });
    this.bulidElement = null;
  }
  scan(validItems=this.form, callback=$.noop){
    if(typeof validItems === 'function'){
      [validItems, callback] = [...arguments].reduce((a, b)=> (a.push(b), a), [this.form])
    }
    this.validScan(validItems, items=> callback(true), items=> {
      this.show(items[0].msg);
      this.options.fail( items.map(v=> ({element: this.getElement(v.element), msg:v.msg})) );
      callback(false);
    });
  }
}
