var format = roka.core.utils.format;
var ljust = roka.core.utils.ljust;
var repr = roka.core.utils.repr;
var is_array = roka.core.utils.is_array;

var test_format = function(){
  compare( 
    format('roka %(version)s',roka.env),
    'roka '+roka.env.version
  );

  var datedict = { 'hello':'Ha lo', 'Y':2010, 'm':'01', 'd':28, 'hour':'08', 'minutes':'50' };

  compare(
    format('%(hello)s. (%%y-%%m-%%d) %Y-%m-%d %(hour)s:%(minutes)s',datedict),
    'Ha lo. (%y-%m-%d) 2010-01-28 08:50'
  );

}

var test_is_array = function()
{
  assert( is_array( [] ) );
  document && assert( is_array(  document.documentElement.childNodes ) );
  window && assert( ! is_array( window ) );
};


var test_ljust = function(){
  compare( ljust('1',3,'0'), '001' );
  compare( ljust('1',3), '  1' );
  compare( ljust('01',3), ' 01' );
  compare( ljust('001',3), '001' );
}

var test_geturl = function()
{
  assert( roka.core.utils.get_url().indexOf( '/roka/test/suites/core/utils.js' ) );
}

var test_getdir = function()
{
  compare( roka.core.utils.get_dir( 'http://dev.kodfabrik.com/roka/test/suites/core/utils.js'  ) , '/roka/test/suites/core' );
  compare( roka.core.utils.get_dir('../../hello/world/'), '../../hello/world' );
  compare( roka.core.utils.get_dir('http://a.b.c/x/y/z-i_t/foo'), '/x/y/z-i_t' );
}

var test_getfilename = function()
{
  compare( roka.core.utils.get_filename('http://dev.kodfabrik.com/roka/test/suites/core/utils.js') ,'utils.js');
}

var test_repr = function()
{
  compare('<A a attr="value">',repr('A','a',{ attr:'value' }));
  compare(
    '<A a attr1="foo" attr2="bar" attr3="1" attr4="null" attr5="toString">',
    repr('A','a',{
      'attr1':'foo',
      'attr2':'bar',
      'attr3':1,
      'attr4':null,
      'attr5':{ toString:function(){ return 'toString' } }
      })
  );
}
