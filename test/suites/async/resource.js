var Resource = roka.async.resource.Resource;

var test_basic = function()
{
  var r = new Resource();
  r.name = 'foo';
  r.url = '../misc/text/foobar';
  
  r.events.add_listener('load',function()
  {
    compare( r.request.response.text, 'Hello World');
    test_basic.result = true;
  });

  r.load();
}
test_basic.async = true;
