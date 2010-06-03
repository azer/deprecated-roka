(function(exports){

  var List = roka.core.List;
  var Dict = roka.core.Dict;
  var TaskSet = roka.async.taskset.TaskSet;
  var ObservationTask = roka.async.tasks.ObservationTask;
  var Request = roka.async.request.Request;

  var NotFoundError = roka.errors.NotFoundError;

  var superproto = roka.core.oop.superproto;
  var extend = roka.core.oop.extend;
  var partial = roka.core.functional.partial;

  const UNINITIALIZED = roka.async.task.UNINITIALIZED;
  const FAILED = roka.async.task.FAILED;
  const SUCCESS = roka.async.task.SUCCESS;

  /**
   * Provides managing a set of multiple asynchronous requests.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var RequestSet = exports.RequestSet = roka.async.RequestSet = function()
  {
    superproto(RequestSet,this).constructor.call( this, Request );

    this.events.create('load');
    this.events.create('error');

    /**
     * Immutable RequestSet ID
     * @member RequestSet
     */
    var id = 'RequestSet#'+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * The tasks which have to be done to fire load event.
     * @member RequestSet
     */
    var tasks = new TaskSet();
    tasks.events.add_listener('success',partial( this.events.subjects.load.emit, [], this.events.subjects.load ) );
    tasks.events.add_listener('error',partial( this.events.subjects.error.emit, [], this.events.subjects.error ) );
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });
  
    // set subtask for requests
    tasks.set('load',new TaskSet());
    
    roka.trace(this,'initialized');
  }

  extend( RequestSet, Dict );

  /**
   * @param key {String}
   * @param request {Request}
   * @see roka.core.dict.Dict.set
   */
  RequestSet.prototype.set = function(key, request) 
  {
    superproto( RequestSet, this ).set.call( this, key, request );
    roka.trace(this,'setting new request.', 'key:'+key, 'request:',request);
    this.tasks.get('load').set( key, new ObservationTask( request.events.subjects.load, request.events.subjects.error ) );
  };

  /**
   * Stop to observe removed requests
   * @param key {String}
   * @see roka.core.dict.Dict.del
   */
  RequestSet.prototype.del = function(key) 
  {
    this.tasks.get('load').del( key );
    roka.trace(this,'removing request: ',key);
    superproto( RequestSet, this ).del.call( this, key );
  };

  /**
   * Create and append a new request with specified url
   *
   * @param url {String}
   */
  RequestSet.prototype.create = function()
  {
    for(var i=-1,len=arguments.length; ++i<len;)
    {
      var req = new Request();
      req.url = arguments[i];
      this.set( req.url, req );
    }
  }

  /**
   * Start to send all requests
   */
  RequestSet.prototype.send = function()
  {
    roka.trace(this,'Starting to send requests..');
    var tasks = this.tasks;
    this.for_each(function(key,req,set)
    {
      if(req.url!=null)
      {
        req.send(); 
      }
      else
      {
        tasks.get('load').del( key );
      }
    });
  }

  RequestSet.prototype.toString = function() 
  {
    return roka.core.utils.repr('RequestSet',this.id,{ len:this.length, tasks:this.tasks });
  };

})( roka.async.requestset = {} );
