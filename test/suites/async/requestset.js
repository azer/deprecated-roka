var RequestSet = roka.async.requestset.RequestSet; 
var Request = roka.async.request.Request;

var test_basic = function()
{
  var texts = new RequestSet();
  texts.create('../misc/text/foobar','../misc/text/supertramp','../misc/text/torukmacto','../misc/text/ruz.xml');
  assert( texts.length == 4 );
  texts.del( '../misc/text/supertramp' );
  assert( texts.length == 3 );
}

var test_naming = function()
{
  var rs = new RequestSet();
  var r1 = new Request();
  var r2 = new Request();
  rs.set( 'r1', r1 );
  rs.set( 'r2', r2 );
  assert( rs.get('r1') == r1 );
  assert( rs.get('r2') == r2 );
}

var test_load = function()
{
  var texts = new RequestSet();
  texts.create('../misc/text/foobar','../misc/text/supertramp','../misc/text/ruz.xml');
  texts.events.add_listener('load',function()
  {
    try 
    {
      compare(texts.get('../misc/text/foobar').response.text,'Hello World');
      compare(texts.get('../misc/text/supertramp').response.text.substring(0,10),'supertramp');
      compare(texts.get('../misc/text/ruz.xml').response.xml.select('dest')[0].textContent,'Havana');
      test_load.result = true;
    } 
    catch(e)
    {
      log('\nERROR:',e.message);
      log(e.stack);
      test_load.result = false;
    }
  });
  texts.send();
}
test_load.async = true;

var test_err = function()
{
  var rs = new RequestSet();
  rs.create('404','../misc/text/foobar');
  rs.events.add_listener('load',function()
  {
    test_err.result = false;
  });
  rs.events.add_listener('error',function(req)
  {
    test_err.result = true;
  });
  rs.send();
}
test_err.async = true;

var test_nullurl = function()
{
  var rs = new RequestSet();
  rs.create(null,'../misc/text/foobar');
  rs.events.add_listener('load',function()
  {
    test_nullurl.result = true;
  });
  rs.send();
}
test_nullurl.async = true;

var test_del = function()
{
  var rs = new RequestSet();
  rs.create('404','../misc/text/foobar');
  rs.events.add_listener('load',function()
  {
    test_del.result = true;
  });
  rs.del('404');
  rs.send();
}
test_del.async = true;
