import Validate from '../lib/valid';
class Base extends Validate{
  constructor(element, options={}){
    super(...arguments);
    this.namespace = 'valid';
  }
  getElement(element){
    return element.is(':radio, :checkbox') ? element.closest('[valid]') : element;
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
    }else if(element.is(':hidden')){
      element = element.closest(':not(:hidden)');
    }
    return element;
  }
  highlight(element, type){
    element = this.localization(this.getElement(element));
    type==='show' ? element.addClass('valid-error') : element.removeClass('valid-error');
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
export default Base;
