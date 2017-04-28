class Loading{
  constructor(element){
    this.element = element;
    this.show();
  }
  bulid(){
    this.dom = $(`
      <div class="loader">
        <div class="ball-clip-rotate"><div></div></div>
      </div>
    `).appendTo('body');
  }
  resize(){
    let pos = this.element.position();
    this.dom.css({
      position: 'absolute',
      top: pos.top + this.element.outerHeight()/2 - this.dom.outerHeight()/2,
      left: pos.left + this.element.outerWidth() - this.dom.outerWidth() - 3
    });
  }
  show(){
    this.bulid();
    this.resize();
    return this;
  }
  hide(){
    this.dom && this.dom.fadeOut('slow', () => this.dom.remove());
    return this;
  }
}

export default function loading(element){
  return new Loading(...arguments);
}
