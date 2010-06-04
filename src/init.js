(function( exports ){

  const DEBUG = true;
  const LIBRARIES = ['async','core','dom'];
  const VERSION = [1.0,"dev"].join('');

  const ENV = exports.env = 
  {
    'debug':DEBUG,
    'libraries':LIBRARIES,
    'version':VERSION,
  };

  var trace = exports.trace = function()
  {
    if (!DEBUG) return;
    var args = Array.prototype.map.call(arguments,function(el){
      return ( el && el.hasOwnProperty('toString') ) && el.toString() || el;
    });
    typeof console!='undefined' && console.log( 'roka v'+VERSION+' - '+ args.join(', ') );
  }

  for(var i=-1,len=LIBRARIES.length;++i<len;)
  {
    var pkg_name = LIBRARIES[i];
    exports[pkg_name]={};
  }

})( roka = {} );
