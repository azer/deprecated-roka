(function(exports){

  var SubjectSet = roka.async.observer.SubjectSet;
  var DateTime = roka.core.datetime.DateTime;

  var format = roka.core.utils.format;
  var partial = roka.core.functional.partial;

  var Level = exports.Level = function(name,value)
  {
    this.name = name;
    this.value = value;
  }

  /**
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var Logger = exports.Logger = function(name)
  {
    this.level = levels.NOTSET;
    this.records = [];
    this.subloggers = [];
    this.parent_logger = null;
    this.datetime_format = '%Y-%m-%d %H:%M:%S';
    this.record_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s';

    var events = null;
    this.__defineGetter__('events',function()
    {
      if(events==null)
      {
        events = new SubjectSet();
        events.create('new-record');
      }
      return events;
    });

    name = name || null;
    this.__defineGetter__('name',partial(function()
    {
      return ( this.parent_logger && ( this.parent_logger.name + '.' ) || '' )+(name || '');
    },null,this));

    this.__defineSetter__('name',function()
    {
      name = arguments[0];
    });

  }

  /**
   * Add a new callback to start to dispatch new records to given console objects.
   * @param console
   */
  Logger.prototype.add_console = function()
  {
    for(var i=-1,len=arguments.length; ++i<len;)
    {
      var console = arguments[i];
      this.events.add_listener('new-record',function(record)
      {
        var method_name = record.level.name.toLowerCase();
        if(!console.hasOwnProperty( method_name  ))
        {
          method_name = 'log';
        }
        console[method_name]( record.format() ); 
      });
    }
  }

  /**
   * Save passed record in the records property and fire "new-record" event.
   *
   * @param record {Record}
   */
  Logger.prototype.add_record = function(record)
  { 
    this.records.push( record );
    this.emit( record );
  }

  /**
   * Emit given record to defined callbacks and parent loggers by checking level value.
   *
   * @param record {Record}
   */
  Logger.prototype.emit = function(record)
  {
    if(record.level.value>=this.level.value)
    {
      this.events.fire('new-record',record);

      if(this.parent_logger)
      {
        this.parent_logger.emit(record);
      }
    }
  }

  /**
   * @param logger {Logger}
   */
  Logger.prototype.add_sublogger = function()
  {
    for(var i=-1,len=arguments.length; ++i<len;)
    {
      var logger = arguments[i];
      this.subloggers.push( logger );
      logger.parent_logger = this;
    }
  }

  /**
   * @param logger {Logger}
   */
  Logger.prototype.remove_sublogger = function(logger)
  {
    if(logger.parent_logger==this)
    {
      logger.parent_logger = null;
    }
    this.subloggers = this.subloggers.filter( function(el){
      return logger==el;
    });
  }
  
  /**
   * Log a message with severity 'CRITICAL'
   *
   * @param message {String}
   */
  Logger.prototype.critical = function(message)
  {
    this.make_record(arguments, levels.CRITICAL);  
  }

  Logger.prototype.fatal = Logger.prototype.critical;

  /**
   * Log a message with severity 'DEBUG'
   *
   * @param message {String}
   */
  Logger.prototype.debug = function(message)
  {
    this.make_record( arguments, levels.DEBUG );
  }

  /**
   * Log a message with severity 'ERROR'
   *
   * @param message {String}
   */
  Logger.prototype.error = function(message)
  {
    this.make_record(arguments, levels.ERROR);  
  }

  /**
   * Log a message with severity 'INFO'
   *
   * @param message {String}
   */
  Logger.prototype.info = Logger.prototype.log = function(message)
  {
    this.make_record(arguments, levels.INFO);  
  }

  /*
   * Logging methods of the class like debug, info, log call 
   * this factory method by passing arguments they take.
   * make_record joins elements of that list with comma 
   * and store it in a Record object.
   *
   * @param message {String}
   * @param level {Level}
   */
  Logger.prototype.make_record = function(message,level)
  {
    var record = new Record();
    record.level = level;
    record.message = Array.prototype.join.call(message,',\u0020');
    record.logger = this;
    this.add_record( record );
  }

  /**
   * Log a message with severity 'WARNING'
   *
   * @param message {String}
   */
  Logger.prototype.warning = Logger.prototype.warn = function(message)
  {
    this.make_record(arguments, levels.WARNING);  
  }

  Logger.prototype.toString = function()
  {
    return roka.core.utils.repr('Logger','',{ 'name':this.name, 'records':this.records });
  }

  /**
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var Record = exports.Record = function()
  {
    this.logger = null;
    this.message = '';
    this.level = null;
    this.datetime = new DateTime();
  }

  Record.prototype.format = function()
  {
    return format( this.logger.record_format, 
    {
      'asctime':this.datetime.format( this.logger.datetime_format ),
      'name':this.logger.name,
      'levelname':this.level.name,
      'message':this.message
    }); 
  }

  Record.prototype.toString = function()
  {
    return roka.core.utils.repr('Record','',{ logger:this.logger, datetime:this.datetime, level:this.level, message:this.message  });
  }

  // The dictionary keeping levels
  var levels = exports.levels = 
  {
    /**
     * Add new level
     *
     * @param name {String}
     * @param value {String}
     */
    'add_level':function(name,value){
      name = name.toUpperCase();
      this[ name ] = new Level(name,value);
      return this[ name ];
    }
  }

  // set default levels
  var lvlnames = [ 'notset', 'debug', 'info', 'warning', 'error', 'critical' ];
  lvlnames.map(function(name,ind)
  {
    return levels.add_level( name, ind*10 );
  });

  // aliases for warn and critical
  levels.add_level( 'warn', levels.WARNING.value );
  levels.add_level( 'fatal', levels.CRITICAL.value );

})( roka.core.logging = {} );
