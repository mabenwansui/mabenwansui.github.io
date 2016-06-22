## 基本信息

* 功能说明：日期控件
* 语法：``$(object).DatePicker(options)``

## 使用说明
    import '@liepin/jquery-DatePicker';   //模板用require

    $('element').DatePicker({
      startdate: '2015-03-02',
      enddate: '2016-11-10',
      callback : function(){
        console.log(this, arguments);
      }
    });


详细内容 访问 http://mabenwansui.github.io/

