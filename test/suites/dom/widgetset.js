var Widget = roka.dom.widget.Widget;
var WidgetSet = roka.dom.widgetset.WidgetSet;

var test_readyevent = function()
{
  var w1 = new Widget();
  var w2 = new Widget();
  var w3 = new Widget();

  var ws = new WidgetSet();
  ws.set('w1',w1);
  ws.set('w2',w2);
  ws.set('w3',w3);

  assert( ws.tasks.length == 3 );

  ws.events.add_listener('ready',function()
  {
    try
    {
      compare( w1.tasks.state, roka.async.task.SUCCESS );
      compare( w2.tasks.state, roka.async.task.SUCCESS );
      compare( w3.tasks.state, roka.async.task.SUCCESS );
      test_readyevent.result = true;
    }
    catch(excinfo)
    {
      log('\nERROR: ',excinfo.message,'\n',excinfo.stack,'\n');
    }
  });

  ws.for_each(function(key,widget)
  {
    widget.tasks.events.fire('success');
  });

}

test_readyevent.async = true;
