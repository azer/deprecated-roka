var Dict = roka.core.dict.Dict;

var test_formatting = function()
{
  var d = new Dict();
  d.set('foo',101);
  d.set('bar',102);

  compare( d.format('%(key)s:%(value)d'), 'foo:101, bar:102' );
  compare( d.format('%(key)s=%(value)d','&'), 'foo=101&bar=102' );

}

var test_basic = function()
{
 
  var d = new Dict();
  d.set('st1',101);
  d.set(2,102);
  d.set(window,103);
  d.set(window.open,104);
  
  assert( d.get(window,103) );
  assert( d.get(window.open,104) );

  assert(d.length==4);

  d.del(2);

  assert( d.length == 3 );
  assert( d.keys[1] == window );
  assert( d.values[1] == 103 );

  d.clear();
  assert( d.length == 0 );

}

var test_errors = function()
{

  var d = new Dict();

  try
  {
    d.del( 7 );
  }
  catch(exc)
  {
    assert( exc.constructor == roka.errors.NotFoundError );
  }

  try
  {
    d.get( 3 );
  }
  catch(exc)
  {
    assert( exc.constructor == roka.errors.NotFoundError );
  }

}

var test_loop = function()
{
  var d = new Dict();
  d.set(1,101);
  d.set(2,102);
  d.set(3,103);
  
  var scflag = [];
  d.for_each(function(key,value,dict){
    scflag[ key ] = value;
  });

  assert( scflag.length == 4 );
  assert( scflag[0] == undefined );
  assert( scflag[1] == 101 );
  assert( scflag[2] == 102 );
  assert( scflag[3] == 103 );
}

