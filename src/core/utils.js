(function(exports){

  /**
   * Formats given string by applying an object literal 
   *
   * @param str {String}
   * @param arguments {Object}
   * @return {String}
   */
  var format = exports.format = function(str,dict)
  {
    return str.replace(/(^|[^%])%(?:(\w{1})(?!\w)|\((\w+)\)\w{1})/g,function(match,lastchar,keyletter,keyword,column,str){ 
      return dict.hasOwnProperty(keyletter||keyword) && ( lastchar+dict[ keyletter||keyword ] ) || match;
    }).replace(/%%(\w{1}|\(\w+\)\w{1})/g,'%$1');
  }

  /**
   * Extract directory path from passed url
   * @return {String}
   */
  var get_dir = exports.get_dir = function(url)
  {
    var paths = url.replace( /^\w+\:\/\//, '' ).match(/((\/|(\.){2})[\.\w\/\- ]+\/)/);
    return paths && paths[0].substring( 0, paths[0].length -1 ) || "";
  }
  
  /**
   * Extract filename from passed url/uri
   * @param url {String}
   * @return {String}
   */
  var get_filename = exports.get_filename = function(url)
  {
    return url.match(/[\w\.-]+$/)[0];
  }

  /**
   * Return URL of the file calling this function
   * @param index {Number} Optional. Index of the element in the stack array.Default is 1 referring URL of the first caller.
   * @return {String}
   */
  var get_url = exports.get_url = function(index)
  {
    index = index==undefined && 1 || index;
    var stack = null;
    try
    {
      throw new Error();
    }
    catch(excinfo)
    {
      stack = excinfo.stack.match(/\w+\:\/\/[\w\.\/\-]+/g);
    }
    if(stack.length<2)
    {
      throw new Error('Stack hasn\'t enough information to determine URL of the called function');
    }
    return stack[index];
  }

  /**
   * Tests if given object is an array
   * @param object
   * @return {Boolean}
   */
  var is_array = exports.is_array = function(obj)
  {
    return obj && !(obj.propertyIsEnumerable('length')) && typeof obj === 'object' && typeof obj.length === 'number';
  }

  /**
   * Return given string left justified in a string of length width. Padding is done using the specified fillchar (default is a space).
   * 
   * @param str
   * @param width
   * @param fillchar
   */
  var ljust = exports.ljust = function(str,width,fillchar)
  {
    fillchar=(typeof fillchar!='string'||fillchar.length==0)&&' '||fillchar;
    while(str.length<width)
    {
      str=fillchar+str;
    }
    return str;
  }
  


  /**
   * Create representation string for an object using given class&object name and properties
   * @param class_name {String}
   * @param object_name {String}
   * @param properties {Object}
   */
  var repr = exports.repr = function(class_name,object_name,properties)
  {
    var main_template = '<%(class_name)s %(object_name)s %(properties)s>';
    var prop_template = '%(key)s="%(value)s"';
    
    var prop = '';
    var seperator = '';
    for(var key in properties)
    {
      var value = String(properties[key]);
      value.length > 50 && ( value = value.substring( 0, 23 ) + '...' + value.substring( value.length-24 ) );

      prop += seperator+format(prop_template,{ 'key':key, 'value':value });
      seperator = ' ';
    };

    return format( main_template,{
      'class_name':class_name,
      'object_name':object_name,
      'properties':prop
      });
  }
  
})( roka.core.utils = {} );
