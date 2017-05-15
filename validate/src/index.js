import './css/index.css';
import AlertTips from './ui/alert.tips.js';
//import DefaultTips from './ui/default.tips.js';
import None from './ui/none.js';
const pluginName = 'validate';

let selectUI = (type) => {
  switch(type){
    case 'none':
      return None;
    //case 'default':
      //return DefaultTips;
    default:
      return AlertTips;
  }
}

$.fn[pluginName] = function (...arg) {
  if (typeof arg[0] === 'string') {
    let method = arg[0];
    let $this = $(this).is('form') ? $(this) : $(this).closest('form');
    let plugin = $this.data('plugin_' + pluginName);
    switch (method) {
      case "getClass":
        return plugin;
      default:
        return $this.each(function(){
          if(plugin && plugin[method]) plugin[method].apply(plugin, arg.splice(1));
        });
    };
  } else {
    return this.each(function(){
      let plugin = $(this).data('plugin_' + pluginName);
      if(plugin){
        return;
      }else{
        let options = arg[0];
        if(typeof options === 'function') options = {success: options};
        let curUI = selectUI(options.ui);
        $(this).data('plugin_' + pluginName, new curUI($(this), options));
      }
    });
  };
};
