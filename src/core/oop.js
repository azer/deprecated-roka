(function(exports){

  var partial = roka.core.utils.partial;

  /**
   * Clone passed object literal. 
   *
   * @param obj
   * @return {Object}
   */
  var clone = exports.clone = function(obj)
  {
    // TODO deep clone
    var ct = function(){};
    ct.prototype = obj;
    return new ct();
  } 

  /**
   * Concatenates given object literals in a new one
   * @param {Object}
   * @return {Object}
   */
  var concat = exports.concat = function()
  {
    var main = arguments[0];
    for (var i = 0, len=arguments.length; ++i < len; ) 
    {
      var obj = arguments[i];

      for(var member_key in obj)
      {
        var member_value = obj[member_key];
        var getter = obj.__lookupGetter__(member_key);
        var setter = obj.__lookupSetter__(member_key);

        if(getter)
        {
          main.__defineGetter__(member_key,getter);
        }
        
        if(setter)
        {
          main.__defineSetter__(member_key,setter);
        }

        if(!getter&&!setter)
        {
          main[ member_key ] = member_value;
        }
      }
    };
    return main;
  };

  /**
   * Provide simple inheritance by setting prototype and constructor of given subclass.
   *
   * @param subclass {Function}
   * @param superclass {Function}
   */
  var extend = exports.extend = function(subclass)
  {
    var superclass = arguments[1];
    subclass.prototype = clone(superclass.prototype);
    subclass.prototype.constructor = subclass;
  }

  /**
   * Return true if the given object is an instance of the given class or a class in _mro_ list of that class.
   *
   * @param obj {Object}
   * @param cls {Function}
   * @return {Boolean}
   */
  var is_instance = exports.is_instance = function(obj,cls)
  {
    return obj!=null && ( obj instanceof cls || obj.constructor == cls || is_subclass(null,cls,obj) );
  }

  /**
   * Return true if class is a subclass of classinfo.
   *
   * @param class {Function}
   * @param classinfo {Function}
   * @param instance {Object} optional
   * @return {Boolean}
   */
  var is_subclass = exports.is_subclass = function(cls,clsinfo,obj)
  {
    obj = obj!=undefined?obj:new cls();
    var proto = obj.__proto__.__proto__;
    while(proto)
    {
      if(proto==clsinfo.prototype)
      {
        return true;
      }
      proto=proto.__proto__;
    }
    return false;
  }

  /**
   * Return upper prototype of given object.
   *
   * @param cls {Function}
   * @param obj {Object}
   * @return {Object}
   * @throws Error
   */
  var superproto = exports.superproto = function(cls,obj)
  {
    var proto = obj.__proto__;
    while(proto)
    {
      if(proto.constructor==cls&&proto.__proto__)
      {
        return proto.__proto__;
      }
      proto=proto.__proto__;
    }
    throw Error('Could not find superclass of given object.');
  }

})(roka.core.oop = {});
