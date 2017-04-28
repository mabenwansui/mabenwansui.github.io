import './css/index';
import Validate from './lib/validate';
const pluginName = 'validate';
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
        $(this).data('plugin_' + pluginName, new Validate($(this), options));
      }
    });
  };
};


/*
  api
  $('form').validate({
    maben(){
      
    }
  }).done(data => {
    
  })
*/