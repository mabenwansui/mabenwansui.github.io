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


#### 更新

  ######0.1.8

    * 增加时分秒不在时间段错误提示

  ######0.1.6
  
  * 时，分，秒可以设置选择刻度

    m_scale: [0,5,10,15,20,25,30,35,40,45,50,55]

  ######0.1.5
  
  * 选择日期回填后触发change

  ######0.1.2

  * 改正当每个月1号是星期天时，星期对不上的问题。

  ######0.1.0

  * 改正使用时、分、秒的时候的一些问题。

  ######0.0.9

  * 增加了淡色的皮肤
  * 增加了inline方法，直接显示日历到某个位置。

详细内容 访问 http://mabenwansui.github.io/

