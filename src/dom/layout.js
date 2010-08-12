(function(exports){

  var SubjectSet = roka.async.observer.SubjectSet;
  var TaskSet = roka.async.taskset.TaskSet;
  var ObservationTask = roka.async.tasks.ObservationTask;
  var XMLFragment = roka.dom.xmlfragment.XMLFragment;
  var NotFoundError = roka.errors.NotFoundError;

  var partial = roka.core.functional.partial;
  var get_dir = roka.core.utils.get_dir;
  var get_url = roka.core.utils.get_url;

  /**
   * @author Azer Koculu <azerkoculu@gmail.com>
   * @version 1.0
   * @class
   * @constructor
   */
  var creation_counter = 0;
  var Layout = exports.Layout = function()
  {
    
    /**
     * The layout ID
     */
    var id = 'Layout#'+(++creation_counter);
    this.__defineGetter__('id',function()
    {
      return id;
    });

    /**
     * The events property is an instance of the SubjectSet class and executes declared callbacks by the state of the layout.
     * @member Layout
     */
    var events = new SubjectSet();
    events.create('build');
    events.create('insert');
    events.create('ready');
    this.__defineGetter__('events',function()
    { 
      return events; 
    });

    /**
     * The path layout is located
     * @member Layout
     */
    var path = get_dir( get_url(2) || '' );
    this.__defineGetter__('path',function()
    {
      return path;
    });
    this.__defineSetter__('path',function(value)
    {
      path = value;
    });

    /**
     * A property referring to content of the output will make it easy to access
     * @member Layout
     */
    var output = new XMLFragment();
    this.__defineGetter__('output',function()
    {
      return output;
    });
    this.__defineSetter__('output',function(value)
    {
      output = value;
    });

    /**
     * Refers to the widget that layout belongs to.
     * @member Layout
     */
    var widget = null;
    this.__defineGetter__('widget',function()
    {
      return widget;
    });
    this.__defineSetter__('widget',function(widgetobj)
    {
      widget = widgetobj;
    });

    /**
     * The tasks that has to be completed to fire ready event
     * @member Layout
     */
    var tasks = new TaskSet();
    this.__defineGetter__('tasks',function()
    { 
      return tasks; 
    });

    // set default tasks. for generic layout class, "build" is the only task comes by default
    tasks.set('build',new ObservationTask( this.events.subjects.build ));
    
    // set success event of the tasks to fire ready event of the layout
    events.subjects.ready = tasks.events.subjects.success;
  }

  /**
   * Move the output under specified node
   * @param el {Element}  The node under which output will be inserted
   */
  Layout.prototype.insert = function(el) 
  {
    el.appendChild( this.output.content );
    this.events.fire( 'insert', el );
  };

  Layout.prototype.toString = function()
  {
    return roka.core.utils.repr( 'Layout', this.id, { 'tasks':this.tasks } );
  };

})( roka.dom.layout = {} );
