var DocumentSet = roka.async.documentset.DocumentSet;
var object_implements = roka.oop.iface.object_implements;

var test_basic = function()
{
  var mydocs = new DocumentSet();

  object_implements( mydocs, DocumentSet );

  mydocs.create('r','text/xml','../misc/text/ruz.xml',false,null );
  mydocs.create('st','text/plain','../misc/text/supertramp',false,null);
  mydocs.create('t','text/plain','../misc/text/torukmacto',true,'hello world');

  mydocs.events.add_listener('load',function()
  {
    assert( mydocs.get('r').content.childNodes[0].nodeName == 'dest' );
    assert( mydocs.get('r').fetched );
    assert( !mydocs.get('t').request );
    test_basic.result = true;
  });
  mydocs.load();
}
test_basic.async = true;

var test_err = function()
{
  var ds = new DocumentSet();
  ds.create('g','text/html','http://mozilla.com');
  ds.create('r','text/plain','../misc/text/supertramp');
  ds.events.add_listener('load',function()
  {
    test_err.result = false;
  });
  ds.events.add_listener('error',function()
  {
    test_err.result = true;
  })
  ds.load();
}
test_err.async = true;

var test_mimetype = function()
{
  var mydocs = window.parent.mydocs = new DocumentSet();

  mydocs.create('st','text/xml','../misc/text/xml',false,null);

  mydocs.events.add_listener('load',function()
  {
    assert( mydocs.get('st').content.constructor == XMLDocument );
    test_basic.result = true;
  });
  mydocs.load();
}
test_mimetype.async = true;
