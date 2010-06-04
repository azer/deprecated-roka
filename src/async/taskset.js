(function(exports){

  var Dict = roka.core.Dict;
  var Task = roka.async.task.Task;
  var Subject = roka.async.observer.Subject;

  var superproto = roka.core.oop.superproto;
  var extend = roka.core.oop.extend;
  var is_instance = roka.core.oop.is_instance;
  var partial = roka.core.functional.partial;
  var repr = roka.core.utils.repr;

  const UNINITIALIZED = roka.async.task.UNINITIALIZED;
  const FAILED = roka.async.task.FAILED;
  const SUCCESS = roka.async.task.SUCCESS;

  /**
   * Inherits Dict class and provides multiplexing asynchronous tasks. An instance of the 
   * TaskSet class observes defined tasks and fires "success" event when all of these tasks is done.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @see roka.core.dict.Dict
   * @see roka.async.task.Task
   * @see roka.async.tasks
   */
  var creation_counter = 0;
  var TaskSet = exports.TaskSet = function()
  {
    superproto(TaskSet,this).constructor.call(this);
    this.events.create('success');
    this.events.create('error');

    this.events.subjects.success.emit = partial(function()
    {
      roka.trace(this,'emitting success event');
      state = SUCCESS;
      var args = [ this ];
      Array.prototype.push.apply(args,arguments);
      Subject.prototype.emit.apply( this.events.subjects.success, args );
    },[],this);

    this.events.subjects.error.emit = partial(function()
    {
      roka.trace(this,'emitting error event');
      state = FAILED;
      var args = [  ];
      Array.prototype.push.apply(args,arguments);
      Subject.prototype.emit.apply( this.events.subjects.error, args );
    },[],this);

    /**
     * Immutable TaskSet Id
     */
    var id = 'TaskSet#'+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * The TaskSet state
     * @member TaskSet
     */
    var state = UNINITIALIZED;
    this.__defineGetter__('state',function()
    {
      return state;
    });
    this.__defineSetter__('state',function(value)
    {
      state = value;
    });

    /**
     * The function observing success event of the tasks
     * @member TaskSet
     */
    this._successCallback_ = partial(function(task)
    {
      roka.trace(this,'got success signal from',task);

      var key = this.keys[ this.values.indexOf( task ) ];
      this.del(key);

      if(this.length==0 && state == UNINITIALIZED)
      {
        this.events.fire('success',this);
      }
    },[],this);

    /**
     * The function observing error event of the tasks
     * @member TaskSet
     */
    this._errorCallback_ = partial(function(task)
    {
      roka.trace(this,'got error signal from',task);
      var key = this.keys[ this.values.indexOf( task ) ];
      this.del(key);
      this.events.fire('error',this,task);
    },[],this);

  }

  extend(TaskSet, Dict);

  TaskSet.prototype.del = function(key)
  {
    this.unsubscribe(this.get(key));
    superproto(TaskSet,this).del.call(this,key);
  }

  TaskSet.prototype.set = function(key,task)
  {
    roka.trace(this,'setting new task','key:'+key,'task:',task);
    if( ! is_instance(task, Task) && !is_instance(task,TaskSet) )
    {
      roka.trace(this,'fail',typeof task);
      throw new TypeError( 'Invalid task object' );
    }

    this.has(key) && this.unsubscribe( this.get(key) );
    
    superproto(TaskSet,this).set.call(this,key,task);
    task.name = key;
    this.subscribe(task);
  }

  TaskSet.prototype.subscribe = function(task) 
  {
    task.events.subjects.success.observers.indexOf( this._successCallback_ ) == -1 && task.events.add_listener('success',this._successCallback_);
    task.events.subjects.error.observers.indexOf( this._errorCallback_ ) == -1 && task.events.add_listener('error',this._errorCallback_);
  };

  TaskSet.prototype.unsubscribe = function(task) 
  {
    task.events.subjects.success.observers.indexOf( this._successCallback_ ) > -1 && task.events.remove_listener('success',this._successCallback_);
    task.events.subjects.error.observers.indexOf( this._errorCallback_ ) > -1 && task.events.remove_listener('error',this._errorCallback_);
  };

  TaskSet.prototype.toString = function()
  {
    return repr( 'Taskset',this.id, { len:this.length, items:this.keys } );
  }

})(roka.async.taskset={});
