var Widget = roka.dom.widget.Widget;
var Layout = roka.dom.layout.Layout;
var is_instance = roka.core.oop.is_instance;

var jscore = /webkit/i.test(navigator.userAgent)&&!(new Error()).hasOwnProperty('stack');
var path =  !jscore && roka.core.utils.get_dir( roka.core.utils.get_url(1) ) || '';

if(jscore=='')
{
  log('Could not find working path');
}

var test_api = function()
{
  var w = new Widget();
  assert( is_instance( w.events, roka.async.observer.SubjectSet  ) );
  assert( is_instance( w.tasks, roka.async.taskset.TaskSet  ) );
  assert( w.layout == null);
  assert( w.application == null);
  compare( w.path, path );
}

var test_layout = function()
{
  var w = new Widget();
  var l = w.layout = new Layout();
  var ll = new Layout();

  assert( w.tasks.has( 'layout-ready' ) );
  assert( w.tasks.get('layout-ready').success_subject == l.events.subjects.ready );

  w.layout = null;
  assert( w.tasks.has('layout-ready') == false );
  
  w.layout = ll;
  assert( w.tasks.get('layout-ready').success_subject == ll.events.subjects.ready );

}

var test_path = function()
{
  new (function(){
    Widget.prototype.constructor.call(this);
    compare(this.path, path);
  });
}
