//import './css/style.css';

(function($, window, undefined) {
  'use strict';
  let pluginName = 'DatePicker';
  let className = 'date-picker';
  let defaults = {
    left      : 0,
    top       : 0,
    readonly  : true,
    errortext : 'auto',
    btnbar    : false,
    startdate : null,
    enddate   : null,
    minyear   : 1975,
    maxyear   : 2025,
    zindex    : 'auto',
    cssStyle  : null,
    callback  : $.noop
  }
  class DatePicker{
    constructor(element, options){
      this.element = element;
      this.options = $.extend(true, {}, defaults, options);
      this.helper = null;
      this.year = null;
      this.month = null;
      this.day = null;
      this.icon = null;
      this._visible = false;
      this._id = ++$[pluginName].id;
      this._errorTimer = null;
      this._startdate = null;
      this._enddate = null;
      this._initialAttr();
      this.createUi();
      this.refresh();
      this.bindEvent();
    }
    createUi(){
      let html = `
        <div class="${className}-ui">
          <div class="title">
            <div class="prev"><i></i></div>
            <div class="year">
              <h2></h2><i class="arrow"></i>
              <ul class="drop-down"></ul>                
            </div>
            <div class="month">
              <h2></h2><i class="arrow"></i>
              <ul class="drop-down"></ul>              
            </div>
            <div class="next"><i></i></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th class="weekend">六</th>
                <th class="weekend">日</th>
              </tr>
            </thead>
            <tbody></tbody>           
          </table>
          <div class='buttons-bar'>
            <a href="javascript:;" class="today">返回今天</a>
            <a href="javascript:;" class="clear">清空</a>
          </div>           
        </div>`;
      this.helper = $(html).appendTo('body');
      if(this.options.btnbar) this.helper.find('.buttons-bar').show();
      this.element.parent().css('position', 'relative');
      this.icon = $(`<i class="${className}-icon"></i>`).insertAfter(this.element.css('cursor', 'pointer'));
    }
    refreshSelectYear(){
      let $year = this.helper.find('.year').removeClass('select');
      let html = '';
      for(let i=this.options.minyear; i<=this.options.maxyear; i++){
        if( (this._startdate && i<this._startdate.year) ||
            (this._enddate && i>this._enddate.year)
         ){
          html += `<li class="disabled">${i}</li>`;
        }else if(i === this.year){
          html += '<li class="cur">'+i+'</li>';
        }else{
          html += '<li>'+i+'</li>';
        }
      }
      $year.find('ul').html(html);
      if( $year.find('ul li:not(.disabled)').length > 1 ) $year.addClass('select');
    }
    refreshSelectMonth(){
      let $month = this.helper.find('.month').removeClass('select');
      let start = this._startdate;
      let end = this._enddate;
      let html = '';
      for(let i=1; i<=12; i++){
        let curDate = this.year + this._pad(i);
        if( (start && curDate < start.year+this._pad(start.month)) ||
            (end && curDate > end.year+this._pad(end.month))
        ){
          html += `<li class="disabled">${i}</li>`;
        }else{
          html += '<li>'+i+'</li>';
        }
      }
      $month.find('ul').html(html);
      if( $month.find('ul li:not(.disabled)').length >= 3 ) $month.addClass('select');
      if(start && this.year + this._pad(this.month) <= start.year + this._pad(start.month) )
        this.helper.find('.prev').addClass('e-disabled');
      else
        this.helper.find('.prev').removeClass('e-disabled');

      if(end && this.year + this._pad(this.month) >= end.year + this._pad(end.month) )
        this.helper.find('.next').addClass('e-disabled');
      else
        this.helper.find('.next').removeClass('e-disabled');      
    }
    refreshDate(){
      let that = this; 
      let html = '<tr>';
      let ul = this.helper.find('tbody');
      let j = 0;
      {
        if(!this.year || this.month){
          let d = new Date();
          if(!this.year) this.year = d.getFullYear();
          if(!this.month) this.month = d.getMonth()+1;
        }
        this.helper.find('.year h2').html(this.year + '年');
        this.helper.find('.month h2').html(this.month + '月');     
      }

      //补齐前面的日
      {
        let [year,month] = this._getPrevMonth();
        let day = this._getDay(year, month);
        let w = new Date(this.year, this.month-1, 1).getDay()-1;
        day = day-w;
        for(let i=0; i<w; i++, j++) 
          html+=`<td class="text-gray" data-value="${year}-${this._pad(month)}-${this._pad(++day)}">${day}</td>`;
      }

      //填充日
      {
        for(let i=0, d=this._getDay(this.year, this.month); i<d; i++, j++) {
          if(j===7){
            j=0;
            html+='</tr><tr>';
          };
          if(j===5 || j===6){
            html += `<td class="weekend" data-value="${this.year}-${this._pad(this.month)}-${this._pad(i+1)}">${i+1}</td>`;
          }else{
            html += `<td data-value="${this.year}-${this._pad(this.month)}-${this._pad(i+1)}">${i+1}</td>`;
          }
        }
      }

      //补齐后面的日
      {
        let [year, month] = this._getNextMonth();
        for(let i=1; j<7; j++, i++) 
          html+=`<td class="text-gray" data-value="${year}-${this._pad(month)}-${this._pad(i)}">${i}</td>`;
      }

      html+='</tr>';    
      ul.html(html);

      //高亮可选择的日历
      ul.find('td').each(function(){
        let v = $(this).data('value');
        if(v < that.options.startdate || v > that.options.enddate) 
          $(this).addClass('disabled');
        else if(v === that.format(that.element.val().trim(), 'yyyy-MM-dd') ){
          $(this).addClass('active');
        }
      });

      //设置当前天
      {
        let d = new Date();
        ul.find(`td[data-value="${d.getFullYear()}-${this._pad(d.getMonth()+1)}-${this._pad(d.getDate())}"]`).addClass('today');
      }
    }
    refresh(options){
      if(options) $.extend(true, this.options, options);

      if( this.options.startdate ) this._startdate = this._stringToDate(this.options.startdate);
      if( this.options.enddate ) this._enddate = this._stringToDate(this.options.enddate);
      this.element.prop('readonly', this.options.readonly);

      {
        let v = this.element.val().trim();
        if(/^\d{4}-\d{1,2}-\d{1,2}$/.test(v) )
          ({year:this.year, month:this.month, day:this.day} = this._stringToDate(v));
      }

      if(this.element.is(':disabled')) this.icon.addClass('disabled');
      if(this.options.cssstyle) this.helper.addClass(`${className}-ui-${this.options.cssstyle}`);
      
      this.setZindex();
      this.refreshDate();
      this.refreshSelectYear();
      this.refreshSelectMonth();
      this.rePosition();
      return this;
    }
    bindEvent(){
      var that = this;
      //弹出日期
      this.element.add(this.icon).on('click.' + pluginName, () => {
        if(this.element.prop('disabled')) return this;
        this.show()
      });

      //选择日期
      this.helper.find('table').on('click', 'td:not(.disabled)', function(){
        $(this).closest('table').find('.active').removeClass('active');
        that.element.val( $(this).addClass('active').data('value') );
        that.options.callback.call(that, $(this).data('value'), {
          year  : that.year,
          month : that.month,
          day   : $(this).text()
        }) !== false && that.hide();
      });

      //出错提示
      this.helper.on('click', '.disabled', ()=> this.errorTips() );

      //上个月
      this.helper.find('.prev').on('click', function(){
        if( $(this).hasClass('e-disabled') ) return this;
        [that.year, that.month] = that._getPrevMonth();
        that.refreshDate();
        that.refreshSelectMonth();
      });

      //下个月
      this.helper.find('.next').on('click', function(){
        if( $(this).hasClass('e-disabled') ) return this;
        [that.year, that.month] = that._getNextMonth();
        that.refreshDate();
        that.refreshSelectMonth();
      });

      //操作按钮组
      this.helper.find('.buttons-bar').on('click', 'a', function() {
        let $this = $(this);
        if($this.hasClass('today')){
          [that.year, that.month, that.day] = [];
          that.refreshDate();
          that.refreshSelectMonth();
          that.helper.find('.today').addClass('today-effect').on('animationend', function(){
            $(this).off('animationend').removeClass('today-effect');
          });
        }else if($this.hasClass('clear')){
          that.element.val('');
          [that.year, that.month, that.day] = [];
          that.refresh();
          if(typeof that.options.btnbar === 'function')
            that.options.btnbar.call(that);
        }
      });

      //弹出年月下拉框
      this.helper.on('click', '.year, .month', function(event){
        let ul = $(this).find('ul');
        if( ul.has(event.target).length>0 || ul[0]===event.target ){ 
          event.stopPropagation(); return;
        }
        if($(this).hasClass('active')){
          $(this).removeClass('active');
        }else{
          $(this).addClass('active').hasClass('year') && ul.scrollTop( (that.year-that.options.minyear-4) * ul.find('li:first').outerHeight() );
        }
      });

      //选择下拉后的年月
      this.helper.find('.drop-down').on('click', 'li:not(.disabled)', function(){
        let select = $(this).closest('.select');
        if(select.hasClass('year'))
          that.year = parseInt($(this).text(), 10);
        else
          that.month = parseInt($(this).text(), 10);
        that.refreshDate();
        that.refreshSelectMonth();
        select.removeClass('active');
        return false;
      });

      //点击空白隐藏弹框
      $(document).on('click.' + pluginName + this._id, event => {
        let target = event.target;
        if (this._visible === true &&
          this.helper &&
          this.helper.has(target).length === 0 &&
          this.helper[0] != target &&
          this.element[0] != target &&
          this.icon[0] != target &&
          this.element.has(target).length === 0) {
          this.hide();
        };
        let year = this.helper.find('.year'),
            month = this.helper.find('.month');
        if (year.has(target).length === 0 && year[0] != target) {
          year.removeClass('active');
        };
        if (month.has(target).length === 0 && month[0] != target) {
          month.removeClass('active');
        };  
      });
    }
    rePosition(){
      if(!this.element) return this;
      //对齐图标
      let position = this.element.position();
      this.icon.css({
        left : position.left + parseInt(this.element.css('margin-left'), 10) + this.element.outerWidth() - this.icon.outerWidth() - (parseInt(this.element.css('padding-right'),10)||5),
        top : position.top + parseInt(this.element.css('margin-top'), 10) + this.element.outerHeight()/2 - this.icon.outerHeight()/2
      });      
      if(!this._visible) return this;
      let that = this,
          offset = this.element.offset(),
          x = offset.left + this.options.left,
          y = offset.top + this.element.outerHeight() + this.options.top;
      this.helper.css({left: x, top: y});
    }
    show(){
      if(this._visible) return this;
      this._visible = true;
      this.rePosition();
      this.helper.show().addClass('animated-fadein-bottom');
    }
    hide(){
      this._visible = false;
      this.helper.hide().removeClass('animated-fadein-bottom');
      this.helper.find('.error-tips').hide();
    }
    setZindex(){
      let getAutoIndex = ()=>{
        let maxindex = 0;
        this.element.parents().each(function () {
          let getindex = parseInt($(this).css('z-index'), 10);
          if (maxindex < getindex) maxindex = getindex;
        });
        return maxindex + (++$[pluginName].zindex);
      };
      let zindex = this.options.zindex;
      if (zindex.indexOf('auto') > -1) {
        this.helper.css('z-index', getAutoIndex());
      }else if(typeof zindex === 'string' && /^(\-|\+)/.test(zindex)){
        this.helper.css('z-index', getAutoIndex() + parseInt(zindex, 10));
      }else{
        this.helper.css('z-index', zindex);
      }
      return this;
    }
    errorTips(){
      let tips = this.helper.find('.error-tips');
      let text = this.options.errortext;

      if( this.options.errortext === 'auto' ){
        if( this.options.startdate && !this.options.enddate ){
          text = '请选择$start之后的日期'
        }else if( !this.options.startdate && this.options.enddate ){
          text = '请选择$end之前的日期'
        }else{
          text = '请选择$start到$end范围内的日期'
        }
      }

      text = text.replace('$start', this.options.startdate || '' )
                 .replace('$end', this.options.enddate || '' );
      if(tips.length === 0){
        tips = $(`<div class="error-tips">${text}</div>`).appendTo(this.helper);
      }else{
        tips.show();
      }
      tips.addClass('animated-fadein-top');
      this._errorTimer && clearTimeout(this._errorTimer);
      this._errorTimer = setTimeout(()=>tips.removeClass('animated-fadein-top').fadeOut(), 3000);
    }    
    _getDay(year, month){
      return new Date(year, month, 0).getDate();
    }
    _getNextMonth(){
      let year, month;
      if(parseInt(this.month, 10)+1>12){
        year = parseInt(this.year) + 1;
        month = 1;
      }else{
        year = this.year;
        month = parseInt(this.month) + 1;
      }
      return [year, month];
    }
    _getPrevMonth(){
      let year, month;
      if(parseInt(this.month, 10)-1 <= 0){
        month = 12;
        year = parseInt(this.year, 10) - 1;
      }else{
        month = parseInt(this.month, 10) - 1;
        year = this.year;
      }
      return [year, month];
    }    
    format(date, str){
      let year, month, day;
      if(date){
        if(typeof date === 'string'){
          date = this._stringToDate(date);
          [year, month, day] = [date.year, date.month, date.day];
        }
      }else{
        [year, month, day] = [this.year, this.month, this.day];
      }
      return str.replace(/y{1,4}/g, $1 => year.toString().substr( year.toString().length - $1.length ) )
        .replace(/M{1,2}/g, $1 => $1.length==2 ? this._pad(month) : month)
        .replace(/d{1,2}/g, $1 => $1.length==2 ? this._pad(day) : day);
    }
    _pad(str){ return (str/Math.pow(10, 2)).toFixed(2).substr(2) }
    _stringToDate(str){
      if(typeof str === 'string' &&  /^\d{4}-\d{1,2}-\d{1,2}$/.test(str)){
        str = str.split('-');
        return {
          year  : parseInt(str[0], 10),
          month : parseInt(str[1], 10),
          day   : parseInt(str[2])
        }
      }else{
        return false;
      }
    }
    _initialAttr(){
      //:代表别名
      ['startdate', 'enddate'].forEach(v => {  
        let arr = v.split(":");
        if (arr.length > 1) {
          if(this.element.attr("data-" + arr[0]) ) this.options[arr[1]] = this.element.attr("data-" + arr[0]);
        } else {
          if(this.element.attr("data-" + v) ) this.options[v] = this.element.attr("data-" + v);
        }
      });
      return this;
    }    
  }

  $.fn[pluginName] = function (options) {
    options = options || {};
    if (typeof options == 'string') {
      let args = arguments,
          method = options;
      Array.prototype.shift.call(args);
      switch (method) {
        case "getClass":
          return $(this).data('plugin_' + pluginName);
        default:
          return this.each(function () {
            let plugin = $(this).data('plugin_' + pluginName);
            if (plugin && plugin[method]) plugin[method].apply(plugin, args);
          });
      };
    } else {
      return this.each(function () {
        let plugin = $(this).data('plugin_' + pluginName);
        if(!plugin) $(this).data('plugin_' + pluginName, new DatePicker($(this), options));
      });
    };
  };  

  $[pluginName] = {
    id : 0,
    zindex : 999
  }
}(jQuery, window));