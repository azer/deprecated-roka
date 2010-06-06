var Config = roka.core.config.Config;

var test_url = function()
{
  var c = new Config();
  compare( c.request.url , '/roka/test/suites/core/config.xml' );
}

var test_load = function()
{
  var c = new Config();
  c.request.url = '/roka/test/misc/config.xml';
  c.events.add_listener('load',function()
  {
    assert( c.document == c.request.response.xml );
    assert( c.request.response.xml.select('port')[0].textContent == '80' );
    test_load.result = true;
  });
  c.load();
}
test_load.async = true;

var test_get = function()
{
  var c = new Config();
  c.request.url = '/roka/test/misc/config.xml';
  c.events.add_listener('load',function()
  {
    compare( c.get('port'), '80' );
    test_get.result = true;
  });
  c.load();
}

test_get.async = true;
