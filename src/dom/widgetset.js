(function( exports ){

  var SubjectSet = roka.async.observer.SubjectSet;
  var ObservationTask = roka.async.tasks.ObservationTask;
  var NotFoundError = roka.errors.NotFoundError;
  var TaskSet = roka.async.taskset.TaskSet;
  var Dict = roka.core.dict.Dict;

  var extend = roka.core.oop.extend;
  var superproto = roka.core.oop.superproto;
  var partial = roka.core.functional.partial;
  
  /**
   * WidgetSet objects are kind of Dict objects. The only difference is that
   * WidgetSet objects are dedicated to store Widget objects, and fire "ready"
   * events when the widgets they store become ready. They have a taskset to manage
   * this progress, as well.
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var WidgetSet = exports.WidgetSet = function()
  {
    superproto( WidgetSet, this ).constructor.call(this, roka.dom.widget.Widget); 

    var id = "WidgetSet#"+( ++creation_counter );
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * Puts the tasks which have to be done to fire ready event
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });

    this.events.subjects.ready = tasks.events.subjects.success;
  }

  extend(WidgetSet,Dict);

  WidgetSet.prototype.set = function(key, widget) 
  {
    roka.trace(this,'setting new item','key '+key);
    superproto( WidgetSet, this ).set.call( this, key, widget );
    this.tasks.set( widget, new ObservationTask( widget.events.subjects.ready ) );
  };

  WidgetSet.prototype.del = function(widget) 
  {
    roka.trace(this,'removing item','key '+key);
    superproto( WidgetSet, this )._delItem_.call( this, widget );
    this.tasks.del( widget );
  };

  WidgetSet.prototype.toString = function()
  {
    return roka.core.utils.repr('WidgetSet',this.id,{ tasks:this.tasks, items:this.keys });
  }



})( roka.dom.widgetset = {} );

