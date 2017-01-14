## 基本信息

* 功能说明：气泡控件
* 语法：``$(object).AlertTs(options)``


## 使用说明
    import '@liepin/jquery-AlertTs';   //模板用require

    $('element').AlertTs({
      act: 'click',
      content: '猎聘欢迎你'
    });


详细内容 访问 http://mabenwansui.github.io/


## 更新说明
 0.2.1
 通过$.AlertTs.parent('.btn').hide();可以关闭.btn所在的气泡弹层。

 0.1.7
 提前了beforeshow回调的触发位置，用来解决展开-收起的问题

    $('.more').AlertTs({
      act: 'click',
      beforeshow(){
        if(this.element.text().trim() === '收起'){
          this.hide();
          return false;
        }
      },
      show(){
        this.refresh({
          content: "..."
        }).element.text('收起');
      },
      hide(){ this.element.text('更多'); }    
    });

 0.1.4
 之前当重复调用插件时，并且act设为一个不存在的事件时，只触发一次alertTs，是因为不会重复绑定插件。
 现修改为重复调用时，弹框也能正常显示；

 0.1.2
 * 解决了通过proxy方法绑事件，在相同父元素下，插件不能绑定的问题
 * 解决了通过proxy方法绑事件，hover时，鼠标离开弹框表现不正确的问题
 * 感谢张佐提供的bug反馈，问题描述的很详细。

详细内容 访问 http://mabenwansui.github.io/
