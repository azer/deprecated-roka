var Request = roka.async.request.Request;

var test_basic = function()
{
  var req = new Request();
  req.url = '../misc/text/foobar';
  req.events.add_listener('load',function(request)
  {
    assert( req.load_state == 4 );
    assert( req.status == 200 );
    assert( req.status.toString() == 'OK' );
    compare(req._xhr_.responseText,'Hello World');
    test_basic.result = true;
  });
  req.send();
}
test_basic.async = true;

var test_params = function()
{
  var req = new Request();
  req.url = './';
  req.params.set('foo',101);
  req.params.set('bar',102);
  req.send();
}

var test_shortcut = function()
{
  var robj = roka.async.get('../misc/text/foobar',function(req){
    assert(robj == req);
    compare(req._xhr_.responseText,'Hello World');
    test_shortcut.result = true;
  });
}

test_shortcut.async = true;

var test_response = function()
{
  var req = new Request();
  req.url = '../misc/text/ruz.xml';
  req.events.add_listener('load',function(request)
  {
    try
    {
      assert( request.response.text.match('<dest>Havana</dest>\n') );
      compare( request.response.xml.query('//dest/text()')[0].nodeValue,  'Havana' );
      compare( request.response.xml.select('dest')[0].textContent,  'Havana' );

      test_response.result = true;
    } 
    catch(exc)
    {
      log('\nERROR: '+exc.message,'\n',exc.stack,'\n',exc.sourceURL);
    }
  });
  req.send();
  
}
test_response.async = true;

var test_error = function()
{
  var req = new Request();
  req.url = 'error404';
  req.events.add_listener('error',function(response,request)
  {
    test_error.result = true;
  });
  req.send();
}
test_error.async = true;
