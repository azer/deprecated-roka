(function(exports){

  var SubjectSet = roka.async.observer.SubjectSet;
  var Subject = roka.async.observer.Subject;

  var repr = roka.core.utils.repr;
  var partial = roka.core.functional.partial;

  /**
   * Objects representing states of the tasks
   */
  const UNINITIALIZED = exports.UNINITIALIZED = new Number(-1);
  const FAILED = exports.FAILED = new Number(0);
  const SUCCESS = exports.SUCCESS = new Number(1);

  /**
   * Instances of the task class represent things have to be done and include just an events property
   * provides handling callbacks. Task class is being extended by the classes like ObservationTask, WorkerTask
   * in the "tasks" module.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   *
   * @see roka.async.tasks
   */
  var creation_counter = 0;
  var Task = exports.Task = roka.async.Task = function()
  {
    /**
     * Immutable Task ID
     * @member Task
     */
    var id = "Task#"+( ++creation_counter );
    this.__defineGetter__('id',function()
    {
      return id;
    });
    
    /**
     * The task state
     * @member Task
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
     * Provides handling callbacks
     * @member Task
     */
    var events = new SubjectSet();
    events.create('success');
    events.create('error');

    events.subjects.success.emit = partial(function()
    {
      roka.trace(this,'emitting success event');
      state = SUCCESS;
      var args = [ this ];
      Array.prototype.push.apply(args,arguments);
      Subject.prototype.emit.apply( events.subjects.success, args );
    },[],this);

    events.subjects.error.emit = partial(function()
    {
      roka.trace(this,'emitting error event');
      state = FAILED;
      var args = [ this ];
      Array.prototype.push.apply(args,arguments);
      Subject.prototype.emit.apply( events.subjects.error, args );
    },[],this);

    this.__defineGetter__('events',function()
    {
      return events;
    });

    roka.trace( this, 'initialized' );

  }

  Task.prototype.toString = function()
  {
    return repr('Task',this.id,{ 'state':this.state });
  }

})(roka.async.task={});
