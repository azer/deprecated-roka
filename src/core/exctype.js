(function(exports){

  var repr = roka.core.utils.repr;
  var extend = roka.core.oop.extend;
  var superproto = roka.core.oop.superproto;

  var stackdict = exports.stackdict =
  {
    webkit:
    {
      test:/^\w*Error\:?$/,
      filename:/([\w_\?\#\=\.\/:]+)\:\d+\:\d+$/,
      lineno:/\:(\d+)\:\d+$/,
      crop:3,
    },
    gecko:
    {
      test:/^[0-9a-zA-Z_$]*\(/,
      filename:/([\w_\?\#\=\.\/:]+)\:(\d+)$/,
      lineno:/\:(\d+)$/,
      crop:3
    }
  }

  /**
   * Instances of Exception class represent exceptions and store stack information.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.exctype.Exception
   */
  var Exception = exports.Exception = function(message)
  {
    this.message = arguments[0] || '';
    this.name = 'Exception';
    this.filename = null;
    this.lineno = 0;
    this.stack = null;

    var stack, flinf;

    try 
    {
      throw new Error();
    } 
    catch(exc)
    {
      stack = exc.stack.split('\n');
    }

    for(var engname in stackdict)
    {
      var eng = stackdict[ engname ];
      if( eng.test.test( stack[0] ) )
      {
        stack = stack.slice( eng.crop );
        this.filename = stack[0].match( eng.filename )[1];
        this.lineno = stack[0].match( eng.lineno )[1];
      }
    }

  }

  Exception.prototype.toString = function() 
  {
    return repr('Exception', this.name, { 'message':this.message, 'linenumber':this.lineno, 'filename':this.filename });
  };

  /**
   * Factory of Exception class. 
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.exctype.Exception
  */
  var ExcType = exports.ExcType = function(name)
  {
    var cls = function(message)
    {
      superproto( cls, this ).constructor.call( this, message );
      this.name = name;
    }
    extend( cls, Exception );
    return cls;
  }

})( roka.core.exctype = {} );
