(function( exports ){

  var SubjectSet = roka.async.observer.SubjectSet;
  var WidgetSet = roka.dom.widgetset.WidgetSet;
  var ObservationTask = roka.async.tasks.ObservationTask;
  var TaskSet = roka.async.taskset.TaskSet;

  var partial = roka.core.functional.partial;
  var get_dir = roka.core.utils.get_dir;
  var get_url = roka.core.utils.get_url;
  
  /**
   *
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var Application = exports.Application = function()
  {
    /**
     * Application Id
     * @member Application
     */
    var id = "Application#"+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * Provide an interface to events of the application
     * @member Application
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    {
      return events;
    });

    /**
     * The path application is located
     * @member Application
     */
    var path = get_dir( get_url(2) );
    this.__defineGetter__('path',function()
    {
      return path;
    });
    this.__defineSetter__('path',function(value)
    {
      path = value;
    });
    

    /**
     * The tasks which have to be completed to fire ready event of the application
     * @member Application
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });

    /**
     * A WidgetSet object storing widgets of the app
     * @member Application
     */
    var widgets = new WidgetSet();
    this.__defineGetter__('widgets',function()
    {
      return widgets;
    });

    // set default events and tasks 
    this.events.create('ready');
    tasks.set( 'widgets-ready', new ObservationTask( widgets.events.subjects.ready ));

    // 
    events.subjects.ready = tasks.events.subjects.success;
    
    roka.trace(this,"initialized");
  }

  Application.prototype.toString = function()
  {
    return roka.core.utils.repr('Application',this.id,{ "tasks":this.tasks.length, "widgets":this.widgets.length });
  }

})( roka.dom.application = {} );

