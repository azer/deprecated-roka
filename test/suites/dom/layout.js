var Layout = roka.dom.layout.Layout;
var parse = roka.dom.utils.parse;
var create = roka.dom.utils.create;

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
