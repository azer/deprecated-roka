(function(exports){

  var Task = roka.async.task.Task;
  var TypeError = roka.errors.TypeError;

  var superproto = roka.core.oop.superproto;
  var extend = roka.core.oop.extend;
  var is_instance = roka.core.oop.is_instance;
  var partial = roka.core.functional.partial;
  var repr = roka.core.utils.repr;

  /**
   * An instance of the DOMTask class represents an event of the specified DOM object and fires success event when the specified event is fired.
   * 
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @param obj {Object}  Optional
   * @param evname {String} The DOM event to be observed
   */
  var DOMTask = exports.DOMTask = function(obj,evname)
  {
    superproto(DOMTask, this).constructor.call(this);

    var callback = partial(function(eventargs)
    {
      this.events.subjects.success.emit();
    },[],this);

    /**
     * @member DOMTask
     */
    var object = null;
    this.__defineGetter__('object',function()
    {
      return object;
    });
    this.__defineSetter__('object',function(value)
    {
      object = value;
    });

    /**
     * @member DOMTask
     */
    var event_name = null;
    this.__defineGetter__('event_name',function()
    {
      return event_name;
    });
    this.__defineSetter__('event_name',function(value)
    {
      event_name = value;
    });
    
    if(obj && evname)
    {
      obj.addEventListener(evname,callback,false);
    }
    
  }

  extend(DOMTask,Task);

  DOMTask.prototype.toString = function()
  {
    return repr('DOMTask',{ 'event':this.event_name, 'object':this.object });
  }


  /**
   * Instances of the ObservationTask class make possible to use events (subject objects) with
   * TaskSets and fire success and error events by listening specified Subject instances.
   * 
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   * @param success_subj {Subject}
   * @param error_subj {Subject} Optional
   * @see roka.async.taskset.TaskSet
   * @see roka.async.observer.subject
   */
  var ObservationTask = exports.ObservationTask = function( success_subj, error_subj)
  {
    superproto(ObservationTask,this).constructor.call( this );
    
    /**
     * success_callback is the listener observing given success subject 
     */
    var success_callback = partial(function()
    {
      this.events.fire('success');
    },[],this);

    /**
     * error_callback is the listener observing given error subject 
     */
    var error_callback = partial(function()
    {
      this.events.fire('error');
    },[],this);

    /**
     * The object representing the event which will be observed to fire success event.
     * @member ObservationTask
     */
    var success_subject = null;
    this.__defineGetter__('success_subject',function()
    {
      return success_subject;
    });
    this.__defineSetter__('success_subject',function(subject)
    {
      if( success_subject!=null )
      {
        success_subject.unsubscribe( success_callback );
      }

      if( subject!=null )
      {
        subject.subscribe( success_callback );
      }

      success_subject = subject;
    });

    /**
     * The object representing the event which will be observed to fire error event.
     * @member ObservationTask
     */
    var error_subject = null;
    this.__defineGetter__('error_subject',function()
    {
      return error_subject;
    });
    this.__defineSetter__('error_subject',function(subject)
    {
      if( error_subject!=null )
      {
        error_subject.unsubscribe( error_callback );
      }

      if( subject!=null )
      {
        subject.subscribe( error_callback );
      }

      error_subject = subject;
    });
    
    
    if(success_subj)
    {
      this.success_subject = success_subj;
    }

    if(error_subj)
    {
      this.error_subject = error_subj;
    }
    
  }

  extend( ObservationTask, Task );

  ObservationTask.prototype.toString = function()
  {
    return repr('ObservationTask',this.id,{ 'state':this.state });
  }

  /**
   * Provides defining reusable timer tasks using native timer functions
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   *
   * @see roka.async.task.Task
   * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers
   */
  var SchedTask = exports.SchedTask = function()
  {
    superproto(SchedTask,this).constructor.call(this);

    /**
     * The Id setTimeout function returns
     * @member SchedTask
     */
    var id = null;
    this.__defineGetter__('id',function()
    {
      return id;
    });
    this.__defineSetter__('id',function(value)
    {
      id = value;
    });
    
    /**
     * Number of miliseconds that the function call should be delayed by.
     * @member SchedTask
     */
    var delay = 0;
    this.__defineGetter__('delay',function()
    {
      return delay;
    });
    this.__defineSetter__('delay',function(value)
    {
      if(!is_instance(value,Number))
      {
        throw new TypeError('Invalid number '+value);
      }
      delay = value;
    });

  }

  extend(SchedTask,Task);

  SchedTask.prototype._handler_ = function(args)
  {
    try
    {
      this.func.apply( null, args );
    }
    catch(exc)
    {
      this.events.fire('error');
      throw exc;
    }
    this.events.fire('success');
  }

  SchedTask.prototype.cancel = function()
  {
    clearTimeout( this.id );
  };

  SchedTask.prototype.run = function() 
  {
    this.id = setTimeout(partial(this._handler_,[arguments],this),this.delay);
  };

  SchedTask.prototype.toString = function()
  {
    return repr('SchedTask',this.id,{ 'delay':this.delay });
  }

})(roka.async.tasks={});
