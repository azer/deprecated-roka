var Config = roka.core.config.Config;

var test_url = function()
{
  var c = new Config();
  c.url = 'config.xml';
  compare( c.request.url , 'config.xml' );
}

var test_load = function()
{
  var c = new Config();
  c.request.url = '/projects/roka/test/misc/config.xml';
  c.events.add_listener('load',function()
  {
    assert( c.request.response.xml.select('port')[0].textContent == '80' );
    test_load.result = true;
  });
  c.load();
}
test_load.async = true;

var test_get = function()
{
  var c = new Config();
  c.request.url = '/projects/roka/test/misc/config.xml';
  c.events.add_listener('load',function()
  {
    compare( c.get('port'), '80' );
    test_get.result = true;
  });
  c.load();
}

test_get.async = true;
