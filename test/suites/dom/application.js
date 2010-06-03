var Application = roka.dom.application.Application;
var is_instance = roka.core.oop.is_instance;

var path = roka.core.utils.get_dir( roka.core.utils.get_url(1) );

var test_api = function()
{
  var a = new Application();
  assert( is_instance( a.events, roka.async.observer.SubjectSet ) );
  assert( is_instance( a.tasks, roka.async.taskset.TaskSet ) );
  assert( is_instance( a.widgets, roka.dom.widgetset.WidgetSet ) );
  assert( a.tasks.length == 1 ); 
  assert( a.tasks.has( 'widgets-ready' ) ); 
  assert( a.events.subjects.ready == a.tasks.events.subjects.success );
  compare( a.path, path);
}

var test_path = function()
{
  new (function(){
    Application.prototype.constructor.call(this);
    compare(this.path, path);
  });
}
