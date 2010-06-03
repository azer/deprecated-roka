var ResourceSet = roka.async.resourceset.ResourceSet;

var test_basic = function()
{
  var r = new ResourceSet();
  r.create('ruz','../misc/text/ruz.xml','text/xml');
  r.create('supertramp','../misc/text/supertramp','text/xml');

  assert( r.state = -1 );
  
  r.events.add_listener('load',function()
  {
    assert( r.state == 1 );
    assert( r.get('ruz').request.response.xml.childNodes[0].nodeName == 'dest' );
    compare( r.get('supertramp').request.response.text.substring(0,10), 'supertramp' );
    test_basic.result = true;
  });
  
  r.load();
}
test_basic.async = true;

var test_error = function()
{
  var r = new ResourceSet();
  r.create('ruz','../misc/text/ruz.xml','text/xml');
  r.create('supertramp','404','text/xml');
  
  r.events.add_listener('load',function()
  {
    test_basic.result = false;
  });
  
  r.events.add_listener('error',function()
  {
    assert( r.state == 0 );
    test_error.result = true;
  });
  
  r.load();
}
test_error.async = true;
