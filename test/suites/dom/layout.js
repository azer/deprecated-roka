var Layout = roka.dom.layout.Layout;
var parse = roka.dom.utils.parse;
var create = roka.dom.utils.create;

var path = roka.core.utils.get_dir( roka.core.utils.get_url(1) );

var test_basic = function()
{
  var l = new Layout();

  // events
  assert( ['build','insert','ready'].every(function(evname)
  {
    return l.events.has( evname );
  }));

  // tasks
  assert( l.tasks.length == 1);
  assert( l.tasks.has('build') );
  compare( l.path, path );
}

var test_readyevent= function()
{
  var l = new Layout();
  l.events.add_listener('ready',function()
  {
    test_readyevent.result = true;
  });
  l.events.fire('build');
}

test_readyevent.async = true;

var test_path = function()
{
  new (function(){
    Layout.prototype.constructor.call(this);
    compare(this.path, path);
  });
}
