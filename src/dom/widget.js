(function(exports){

  var SubjectSet = roka.async.observer.SubjectSet;
  var TaskSet = roka.async.taskset.TaskSet;
  var ObservationTask = roka.async.tasks.ObservationTask;

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
  var Widget = exports.Widget = roka.dom.Widget = function()
  {

    /**
     * Immutable Widget ID 
     * @member Widget
     */
    var id = "Widget#"+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });
  
    /**
     * The application that the widget object belongs to. Optional.
     * @member Widget
     */
    var application = null;
    this.__defineGetter__('application',function()
    {
      return application;
    });
    this.__defineSetter__('application',function(value)
    {
      application = value;
    });

    /**
     * A SubjectSet object handling events
     * @member Widget
     */
    var events = new SubjectSet();
    this.__defineGetter__('events',function()
    { 
      return events;  
    });

    /**
     * The path widget is located
     * @member Widget
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
     * Put the tasks that have to be to fire success event
     * @member Widget
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    {
      return tasks;
    });
    events.subjects.ready = tasks.events.subjects.success;

    /**
     * An instance of Layout class handling DOM operations
     * @member Widget
     */
    var layout = null;
    this.__defineGetter__('layout',function()
    { 
      return layout;
    });
    this.__defineSetter__('layout',partial(function()
    {
      try
      {
        this.tasks.del('layout-ready');
      } catch(excinfo) {}

      layout = arguments[0];

      if(layout)
      {
        this.tasks.set('layout-ready', new ObservationTask( layout.events.subjects.ready ));
      }

    },[],this));

  }

  Widget.prototype.toString = function()
  {
    return roka.core.utils.repr('Widget',this.id,{ layout:this.layout, tasks:this.tasks });
  }

})( roka.dom.widget = {} );
