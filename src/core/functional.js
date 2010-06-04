(function(exports){
  
  var is_array = roka.core.utils.is_array;

  /**
   * Invoke given function with passed arguments.
   * @param fn {Functional}
   * @param args {Array}
   */
  var apply = exports.apply = function(fn,args)
  {
    return fn.apply(null,args);
  }

  /**
   * Invoke given function with passed arguments
   * @param fn {Function}
   * @return {function}
   */
  var call = exports.call = function(fn)
  {
    return fn.apply(null,Array.prototype.slice.call(arguments,1));
  }

  /**
   * Creates a generic wrapper function for specified object to provide fluent interface.
   * @param obj
   * @param middleware {Function} Optional.
   * @return {Function}
   */
  var fluentwith = exports.fluentwith = function(ctx,middleware)
  {
    !middleware && ( middleware = function(ctx,fn,args){
      var flagind = args.indexOf( fluentwith.CONTEXT );
      flagind == -1 && args.push(ctx) || ( args[flagind] = ctx );
      fn.apply(null,args);
    });

    var caller = function(fn)
    {
      try
      {
        middleware( ctx, fn, Array.prototype.slice.call( arguments, 1 ) );
      }
      catch(exc)
      {
        if(exc.constructor==ReturnFrom)
        {
          return exc.object;
        }
        throw exc;
      }
      return caller;
    }
    return caller;
  };

  fluentwith.CONTEXT = new Object();

  /**
   * @param fn {Function}
   * @param scope {Object}  Optional
   * @return {Function} Wrapper function
   */
  var curry = exports.curry = function(fn,scope)
  {
    const init_args = Array.prototype.slice.call(arguments, 2);
    var args;

    var accumulator = function()
    {
      Array.prototype.push.apply(args,arguments);
      return ( fn.length == 0 && arguments.length==0 ) || ( fn.length!=0 && fn.length <= args.length ) ? 
        call() : accumulator;
    }

    var call = function()
    {
      var ret = fn.apply(scope ,args);
      clear();
      return ret;
    }

    var clear = function()
    {
      args = Array.prototype.slice.call(init_args,0);
    };
    
    clear();
  
    return accumulator;
  };

  /**
   * Iterates specified array/object literal with given functions
   * @param ctx
   */
  var each = exports.each = function(ctx)
  {
    var flags = [ each.CONTEXT, each.INDEX, each.ITEM, each.KEY, each.VALUE ];

    return fluentwith(ctx,function(ctx,fn,args)
    {
      var ind_ctx = args.indexOf( each.CONTEXT );
      var ind_ind = args.indexOf( each.INDEX );
      var ind_item = args.indexOf( each.ITEM );
      var ind_key = args.indexOf( each.KEY );
      var ind_value = args.indexOf( each.VALUE );

      ind_ctx > -1 && ( args[ind_ctx] = ctx );

      if( is_array(ctx) )
      {
        ind_item == -1 && ( ind_item = args.push( each.ITEM )-1 );
        for(var i=-1,len=ctx.length; ++i<len;)
        {
          args[ind_item] = ctx[i];
          ind_ind > -1 && ( args[ ind_ind ] = i );
          fn.apply(null,args);
        };
      }
      else
      {
        ind_key == -1 && ( ind_key = args.push( each.KEY )-1 );
        ind_value == -1 && ( ind_value = args.push( each.VALUE )-1 );
        for(var key in ctx)
        {
          args[ ind_key ] = key;
          args[ ind_value ] = ctx[key];
          fn.apply(null,args);
        }
      }
    });
  };

  each.CONTEXT = new Object('CONTEXT FLAG');
  each.INDEX = new Object('INDEX FLAG');
  each.ITEM = new Object('ITEM FLAG');
  each.KEY = new Object('KEY FLAG');
  each.VALUE = new Object('VALUE FLAG');

  /**
   * Similar to each, create a list and iterate its content with specified functions
   *
   * @param start
   * @param end
   * @param step
   * @return {Function}
   */
  var loop = exports.loop = function(start,end,step)
  {
    !end && ( end = start, start = 0 );
    !step && ( step = 1 );

    return fluentwith(null,function(ctx,fn,args)
    {
      var flagind = args.indexOf( loop.INDEX );
      flagind == -1 && ( flagind = args.length );
      
      for (var i=start-1; ++i*step<end;)
      {
        args[flagind] = i;
        fn.apply(null,args);
      };
    });
  }

  loop.INDEX = new Object('INDEX FLAG');

 /**
  * Create and return a wrapper function executing given function with specified scope and arguments
  *
  * @param fn {Function}
  * @param args {Array}
  * @param scope {Object}
  * @return {Function} 
  */
  var partial = exports.partial = function(fn,init_args,scope)
  {
    !init_args && ( init_args = [] );
    return function()
    {
      var args = Array.prototype.slice.call(init_args,0);
      Array.prototype.push.apply(args,arguments);
      
      return fn.apply(scope,args);
    };
  };
  
  /**
   * Throw given object by wrapping with a ReturnFrom instance.
   * @param obj
   * @return {ReturnFrom}
   */
  var returnfrom = exports.returnfrom = function(obj)
  {
    var container = new ReturnFrom();
    container.object = obj;
    throw container;
  };

  /**
   * Just a wrapper class to return values immediately when chaning functions
   */
  var ReturnFrom = exports.ReturnFrom = function()
  {
    this.object = null;
  }

})( roka.core.functional = {} );
